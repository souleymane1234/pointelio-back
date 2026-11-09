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
exports.EntreprisesPaginatedResponseSchemaDto = exports.EntrepriseResponseSchemaDto = exports.EntrepriseProfilResponseSchemaDto = exports.EntrepriseAdminSchemaDto = exports.EntrepriseProfilSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const pagination_response_dto_1 = require("../../../common/dto/pagination-response.dto");
class EntreprisePackRefSchemaDto {
    id;
    code;
    nom;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EntreprisePackRefSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "STARTER" }),
    __metadata("design:type", String)
], EntreprisePackRefSchemaDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Starter" }),
    __metadata("design:type", String)
], EntreprisePackRefSchemaDto.prototype, "nom", void 0);
class EntrepriseProfilSchemaDto {
    id;
    raisonSociale;
    nomCommercial;
    secteur;
    pays;
    ville;
    adresse;
    identifiantLegal;
    contactNom;
    contactFonction;
    contactEmail;
    contactTel;
    fuseauHoraire;
    statut;
    dateDemarrage;
    dateEcheance;
    profilComplete;
    pack;
    createdAt;
    updatedAt;
}
exports.EntrepriseProfilSchemaDto = EntrepriseProfilSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EntrepriseProfilSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ACME Côte d'Ivoire SARL" }),
    __metadata("design:type", String)
], EntrepriseProfilSchemaDto.prototype, "raisonSociale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "nomCommercial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "secteur", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "CI" }),
    __metadata("design:type", String)
], EntrepriseProfilSchemaDto.prototype, "pays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "ville", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "adresse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "identifiantLegal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "contactNom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "contactFonction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "contactTel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Africa/Abidjan" }),
    __metadata("design:type", String)
], EntrepriseProfilSchemaDto.prototype, "fuseauHoraire", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StatutEntreprise }),
    __metadata("design:type", String)
], EntrepriseProfilSchemaDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "dateDemarrage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseProfilSchemaDto.prototype, "dateEcheance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], EntrepriseProfilSchemaDto.prototype, "profilComplete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EntreprisePackRefSchemaDto }),
    __metadata("design:type", EntreprisePackRefSchemaDto)
], EntrepriseProfilSchemaDto.prototype, "pack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], EntrepriseProfilSchemaDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], EntrepriseProfilSchemaDto.prototype, "updatedAt", void 0);
class EntrepriseAdminSchemaDto extends EntrepriseProfilSchemaDto {
    packId;
    maxSitesOverride;
    maxEmployesOverride;
    modulesOverride;
    notesInternes;
    utilisateursCount;
    sitesCount;
}
exports.EntrepriseAdminSchemaDto = EntrepriseAdminSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EntrepriseAdminSchemaDto.prototype, "packId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseAdminSchemaDto.prototype, "maxSitesOverride", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true }),
    __metadata("design:type", Object)
], EntrepriseAdminSchemaDto.prototype, "maxEmployesOverride", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], nullable: true }),
    __metadata("design:type", Object)
], EntrepriseAdminSchemaDto.prototype, "modulesOverride", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        nullable: true,
        description: "Invisible du client.",
    }),
    __metadata("design:type", Object)
], EntrepriseAdminSchemaDto.prototype, "notesInternes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], EntrepriseAdminSchemaDto.prototype, "utilisateursCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], EntrepriseAdminSchemaDto.prototype, "sitesCount", void 0);
let EntrepriseProfilResponseSchemaDto = class EntrepriseProfilResponseSchemaDto {
    success;
    message;
    data;
};
exports.EntrepriseProfilResponseSchemaDto = EntrepriseProfilResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], EntrepriseProfilResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EntrepriseProfilResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EntrepriseProfilSchemaDto }),
    __metadata("design:type", EntrepriseProfilSchemaDto)
], EntrepriseProfilResponseSchemaDto.prototype, "data", void 0);
exports.EntrepriseProfilResponseSchemaDto = EntrepriseProfilResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(EntrepriseProfilSchemaDto, EntreprisePackRefSchemaDto)
], EntrepriseProfilResponseSchemaDto);
let EntrepriseResponseSchemaDto = class EntrepriseResponseSchemaDto {
    success;
    message;
    data;
};
exports.EntrepriseResponseSchemaDto = EntrepriseResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], EntrepriseResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EntrepriseResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EntrepriseAdminSchemaDto }),
    __metadata("design:type", EntrepriseAdminSchemaDto)
], EntrepriseResponseSchemaDto.prototype, "data", void 0);
exports.EntrepriseResponseSchemaDto = EntrepriseResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(EntrepriseAdminSchemaDto)
], EntrepriseResponseSchemaDto);
let EntreprisesPaginatedResponseSchemaDto = class EntreprisesPaginatedResponseSchemaDto {
    success;
    message;
    data;
    pagination;
};
exports.EntreprisesPaginatedResponseSchemaDto = EntreprisesPaginatedResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], EntreprisesPaginatedResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EntreprisesPaginatedResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EntrepriseAdminSchemaDto] }),
    __metadata("design:type", Array)
], EntreprisesPaginatedResponseSchemaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_response_dto_1.PaginationMetaSchemaDto }),
    __metadata("design:type", pagination_response_dto_1.PaginationMetaSchemaDto)
], EntreprisesPaginatedResponseSchemaDto.prototype, "pagination", void 0);
exports.EntreprisesPaginatedResponseSchemaDto = EntreprisesPaginatedResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(EntrepriseAdminSchemaDto, pagination_response_dto_1.PaginationMetaSchemaDto)
], EntreprisesPaginatedResponseSchemaDto);
//# sourceMappingURL=entreprise-response.dto.js.map