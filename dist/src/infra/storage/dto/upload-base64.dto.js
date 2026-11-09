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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadBase64Dto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UploadBase64Dto {
    content;
}
exports.UploadBase64Dto = UploadBase64Dto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        description: "Contenu en data URI : data:<mime>;base64,<payload>",
    }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === "string" ? value.trim() : value)),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^data:[^;]+;base64,/i, {
        message: "content doit être une data URI (data:<mime>;base64,...)",
    }),
    __metadata("design:type", String)
], UploadBase64Dto.prototype, "content", void 0);
//# sourceMappingURL=upload-base64.dto.js.map