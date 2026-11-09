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
exports.UsersPaginatedResponseSchemaDto = exports.UserResponseSchemaDto = exports.AdminUserDetailSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const pagination_response_dto_1 = require("../../../common/dto/pagination-response.dto");
class RefEntrepriseSchemaDto {
    id;
    raisonSociale;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RefEntrepriseSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ACME Côte d'Ivoire SARL" }),
    __metadata("design:type", String)
], RefEntrepriseSchemaDto.prototype, "raisonSociale", void 0);
class RefNomSchemaDto {
    id;
    nom;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], RefNomSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Siège Plateau" }),
    __metadata("design:type", String)
], RefNomSchemaDto.prototype, "nom", void 0);
class AdminUserDetailSchemaDto {
    id;
    entrepriseId;
    siteId;
    horaireId;
    matricule;
    nom;
    prenom;
    fullName;
    email;
    telephone;
    role;
    statut;
    hasPassword;
    poste;
    salaireJournalier;
    dateEmbauche;
    photoUrl;
    mfaActif;
    derniereConnexion;
    entreprise;
    site;
    horaire;
    createdAt;
    updatedAt;
}
exports.AdminUserDetailSchemaDto = AdminUserDetailSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], AdminUserDetailSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, nullable: true, example: 1 }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, nullable: true, example: 3 }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, nullable: true, example: 2 }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "horaireId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "EMP-0042" }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Traoré" }),
    __metadata("design:type", String)
], AdminUserDetailSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Moussa" }),
    __metadata("design:type", String)
], AdminUserDetailSchemaDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Moussa Traoré" }),
    __metadata("design:type", String)
], AdminUserDetailSchemaDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Role }),
    __metadata("design:type", String)
], AdminUserDetailSchemaDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StatutCompte }),
    __metadata("design:type", String)
], AdminUserDetailSchemaDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Le compte a un mot de passe. Faux pour un compte invité qui ne l'a pas encore défini.",
    }),
    __metadata("design:type", Boolean)
], AdminUserDetailSchemaDto.prototype, "hasPassword", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "poste", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        nullable: true,
        example: 5000,
        description: "Salaire d'une journée validée (arrivée + départ), en FCFA.",
    }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "salaireJournalier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "dateEmbauche", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AdminUserDetailSchemaDto.prototype, "mfaActif", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "derniereConnexion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: RefEntrepriseSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "entreprise", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: RefNomSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: RefNomSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], AdminUserDetailSchemaDto.prototype, "horaire", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdminUserDetailSchemaDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdminUserDetailSchemaDto.prototype, "updatedAt", void 0);
let UserResponseSchemaDto = class UserResponseSchemaDto {
    success;
    message;
    data;
};
exports.UserResponseSchemaDto = UserResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UserResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Utilisateur récupéré avec succès" }),
    __metadata("design:type", String)
], UserResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdminUserDetailSchemaDto }),
    __metadata("design:type", AdminUserDetailSchemaDto)
], UserResponseSchemaDto.prototype, "data", void 0);
exports.UserResponseSchemaDto = UserResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(AdminUserDetailSchemaDto, RefEntrepriseSchemaDto, RefNomSchemaDto)
], UserResponseSchemaDto);
let UsersPaginatedResponseSchemaDto = class UsersPaginatedResponseSchemaDto {
    success;
    message;
    data;
    pagination;
};
exports.UsersPaginatedResponseSchemaDto = UsersPaginatedResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UsersPaginatedResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Utilisateurs récupérés avec succès" }),
    __metadata("design:type", String)
], UsersPaginatedResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AdminUserDetailSchemaDto] }),
    __metadata("design:type", Array)
], UsersPaginatedResponseSchemaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_response_dto_1.PaginationMetaSchemaDto }),
    __metadata("design:type", pagination_response_dto_1.PaginationMetaSchemaDto)
], UsersPaginatedResponseSchemaDto.prototype, "pagination", void 0);
exports.UsersPaginatedResponseSchemaDto = UsersPaginatedResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(AdminUserDetailSchemaDto, pagination_response_dto_1.PaginationMetaSchemaDto)
], UsersPaginatedResponseSchemaDto);
//# sourceMappingURL=user-response.dto.js.map