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
exports.ErrorResponseSchemaDto = exports.SuccessResponseSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SuccessResponseSchemaDto {
    success;
    message;
}
exports.SuccessResponseSchemaDto = SuccessResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], SuccessResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Opération réussie" }),
    __metadata("design:type", String)
], SuccessResponseSchemaDto.prototype, "message", void 0);
class ErrorResponseSchemaDto {
    success;
    message;
    errors;
}
exports.ErrorResponseSchemaDto = ErrorResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ErrorResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Message d'erreur" }),
    __metadata("design:type", String)
], ErrorResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    __metadata("design:type", Array)
], ErrorResponseSchemaDto.prototype, "errors", void 0);
//# sourceMappingURL=response-schemas.dto.js.map