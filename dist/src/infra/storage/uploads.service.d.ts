import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuditActionsService } from "../../modules/audit/recorder/services/audit-actions.service";
import { UploadBase64Dto } from "./dto/upload-base64.dto";
import { UploadCategoryDto } from "./dto/upload-category.dto";
import type { MemoryUploadedFile } from "./types/memory-uploaded-file";
type UploadImageOptions = {
    folder?: string;
    overwrite?: boolean;
    publicId?: string;
    category?: string;
};
type UploadFileOptions = {
    folder?: string;
    overwrite?: boolean;
    publicId?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
    category?: string;
};
export declare class UploadsService implements OnModuleInit {
    private readonly config;
    private readonly auditActions;
    private readonly logger;
    private configured;
    private readonly defaultFolder;
    private readonly maxImageBytes;
    private readonly maxDocBytes;
    private readonly maxVideoBytes;
    private readonly allowedImageMimes;
    private readonly allowedDocMimes;
    private readonly allowedVideoMimes;
    constructor(config: ConfigService, auditActions: AuditActionsService);
    onModuleInit(): void;
    private ensureConfigured;
    processImageUpload(file: MemoryUploadedFile | undefined, meta: UploadCategoryDto, actorUserId?: number): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
    processFileUpload(file: MemoryUploadedFile | undefined, meta: UploadCategoryDto, actorUserId?: number): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
    processBase64Upload(dto: UploadBase64Dto, actorUserId?: number): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
    processVideoUpload(file: MemoryUploadedFile | undefined, meta: UploadCategoryDto): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
    private resolveCategory;
    private requireMultipartFile;
    private parseBase64ToMemoryFile;
    private parseMbToBytes;
    private parseList;
    private ensureMimeAllowed;
    private ensureSizeAllowed;
    private validateImage;
    private validateDoc;
    private validateVideo;
    private ensureCategoryFolders;
    uploadPngBuffer(buffer: Buffer, options?: {
        category?: string;
        publicId?: string;
        overwrite?: boolean;
    }): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
    uploadImage(file: any, options?: UploadImageOptions): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
    uploadFile(file: any, options?: UploadFileOptions): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
    uploadVideo(file: any, options?: UploadFileOptions): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
    delete(publicId: string): Promise<{
        result: any;
    }>;
    private uploadBuffer;
    private rethrowCloudinaryUploadError;
    private mapResponse;
}
export {};
