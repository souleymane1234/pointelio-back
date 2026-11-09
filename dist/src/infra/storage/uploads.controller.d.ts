import { UploadBase64Dto } from "./dto/upload-base64.dto";
import { UploadCategoryDto } from "./dto/upload-category.dto";
import type { MemoryUploadedFile } from "./types/memory-uploaded-file";
import { UploadsService } from "./uploads.service";
import { type AuthedRequest } from "../../common/types/request-context";
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadContent(req: AuthedRequest, file: MemoryUploadedFile, body: UploadCategoryDto): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
    uploadContentBase64(req: AuthedRequest, body: UploadBase64Dto): Promise<{
        url: any;
        secureUrl: any;
        publicId: any;
        resourceType: any;
        bytes: any;
        format: any;
        width: any;
        height: any;
    }>;
}
