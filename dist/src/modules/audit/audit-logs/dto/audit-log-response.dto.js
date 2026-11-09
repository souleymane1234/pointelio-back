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
exports.AuditLogsPaginatedResponseSchemaDto = exports.AuditLogSchemaDto = exports.AuditLogActeurSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const pagination_response_dto_1 = require("../../../../common/dto/pagination-response.dto");
const audit_actions_constants_1 = require("../../shared/audit-actions.constants");
class AuditLogActeurSchemaDto {
    id;
    nom;
    prenom;
    email;
}
exports.AuditLogActeurSchemaDto = AuditLogActeurSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], AuditLogActeurSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Koné" }),
    __metadata("design:type", String)
], AuditLogActeurSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Awa" }),
    __metadata("design:type", String)
], AuditLogActeurSchemaDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true, example: "awa@acme.ci" }),
    __metadata("design:type", Object)
], AuditLogActeurSchemaDto.prototype, "email", void 0);
class AuditLogSchemaDto {
    id;
    entrepriseId;
    acteurId;
    acteur;
    action;
    objet;
    objetId;
    details;
    ip;
    resultat;
    createdAt;
}
exports.AuditLogSchemaDto = AuditLogSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "1024", description: "BigInt sérialisé en texte." }),
    __metadata("design:type", String)
], AuditLogSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true, example: 1 }),
    __metadata("design:type", Object)
], AuditLogSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true, example: 3 }),
    __metadata("design:type", Object)
], AuditLogSchemaDto.prototype, "acteurId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        nullable: true,
        type: AuditLogActeurSchemaDto,
        description: "Utilisateur auteur de l'action.",
    }),
    __metadata("design:type", Object)
], AuditLogSchemaDto.prototype, "acteur", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: audit_actions_constants_1.AUDIT_ACTIONS.ROLE_MODIFIE }),
    __metadata("design:type", String)
], AuditLogSchemaDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true, example: "UTILISATEUR" }),
    __metadata("design:type", Object)
], AuditLogSchemaDto.prototype, "objet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true, example: "12" }),
    __metadata("design:type", Object)
], AuditLogSchemaDto.prototype, "objetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        nullable: true,
        type: Object,
        description: "Données contextuelles variables selon `action` / `objet`.",
    }),
    __metadata("design:type", Object)
], AuditLogSchemaDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true, example: "196.168.1.42" }),
    __metadata("design:type", Object)
], AuditLogSchemaDto.prototype, "ip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "OK" }),
    __metadata("design:type", String)
], AuditLogSchemaDto.prototype, "resultat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-05-22T08:15:00.000Z" }),
    __metadata("design:type", Date)
], AuditLogSchemaDto.prototype, "createdAt", void 0);
let AuditLogsPaginatedResponseSchemaDto = class AuditLogsPaginatedResponseSchemaDto {
    success;
    message;
    data;
    pagination;
};
exports.AuditLogsPaginatedResponseSchemaDto = AuditLogsPaginatedResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AuditLogsPaginatedResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Logs d'audit récupérés avec succès" }),
    __metadata("design:type", String)
], AuditLogsPaginatedResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AuditLogSchemaDto] }),
    __metadata("design:type", Array)
], AuditLogsPaginatedResponseSchemaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_response_dto_1.PaginationMetaSchemaDto }),
    __metadata("design:type", pagination_response_dto_1.PaginationMetaSchemaDto)
], AuditLogsPaginatedResponseSchemaDto.prototype, "pagination", void 0);
exports.AuditLogsPaginatedResponseSchemaDto = AuditLogsPaginatedResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(AuditLogActeurSchemaDto, AuditLogSchemaDto, pagination_response_dto_1.PaginationMetaSchemaDto)
], AuditLogsPaginatedResponseSchemaDto);
//# sourceMappingURL=audit-log-response.dto.js.map