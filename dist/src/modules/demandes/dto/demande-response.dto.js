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
exports.DemandesPaginatedResponseSchemaDto = exports.DemandeResponseSchemaDto = exports.DemandeSchemaDto = exports.DemandePersonneSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const pagination_response_dto_1 = require("../../../common/dto/pagination-response.dto");
class DemandePersonneSchemaDto {
    id;
    nom;
    prenom;
    matricule;
}
exports.DemandePersonneSchemaDto = DemandePersonneSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], DemandePersonneSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Traoré" }),
    __metadata("design:type", String)
], DemandePersonneSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Awa" }),
    __metadata("design:type", String)
], DemandePersonneSchemaDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "EMP-0042" }),
    __metadata("design:type", Object)
], DemandePersonneSchemaDto.prototype, "matricule", void 0);
class DemandeSchemaDto {
    id;
    entrepriseId;
    employeId;
    type;
    dateDebut;
    dateFin;
    nbJours;
    commentaire;
    justificatifUrl;
    statut;
    decideurId;
    decisionMotif;
    decideAt;
    createdAt;
    employe;
    decideur;
}
exports.DemandeSchemaDto = DemandeSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], DemandeSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DemandeSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], DemandeSchemaDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TypeDemande }),
    __metadata("design:type", String)
], DemandeSchemaDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-11-02" }),
    __metadata("design:type", String)
], DemandeSchemaDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-11-06" }),
    __metadata("design:type", String)
], DemandeSchemaDto.prototype, "dateFin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 5 }),
    __metadata("design:type", Object)
], DemandeSchemaDto.prototype, "nbJours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], DemandeSchemaDto.prototype, "commentaire", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], DemandeSchemaDto.prototype, "justificatifUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StatutDemande }),
    __metadata("design:type", String)
], DemandeSchemaDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true }),
    __metadata("design:type", Object)
], DemandeSchemaDto.prototype, "decideurId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], DemandeSchemaDto.prototype, "decisionMotif", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], DemandeSchemaDto.prototype, "decideAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DemandeSchemaDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DemandePersonneSchemaDto }),
    __metadata("design:type", DemandePersonneSchemaDto)
], DemandeSchemaDto.prototype, "employe", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DemandePersonneSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], DemandeSchemaDto.prototype, "decideur", void 0);
let DemandeResponseSchemaDto = class DemandeResponseSchemaDto {
    success;
    message;
    data;
};
exports.DemandeResponseSchemaDto = DemandeResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], DemandeResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DemandeResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DemandeSchemaDto }),
    __metadata("design:type", DemandeSchemaDto)
], DemandeResponseSchemaDto.prototype, "data", void 0);
exports.DemandeResponseSchemaDto = DemandeResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(DemandeSchemaDto, DemandePersonneSchemaDto)
], DemandeResponseSchemaDto);
let DemandesPaginatedResponseSchemaDto = class DemandesPaginatedResponseSchemaDto {
    success;
    message;
    data;
    pagination;
};
exports.DemandesPaginatedResponseSchemaDto = DemandesPaginatedResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], DemandesPaginatedResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DemandesPaginatedResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DemandeSchemaDto] }),
    __metadata("design:type", Array)
], DemandesPaginatedResponseSchemaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_response_dto_1.PaginationMetaSchemaDto }),
    __metadata("design:type", pagination_response_dto_1.PaginationMetaSchemaDto)
], DemandesPaginatedResponseSchemaDto.prototype, "pagination", void 0);
exports.DemandesPaginatedResponseSchemaDto = DemandesPaginatedResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(DemandeSchemaDto, pagination_response_dto_1.PaginationMetaSchemaDto)
], DemandesPaginatedResponseSchemaDto);
//# sourceMappingURL=demande-response.dto.js.map