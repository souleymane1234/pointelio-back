"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadSingleFileCreated = UploadSingleFileCreated;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const MULTIPART_FILE_SIZE_CAP = 100 * 1024 * 1024;
function UploadSingleFileCreated() {
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: MULTIPART_FILE_SIZE_CAP },
    })), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED));
}
//# sourceMappingURL=upload-single-file.decorator.js.map