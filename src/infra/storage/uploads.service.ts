import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import { AuditActionsService } from "../../modules/audit/recorder/services/audit-actions.service";
import { UploadBase64Dto } from "./dto/upload-base64.dto";
import { UploadCategoryDto } from "./dto/upload-category.dto";
import type { MemoryUploadedFile } from "./types/memory-uploaded-file";

type UploadImageOptions = {
  folder?: string; // overrides computed folder
  overwrite?: boolean;
  publicId?: string;
  category?: string; // will create/use <BASE>/<category>/images
};

type UploadFileOptions = {
  folder?: string; // overrides computed folder
  overwrite?: boolean;
  publicId?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  category?: string; // will create/use <BASE>/<category>/(videos|docs)
};

@Injectable()
export class UploadsService implements OnModuleInit {
  private readonly logger = new Logger(UploadsService.name);
  private configured = false;
  private readonly defaultFolder: string;
  private readonly maxImageBytes: number;
  private readonly maxDocBytes: number;
  private readonly maxVideoBytes: number;
  private readonly allowedImageMimes: string[];
  private readonly allowedDocMimes: string[];
  private readonly allowedVideoMimes: string[];

  constructor(
    private readonly config: ConfigService,
    private readonly auditActions: AuditActionsService,
  ) {
    this.defaultFolder =
      this.config.get<string>("CLOUDINARY_FOLDER")?.trim() || "app";
    this.maxImageBytes = this.parseMbToBytes(
      this.config.get<string>("UPLOAD_MAX_IMAGE_MB"),
      5,
    );
    this.maxDocBytes = this.parseMbToBytes(
      this.config.get<string>("UPLOAD_MAX_DOC_MB"),
      10,
    );
    this.maxVideoBytes = this.parseMbToBytes(
      this.config.get<string>("UPLOAD_MAX_VIDEO_MB"),
      50,
    );
    this.allowedImageMimes = this.parseList(
      this.config.get<string>("UPLOAD_ALLOWED_IMAGE_MIME"),
      "image/jpeg,image/png,image/webp,image/gif",
    );
    this.allowedDocMimes = this.parseList(
      this.config.get<string>("UPLOAD_ALLOWED_DOC_MIME"),
      "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    this.allowedVideoMimes = this.parseList(
      this.config.get<string>("UPLOAD_ALLOWED_VIDEO_MIME"),
      "video/mp4,video/webm,video/ogg",
    );
  }

  onModuleInit(): void {
    const cloudName = this.config.get<string>("CLOUDINARY_CLOUD_NAME")?.trim();
    const apiKey = this.config.get<string>("CLOUDINARY_API_KEY")?.trim();
    const apiSecret = this.config.get<string>("CLOUDINARY_API_SECRET")?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.warn(
        "Cloudinary non configuré : uploads désactivés (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
      );
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    this.configured = true;
  }

  private ensureConfigured(): void {
    if (!this.configured) {
      throw new ServiceUnavailableException(
        "Le service d'upload n'est pas configuré.",
      );
    }
  }

  /** Point d’entrée HTTP : fichier + catégorie issue du multipart. */
  processImageUpload(
    file: MemoryUploadedFile | undefined,
    meta: UploadCategoryDto,
    actorUserId?: number,
  ) {
    this.requireMultipartFile(file);
    return this.uploadImage(file, {
      category: this.resolveCategory(meta),
    }).then(async (uploaded) => {
      if (actorUserId && uploaded.publicId) {
        await this.auditActions.fileUploaded(actorUserId, uploaded.publicId, {
          category: this.resolveCategory(meta),
          resourceType: uploaded.resourceType,
          bytes: uploaded.bytes,
          format: uploaded.format,
        });
      }
      return uploaded;
    });
  }

  processFileUpload(
    file: MemoryUploadedFile | undefined,
    meta: UploadCategoryDto,
    actorUserId?: number,
  ) {
    this.requireMultipartFile(file);
    return this.uploadFile(file, {
      category: this.resolveCategory(meta),
    }).then(async (uploaded) => {
      if (actorUserId && uploaded.publicId) {
        await this.auditActions.fileUploaded(actorUserId, uploaded.publicId, {
          category: this.resolveCategory(meta),
          resourceType: uploaded.resourceType,
          bytes: uploaded.bytes,
          format: uploaded.format,
        });
      }
      return uploaded;
    });
  }

  /** Point d’entrée HTTP : contenu base64 JSON (data URI uniquement). */
  processBase64Upload(dto: UploadBase64Dto, actorUserId?: number) {
    const file = this.parseBase64ToMemoryFile(dto);
    return this.processFileUpload(file, {}, actorUserId);
  }

  processVideoUpload(
    file: MemoryUploadedFile | undefined,
    meta: UploadCategoryDto,
  ) {
    this.requireMultipartFile(file);
    return this.uploadVideo(file, {
      category: this.resolveCategory(meta),
    });
  }

  private resolveCategory(meta: UploadCategoryDto): string {
    const raw = meta.category?.trim();
    return raw && raw.length > 0 ? raw : "general";
  }

  private requireMultipartFile(
    file: MemoryUploadedFile | undefined,
  ): asserts file is MemoryUploadedFile {
    if (!file?.buffer?.length) {
      throw new BadRequestException("Aucun fichier fourni");
    }
  }

  private parseBase64ToMemoryFile(dto: UploadBase64Dto): MemoryUploadedFile {
    const raw = dto.content?.trim();
    if (!raw) {
      throw new BadRequestException("Aucun contenu fourni");
    }

    const dataUriMatch = /^data:([^;]+);base64,(.+)$/is.exec(raw);
    if (!dataUriMatch) {
      throw new BadRequestException(
        "content doit être une data URI (data:<mime>;base64,...)",
      );
    }

    const mime = dataUriMatch[1].trim().toLowerCase();
    const base64Payload = dataUriMatch[2].replace(/\s/g, "");

    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Payload)) {
      throw new BadRequestException("Contenu base64 invalide");
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64Payload, "base64");
    } catch {
      throw new BadRequestException("Contenu base64 invalide");
    }

    if (!buffer.length) {
      throw new BadRequestException("Aucun contenu fourni");
    }

    const ext = mime.includes("/") ? mime.split("/")[1] : "bin";
    const originalname = `upload.${ext}`;

    return {
      fieldname: "file",
      originalname,
      encoding: "7bit",
      mimetype: mime,
      size: buffer.length,
      buffer,
    };
  }

  private parseMbToBytes(value: string | undefined, defaultMb: number): number {
    const num = Number(value);
    const mb = Number.isFinite(num) && num > 0 ? num : defaultMb;
    return Math.floor(mb * 1024 * 1024);
  }

  private parseList(value: string | undefined, fallback: string): string[] {
    const source = (value && value.trim().length > 0 ? value : fallback).trim();
    return source
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }

  private ensureMimeAllowed(
    mime: string | undefined,
    allowed: string[],
    kind: string,
  ) {
    const m = (mime || "").toLowerCase();
    if (!allowed.includes(m)) {
      throw new BadRequestException(
        `${kind} type not allowed. Allowed: ${allowed.join(", ")}`,
      );
    }
  }

  private ensureSizeAllowed(
    size: number | undefined,
    maxBytes: number,
    kind: string,
  ) {
    const s = Number.isFinite(size as number) ? (size as number) : 0;
    if (s <= 0) {
      throw new BadRequestException(`No ${kind} content provided`);
    }
    if (s > maxBytes) {
      throw new BadRequestException(
        `${kind} too large. Max ${(maxBytes / (1024 * 1024)).toFixed(0)}MB`,
      );
    }
  }

  private validateImage(file: any) {
    const size = file?.size ?? file?.buffer?.length ?? 0;
    this.ensureSizeAllowed(size, this.maxImageBytes, "image");
    this.ensureMimeAllowed(file?.mimetype, this.allowedImageMimes, "image");
  }

  private validateDoc(file: any) {
    const size = file?.size ?? file?.buffer?.length ?? 0;
    this.ensureSizeAllowed(size, this.maxDocBytes, "document");
    this.ensureMimeAllowed(file?.mimetype, this.allowedDocMimes, "document");
  }

  private validateVideo(file: any) {
    const size = file?.size ?? file?.buffer?.length ?? 0;
    this.ensureSizeAllowed(size, this.maxVideoBytes, "video");
    this.ensureMimeAllowed(file?.mimetype, this.allowedVideoMimes, "video");
  }

  private async ensureCategoryFolders(category: string) {
    const base = `${this.defaultFolder}/${category}`;
    const targets = [`${base}/images`, `${base}/videos`, `${base}/docs`];
    for (const path of targets) {
      try {
        // Will auto-succeed if exists, or throw; we ignore errors other than auth
        await (cloudinary as any).api.create_folder(path);
      } catch (e: any) {
        // Ignore "already exists" or similar; rethrow for auth/misconfig
        if (e?.http_code && e.http_code !== 409) {
          throw e;
        }
      }
    }
  }

  /** Upload d’un buffer PNG (ex. QR code généré côté serveur). */
  async uploadPngBuffer(
    buffer: Buffer,
    options?: {
      category?: string;
      publicId?: string;
      overwrite?: boolean;
    },
  ) {
    if (!buffer?.length) {
      throw new BadRequestException("No image content provided");
    }

    const file = {
      buffer,
      mimetype: "image/png",
      size: buffer.length,
    };

    this.validateImage(file);
    const category = (options?.category || "general").trim();
    await this.ensureCategoryFolders(category);
    const folder = `${this.defaultFolder}/${category}/images`;

    const res = await this.uploadBuffer(file, {
      folder,
      overwrite: options?.overwrite ?? true,
      public_id: options?.publicId,
      resource_type: "image",
    });

    return this.mapResponse(res);
  }

  async uploadImage(file: any, options?: UploadImageOptions) {
    if (!file || !file.buffer) {
      throw new BadRequestException("No file provided");
    }
    this.validateImage(file);
    const category = (options?.category || "general").trim();
    await this.ensureCategoryFolders(category);
    const computedFolder = `${this.defaultFolder}/${category}/images`;
    const folder = options?.folder || computedFolder;

    const uploadOptions: any = {
      folder,
      overwrite: options?.overwrite ?? false,
      public_id: options?.publicId,
      resource_type: "image",
    };

    const res = await this.uploadBuffer(file, uploadOptions);
    return this.mapResponse(res);
  }

  async uploadFile(file: any, options?: UploadFileOptions) {
    if (!file || !file.buffer) {
      throw new BadRequestException("No file provided");
    }
    const mime = (file.mimetype || "").toLowerCase();
    if (mime.startsWith("image/")) this.validateImage(file);
    else if (mime.startsWith("video/")) this.validateVideo(file);
    else this.validateDoc(file);
    const category = (options?.category || "general").trim();
    await this.ensureCategoryFolders(category);
    const isImage = (file.mimetype || "").startsWith("image/");
    const isVideo = (file.mimetype || "").startsWith("video/");
    const sub = isImage ? "images" : isVideo ? "videos" : "docs";
    const computedFolder = `${this.defaultFolder}/${category}/${sub}`;
    const folder = options?.folder || computedFolder;
    const resourceType =
      options?.resourceType || (isImage ? "image" : isVideo ? "video" : "raw");

    // Détecter le format depuis le MIME type pour les fichiers raw
    let fileFormat: string | undefined;
    if (resourceType === "raw") {
      if (mime === "application/pdf") {
        fileFormat = "pdf";
      } else if (mime.includes("wordprocessingml")) {
        fileFormat = "docx";
      } else if (mime.includes("spreadsheetml")) {
        fileFormat = "xlsx";
      } else if (mime.includes("presentationml")) {
        fileFormat = "pptx";
      }
    }

    // Pour les fichiers raw, utiliser le nom de fichier original pour préserver l'extension
    let publicId = options?.publicId;
    const originalName = file.originalname || file.filename;

    const uploadOptions: any = {
      folder,
      overwrite: options?.overwrite ?? false,
      resource_type: resourceType,
    };

    // Pour les fichiers raw, préserver le nom de fichier original avec son extension
    if (resourceType === "raw") {
      if (publicId) {
        // Si un publicId est fourni, s'assurer qu'il a l'extension si fileFormat est détecté
        if (fileFormat && !publicId.endsWith(`.${fileFormat}`)) {
          publicId = `${publicId}.${fileFormat}`;
        }
        uploadOptions.public_id = publicId;
      } else if (originalName) {
        // Utiliser le nom de fichier original complet avec son extension
        // Extraire juste le nom de fichier sans le chemin
        const fileName = originalName.split("/").pop() || originalName;
        // Nettoyer le nom mais préserver l'extension complète
        // Remplacer les caractères spéciaux sauf le point et l'extension
        const nameParts = fileName.split(".");
        const extension = nameParts.length > 1 ? `.${nameParts.pop()}` : "";
        const baseName = nameParts.join(".");
        const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, "_");
        const cleanName = `${cleanBaseName}${extension}`;

        // Utiliser le nom complet avec extension comme public_id
        // Cela garantit que Cloudinary préserve l'extension dans l'URL et le Content-Type
        uploadOptions.public_id = cleanName; // Nom complet avec extension (.pdf, .docx, etc.)
      } else {
        // Si aucun nom n'est disponible, générer un ID avec l'extension
        if (fileFormat) {
          uploadOptions.public_id = `${Date.now()}.${fileFormat}`;
        }
      }
    } else {
      // Pour les images et vidéos, utiliser le publicId fourni ou laisser Cloudinary générer
      if (publicId) {
        uploadOptions.public_id = publicId;
      }
    }

    const res = await this.uploadBuffer(file, uploadOptions);

    return this.mapResponse(res);
  }

  async uploadVideo(file: any, options?: UploadFileOptions) {
    if (!file || !file.buffer) {
      throw new BadRequestException("No file provided");
    }
    this.validateVideo(file);
    const category = (options?.category || "general").trim();
    await this.ensureCategoryFolders(category);
    const computedFolder = `${this.defaultFolder}/${category}/videos`;
    const folder = options?.folder || computedFolder;

    const uploadOptions: any = {
      folder,
      overwrite: options?.overwrite ?? false,
      public_id: options?.publicId,
      resource_type: "video",
    };

    const res = await this.uploadBuffer(file, uploadOptions);
    return this.mapResponse(res);
  }

  async delete(publicId: string) {
    if (!publicId) {
      throw new BadRequestException("publicId is required");
    }

    this.ensureConfigured();
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return { result };
  }

  private async uploadBuffer(file: any, opts: any): Promise<any> {
    this.ensureConfigured();
    // Use data URI to avoid extra streaming deps
    const base64 = file.buffer.toString("base64");
    const mime = file.mimetype || "application/octet-stream";
    const dataUri = `data:${mime};base64,${base64}`;
    try {
      const result = await cloudinary.uploader.upload(dataUri, opts);
      result.originalMime = mime;
      return result;
    } catch (error: unknown) {
      this.rethrowCloudinaryUploadError(error);
    }
  }

  private rethrowCloudinaryUploadError(error: unknown): never {
    const err = error as { http_code?: number; message?: string };
    const message = err?.message?.trim();
    const httpCode = err?.http_code;

    if (httpCode && httpCode >= 400 && httpCode < 500) {
      throw new BadRequestException(
        message || "Fichier invalide ou refusé par le service d’hébergement",
      );
    }

    if (message && /invalid\s+(image|video|file|format)/i.test(message)) {
      throw new BadRequestException(message);
    }

    throw error instanceof Error ? error : new Error(String(error));
  }

  private mapResponse(res: any) {
    // Détecter le format depuis le MIME type si Cloudinary ne l'a pas retourné
    let format = res.format;
    if (!format && res.originalMime) {
      const mime = res.originalMime.toLowerCase();
      if (mime === "application/pdf") {
        format = "pdf";
      } else if (mime.includes("wordprocessingml")) {
        format = "docx";
      } else if (mime.includes("spreadsheetml")) {
        format = "xlsx";
      } else if (mime.includes("presentationml")) {
        format = "pptx";
      } else if (mime.startsWith("image/")) {
        format = mime.split("/")[1]; // extraire 'jpeg', 'png', etc.
      } else if (mime.startsWith("video/")) {
        format = mime.split("/")[1]; // extraire 'mp4', 'webm', etc.
      }
    }

    return {
      url: res.url,
      secureUrl: res.secure_url,
      publicId: res.public_id,
      resourceType: res.resource_type,
      bytes: res.bytes,
      format: format,
      width: res.width,
      height: res.height,
    };
  }
}
