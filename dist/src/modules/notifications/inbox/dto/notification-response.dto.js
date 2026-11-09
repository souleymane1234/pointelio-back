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
exports.MarkAllNotificationsReadSchemaDto = exports.NotificationsPaginatedResponseSchemaDto = exports.NotificationResponseSchemaDto = exports.NotificationSchemaDto = void 0;
const pagination_response_dto_1 = require("../../../../common/dto/pagination-response.dto");
const swagger_1 = require("@nestjs/swagger");
class NotificationSchemaDto {
    id;
    utilisateurId;
    titre;
    message;
    type;
    luAt;
    createdAt;
}
exports.NotificationSchemaDto = NotificationSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    __metadata("design:type", Number)
], NotificationSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], NotificationSchemaDto.prototype, "utilisateurId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Demande approuvée" }),
    __metadata("design:type", String)
], NotificationSchemaDto.prototype, "titre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Votre congé du 2 au 6 juin a été approuvé." }),
    __metadata("design:type", String)
], NotificationSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "SYSTEM" }),
    __metadata("design:type", String)
], NotificationSchemaDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Date,
        nullable: true,
        description: "Date de lecture ; null si non lue.",
    }),
    __metadata("design:type", Object)
], NotificationSchemaDto.prototype, "luAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], NotificationSchemaDto.prototype, "createdAt", void 0);
let NotificationResponseSchemaDto = class NotificationResponseSchemaDto {
    success;
    message;
    data;
};
exports.NotificationResponseSchemaDto = NotificationResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NotificationResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: NotificationSchemaDto }),
    __metadata("design:type", NotificationSchemaDto)
], NotificationResponseSchemaDto.prototype, "data", void 0);
exports.NotificationResponseSchemaDto = NotificationResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(NotificationSchemaDto)
], NotificationResponseSchemaDto);
let NotificationsPaginatedResponseSchemaDto = class NotificationsPaginatedResponseSchemaDto {
    success;
    message;
    data;
    count;
    pagination;
};
exports.NotificationsPaginatedResponseSchemaDto = NotificationsPaginatedResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NotificationsPaginatedResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationsPaginatedResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [NotificationSchemaDto] }),
    __metadata("design:type", Array)
], NotificationsPaginatedResponseSchemaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 12,
        description: "Nombre de notifications non lues (badge), indépendant des filtres de la page.",
    }),
    __metadata("design:type", Number)
], NotificationsPaginatedResponseSchemaDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_response_dto_1.PaginationMetaSchemaDto }),
    __metadata("design:type", pagination_response_dto_1.PaginationMetaSchemaDto)
], NotificationsPaginatedResponseSchemaDto.prototype, "pagination", void 0);
exports.NotificationsPaginatedResponseSchemaDto = NotificationsPaginatedResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(NotificationSchemaDto, pagination_response_dto_1.PaginationMetaSchemaDto)
], NotificationsPaginatedResponseSchemaDto);
class MarkAllNotificationsReadSchemaDto {
    success;
    message;
    data;
}
exports.MarkAllNotificationsReadSchemaDto = MarkAllNotificationsReadSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MarkAllNotificationsReadSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MarkAllNotificationsReadSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        example: { updatedCount: 3 },
    }),
    __metadata("design:type", Object)
], MarkAllNotificationsReadSchemaDto.prototype, "data", void 0);
//# sourceMappingURL=notification-response.dto.js.map