"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const audit_actions_service_1 = require("../../modules/audit/recorder/services/audit-actions.service");
let UploadsService = UploadsService_1 = class UploadsService {
    config;
    auditActions;
    logger = new common_1.Logger(UploadsService_1.name);
    configured = false;
    defaultFolder;
    maxImageBytes;
    maxDocBytes;
    maxVideoBytes;
    allowedImageMimes;
    allowedDocMimes;
    allowedVideoMimes;
    constructor(config, auditActions) {
        this.config = config;
        this.auditActions = auditActions;
        this.defaultFolder =
            this.config.get("CLOUDINARY_FOLDER")?.trim() || "app";
        this.maxImageBytes = this.parseMbToBytes(this.config.get("UPLOAD_MAX_IMAGE_MB"), 5);
        this.maxDocBytes = this.parseMbToBytes(this.config.get("UPLOAD_MAX_DOC_MB"), 10);
        this.maxVideoBytes = this.parseMbToBytes(this.config.get("UPLOAD_MAX_VIDEO_MB"), 50);
        this.allowedImageMimes = this.parseList(this.config.get("UPLOAD_ALLOWED_IMAGE_MIME"), "image/jpeg,image/png,image/webp,image/gif");
        this.allowedDocMimes = this.parseList(this.config.get("UPLOAD_ALLOWED_DOC_MIME"), "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        this.allowedVideoMimes = this.parseList(this.config.get("UPLOAD_ALLOWED_VIDEO_MIME"), "video/mp4,video/webm,video/ogg");
    }
    onModuleInit() {
        const cloudName = this.config.get("CLOUDINARY_CLOUD_NAME")?.trim();
        const apiKey = this.config.get("CLOUDINARY_API_KEY")?.trim();
        const apiSecret = this.config.get("CLOUDINARY_API_SECRET")?.trim();
        if (!cloudName || !apiKey || !apiSecret) {
            this.logger.warn("Cloudinary non configuré : uploads désactivés (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).");
            return;
        }
        cloudinary_1.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
        });
        this.configured = true;
    }
    ensureConfigured() {
        if (!this.configured) {
            throw new common_1.ServiceUnavailableException("Le service d'upload n'est pas configuré.");
        }
    }
    processImageUpload(file, meta, actorUserId) {
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
    processFileUpload(file, meta, actorUserId) {
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
    processBase64Upload(dto, actorUserId) {
        const file = this.parseBase64ToMemoryFile(dto);
        return this.processFileUpload(file, {}, actorUserId);
    }
    processVideoUpload(file, meta) {
        this.requireMultipartFile(file);
        return this.uploadVideo(file, {
            category: this.resolveCategory(meta),
        });
    }
    resolveCategory(meta) {
        const raw = meta.category?.trim();
        return raw && raw.length > 0 ? raw : "general";
    }
    requireMultipartFile(file) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException("Aucun fichier fourni");
        }
    }
    parseBase64ToMemoryFile(dto) {
        const raw = dto.content?.trim();
        if (!raw) {
            throw new common_1.BadRequestException("Aucun contenu fourni");
        }
        const dataUriMatch = /^data:([^;]+);base64,(.+)$/is.exec(raw);
        if (!dataUriMatch) {
            throw new common_1.BadRequestException("content doit être une data URI (data:<mime>;base64,...)");
        }
        const mime = dataUriMatch[1].trim().toLowerCase();
        const base64Payload = dataUriMatch[2].replace(/\s/g, "");
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Payload)) {
            throw new common_1.BadRequestException("Contenu base64 invalide");
        }
        let buffer;
        try {
            buffer = Buffer.from(base64Payload, "base64");
        }
        catch {
            throw new common_1.BadRequestException("Contenu base64 invalide");
        }
        if (!buffer.length) {
            throw new common_1.BadRequestException("Aucun contenu fourni");
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
    parseMbToBytes(value, defaultMb) {
        const num = Number(value);
        const mb = Number.isFinite(num) && num > 0 ? num : defaultMb;
        return Math.floor(mb * 1024 * 1024);
    }
    parseList(value, fallback) {
        const source = (value && value.trim().length > 0 ? value : fallback).trim();
        return source
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
    }
    ensureMimeAllowed(mime, allowed, kind) {
        const m = (mime || "").toLowerCase();
        if (!allowed.includes(m)) {
            throw new common_1.BadRequestException(`${kind} type not allowed. Allowed: ${allowed.join(", ")}`);
        }
    }
    ensureSizeAllowed(size, maxBytes, kind) {
        const s = Number.isFinite(size) ? size : 0;
        if (s <= 0) {
            throw new common_1.BadRequestException(`No ${kind} content provided`);
        }
        if (s > maxBytes) {
            throw new common_1.BadRequestException(`${kind} too large. Max ${(maxBytes / (1024 * 1024)).toFixed(0)}MB`);
        }
    }
    validateImage(file) {
        const size = file?.size ?? file?.buffer?.length ?? 0;
        this.ensureSizeAllowed(size, this.maxImageBytes, "image");
        this.ensureMimeAllowed(file?.mimetype, this.allowedImageMimes, "image");
    }
    validateDoc(file) {
        const size = file?.size ?? file?.buffer?.length ?? 0;
        this.ensureSizeAllowed(size, this.maxDocBytes, "document");
        this.ensureMimeAllowed(file?.mimetype, this.allowedDocMimes, "document");
    }
    validateVideo(file) {
        const size = file?.size ?? file?.buffer?.length ?? 0;
        this.ensureSizeAllowed(size, this.maxVideoBytes, "video");
        this.ensureMimeAllowed(file?.mimetype, this.allowedVideoMimes, "video");
    }
    async ensureCategoryFolders(category) {
        const base = `${this.defaultFolder}/${category}`;
        const targets = [`${base}/images`, `${base}/videos`, `${base}/docs`];
        for (const path of targets) {
            try {
                await cloudinary_1.v2.api.create_folder(path);
            }
            catch (e) {
                if (e?.http_code && e.http_code !== 409) {
                    throw e;
                }
            }
        }
    }
    async uploadPngBuffer(buffer, options) {
        if (!buffer?.length) {
            throw new common_1.BadRequestException("No image content provided");
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
    async uploadImage(file, options) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException("No file provided");
        }
        this.validateImage(file);
        const category = (options?.category || "general").trim();
        await this.ensureCategoryFolders(category);
        const computedFolder = `${this.defaultFolder}/${category}/images`;
        const folder = options?.folder || computedFolder;
        const uploadOptions = {
            folder,
            overwrite: options?.overwrite ?? false,
            public_id: options?.publicId,
            resource_type: "image",
        };
        const res = await this.uploadBuffer(file, uploadOptions);
        return this.mapResponse(res);
    }
    async uploadFile(file, options) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException("No file provided");
        }
        const mime = (file.mimetype || "").toLowerCase();
        if (mime.startsWith("image/"))
            this.validateImage(file);
        else if (mime.startsWith("video/"))
            this.validateVideo(file);
        else
            this.validateDoc(file);
        const category = (options?.category || "general").trim();
        await this.ensureCategoryFolders(category);
        const isImage = (file.mimetype || "").startsWith("image/");
        const isVideo = (file.mimetype || "").startsWith("video/");
        const sub = isImage ? "images" : isVideo ? "videos" : "docs";
        const computedFolder = `${this.defaultFolder}/${category}/${sub}`;
        const folder = options?.folder || computedFolder;
        const resourceType = options?.resourceType || (isImage ? "image" : isVideo ? "video" : "raw");
        let fileFormat;
        if (resourceType === "raw") {
            if (mime === "application/pdf") {
                fileFormat = "pdf";
            }
            else if (mime.includes("wordprocessingml")) {
                fileFormat = "docx";
            }
            else if (mime.includes("spreadsheetml")) {
                fileFormat = "xlsx";
            }
            else if (mime.includes("presentationml")) {
                fileFormat = "pptx";
            }
        }
        let publicId = options?.publicId;
        const originalName = file.originalname || file.filename;
        const uploadOptions = {
            folder,
            overwrite: options?.overwrite ?? false,
            resource_type: resourceType,
        };
        if (resourceType === "raw") {
            if (publicId) {
                if (fileFormat && !publicId.endsWith(`.${fileFormat}`)) {
                    publicId = `${publicId}.${fileFormat}`;
                }
                uploadOptions.public_id = publicId;
            }
            else if (originalName) {
                const fileName = originalName.split("/").pop() || originalName;
                const nameParts = fileName.split(".");
                const extension = nameParts.length > 1 ? `.${nameParts.pop()}` : "";
                const baseName = nameParts.join(".");
                const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, "_");
                const cleanName = `${cleanBaseName}${extension}`;
                uploadOptions.public_id = cleanName;
            }
            else {
                if (fileFormat) {
                    uploadOptions.public_id = `${Date.now()}.${fileFormat}`;
                }
            }
        }
        else {
            if (publicId) {
                uploadOptions.public_id = publicId;
            }
        }
        const res = await this.uploadBuffer(file, uploadOptions);
        return this.mapResponse(res);
    }
    async uploadVideo(file, options) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException("No file provided");
        }
        this.validateVideo(file);
        const category = (options?.category || "general").trim();
        await this.ensureCategoryFolders(category);
        const computedFolder = `${this.defaultFolder}/${category}/videos`;
        const folder = options?.folder || computedFolder;
        const uploadOptions = {
            folder,
            overwrite: options?.overwrite ?? false,
            public_id: options?.publicId,
            resource_type: "video",
        };
        const res = await this.uploadBuffer(file, uploadOptions);
        return this.mapResponse(res);
    }
    async delete(publicId) {
        if (!publicId) {
            throw new common_1.BadRequestException("publicId is required");
        }
        this.ensureConfigured();
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "image",
        });
        return { result };
    }
    async uploadBuffer(file, opts) {
        this.ensureConfigured();
        const base64 = file.buffer.toString("base64");
        const mime = file.mimetype || "application/octet-stream";
        const dataUri = `data:${mime};base64,${base64}`;
        try {
            const result = await cloudinary_1.v2.uploader.upload(dataUri, opts);
            result.originalMime = mime;
            return result;
        }
        catch (error) {
            this.rethrowCloudinaryUploadError(error);
        }
    }
    rethrowCloudinaryUploadError(error) {
        const err = error;
        const message = err?.message?.trim();
        const httpCode = err?.http_code;
        if (httpCode && httpCode >= 400 && httpCode < 500) {
            throw new common_1.BadRequestException(message || "Fichier invalide ou refusé par le service d’hébergement");
        }
        if (message && /invalid\s+(image|video|file|format)/i.test(message)) {
            throw new common_1.BadRequestException(message);
        }
        throw error instanceof Error ? error : new Error(String(error));
    }
    mapResponse(res) {
        let format = res.format;
        if (!format && res.originalMime) {
            const mime = res.originalMime.toLowerCase();
            if (mime === "application/pdf") {
                format = "pdf";
            }
            else if (mime.includes("wordprocessingml")) {
                format = "docx";
            }
            else if (mime.includes("spreadsheetml")) {
                format = "xlsx";
            }
            else if (mime.includes("presentationml")) {
                format = "pptx";
            }
            else if (mime.startsWith("image/")) {
                format = mime.split("/")[1];
            }
            else if (mime.startsWith("video/")) {
                format = mime.split("/")[1];
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
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = UploadsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        audit_actions_service_1.AuditActionsService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map