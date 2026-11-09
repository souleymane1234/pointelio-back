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
exports.AdminSentNotificationDetailResponseSchemaDto = exports.AdminSentNotificationsPaginatedResponseSchemaDto = exports.AdminSentNotificationItemSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const pagination_response_dto_1 = require("../../../../common/dto/pagination-response.dto");
const admin_sent_notifications_query_dto_1 = require("./admin-sent-notifications-query.dto");
class AdminSentByUserSchemaDto {
    id;
    nom;
    prenom;
    email;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], AdminSentByUserSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Koné" }),
    __metadata("design:type", String)
], AdminSentByUserSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Awa" }),
    __metadata("design:type", String)
], AdminSentByUserSchemaDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], AdminSentByUserSchemaDto.prototype, "email", void 0);
class AdminSentNotificationItemSchemaDto {
    id;
    titre;
    message;
    target;
    targetUserId;
    targetRole;
    entrepriseId;
    recipientCount;
    sentAt;
    sentBy;
}
exports.AdminSentNotificationItemSchemaDto = AdminSentNotificationItemSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "1024",
        description: "Identifiant de l'envoi (id du log d'audit, BigInt en texte).",
    }),
    __metadata("design:type", String)
], AdminSentNotificationItemSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Rappel" }),
    __metadata("design:type", String)
], AdminSentNotificationItemSchemaDto.prototype, "titre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Pensez à pointer votre départ avant 18 h." }),
    __metadata("design:type", String)
], AdminSentNotificationItemSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: admin_sent_notifications_query_dto_1.AdminNotificationSendTarget,
        example: admin_sent_notifications_query_dto_1.AdminNotificationSendTarget.ROLE,
    }),
    __metadata("design:type", String)
], AdminSentNotificationItemSchemaDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, nullable: true }),
    __metadata("design:type", Object)
], AdminSentNotificationItemSchemaDto.prototype, "targetUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Role, nullable: true }),
    __metadata("design:type", Object)
], AdminSentNotificationItemSchemaDto.prototype, "targetRole", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, nullable: true, example: 1 }),
    __metadata("design:type", Object)
], AdminSentNotificationItemSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    __metadata("design:type", Number)
], AdminSentNotificationItemSchemaDto.prototype, "recipientCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-06-30T10:00:00.000Z" }),
    __metadata("design:type", Date)
], AdminSentNotificationItemSchemaDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: AdminSentByUserSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], AdminSentNotificationItemSchemaDto.prototype, "sentBy", void 0);
class AdminSentNotificationsPaginatedResponseSchemaDto {
    success;
    message;
    data;
    pagination;
}
exports.AdminSentNotificationsPaginatedResponseSchemaDto = AdminSentNotificationsPaginatedResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AdminSentNotificationsPaginatedResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Notifications envoyées récupérées avec succès" }),
    __metadata("design:type", String)
], AdminSentNotificationsPaginatedResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AdminSentNotificationItemSchemaDto] }),
    __metadata("design:type", Array)
], AdminSentNotificationsPaginatedResponseSchemaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_response_dto_1.PaginationMetaSchemaDto }),
    __metadata("design:type", pagination_response_dto_1.PaginationMetaSchemaDto)
], AdminSentNotificationsPaginatedResponseSchemaDto.prototype, "pagination", void 0);
class AdminSentNotificationDetailResponseSchemaDto {
    success;
    message;
    data;
}
exports.AdminSentNotificationDetailResponseSchemaDto = AdminSentNotificationDetailResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AdminSentNotificationDetailResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Détail notification envoyée récupéré avec succès" }),
    __metadata("design:type", String)
], AdminSentNotificationDetailResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdminSentNotificationItemSchemaDto }),
    __metadata("design:type", AdminSentNotificationItemSchemaDto)
], AdminSentNotificationDetailResponseSchemaDto.prototype, "data", void 0);
//# sourceMappingURL=admin-sent-notifications-response.dto.js.map