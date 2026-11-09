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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const api_audience_decorator_1 = require("../../common/decorators/api-audience.decorator");
const api_upload_decorator_1 = require("./decorators/api-upload.decorator");
const upload_single_file_decorator_1 = require("./decorators/upload-single-file.decorator");
const upload_base64_dto_1 = require("./dto/upload-base64.dto");
const upload_category_dto_1 = require("./dto/upload-category.dto");
const uploads_service_1 = require("./uploads.service");
const request_context_1 = require("../../common/types/request-context");
let UploadsController = class UploadsController {
    uploadsService;
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    uploadContent(req, file, body) {
        const actorUserId = (0, request_context_1.getUserId)(req);
        return this.uploadsService.processFileUpload(file, body, actorUserId);
    }
    uploadContentBase64(req, body) {
        const actorUserId = (0, request_context_1.getUserId)(req);
        return this.uploadsService.processBase64Upload(body, actorUserId);
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)("content"),
    (0, api_upload_decorator_1.ApiUploadFileDocs)(),
    (0, upload_single_file_decorator_1.UploadSingleFileCreated)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, upload_category_dto_1.UploadCategoryDto]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadContent", null);
__decorate([
    (0, common_1.Post)("content/base64"),
    (0, api_upload_decorator_1.ApiUploadBase64Docs)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_base64_dto_1.UploadBase64Dto]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadContentBase64", null);
exports.UploadsController = UploadsController = __decorate([
    (0, api_upload_decorator_1.ApiUploadsTag)(),
    (0, api_audience_decorator_1.ApiAudience)("mobile", "employeur"),
    (0, api_upload_decorator_1.ApiUploadBearer)(),
    (0, common_1.Controller)("uploads"),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map