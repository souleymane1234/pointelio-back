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
exports.ProfileMeResponseSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class ProfileEntrepriseSchemaDto {
    id;
    raisonSociale;
    nomCommercial;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ProfileEntrepriseSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ACME Côte d'Ivoire SARL" }),
    __metadata("design:type", String)
], ProfileEntrepriseSchemaDto.prototype, "raisonSociale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "ACME" }),
    __metadata("design:type", Object)
], ProfileEntrepriseSchemaDto.prototype, "nomCommercial", void 0);
class ProfileSiteSchemaDto {
    id;
    nom;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], ProfileSiteSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Siège Plateau" }),
    __metadata("design:type", String)
], ProfileSiteSchemaDto.prototype, "nom", void 0);
class ProfileUserSchemaDto {
    id;
    entrepriseId;
    siteId;
    horaireId;
    matricule;
    nom;
    prenom;
    email;
    telephone;
    role;
    statut;
    poste;
    dateEmbauche;
    photoUrl;
    derniereConnexion;
    createdAt;
    updatedAt;
    entreprise;
    site;
    unreadNotificationsCount;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], ProfileUserSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 1 }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 3 }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 2 }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "horaireId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "EMP-0042" }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Traoré" }),
    __metadata("design:type", String)
], ProfileUserSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Moussa" }),
    __metadata("design:type", String)
], ProfileUserSchemaDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "moussa@acme.ci" }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "+2250700000000" }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Role, example: client_1.Role.EMPLOYE }),
    __metadata("design:type", String)
], ProfileUserSchemaDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StatutCompte, example: client_1.StatutCompte.ACTIF }),
    __metadata("design:type", String)
], ProfileUserSchemaDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "Caissier" }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "poste", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, format: "date-time" }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "dateEmbauche", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, format: "date-time" }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "derniereConnexion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileUserSchemaDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileUserSchemaDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProfileEntrepriseSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "entreprise", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProfileSiteSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], ProfileUserSchemaDto.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 3,
        description: "Nombre de notifications non lues (badge).",
        required: false,
    }),
    __metadata("design:type", Number)
], ProfileUserSchemaDto.prototype, "unreadNotificationsCount", void 0);
let ProfileMeResponseSchemaDto = class ProfileMeResponseSchemaDto {
    success;
    message;
    data;
};
exports.ProfileMeResponseSchemaDto = ProfileMeResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProfileMeResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Profil récupéré avec succès" }),
    __metadata("design:type", String)
], ProfileMeResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProfileUserSchemaDto }),
    __metadata("design:type", ProfileUserSchemaDto)
], ProfileMeResponseSchemaDto.prototype, "data", void 0);
exports.ProfileMeResponseSchemaDto = ProfileMeResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(ProfileUserSchemaDto)
], ProfileMeResponseSchemaDto);
//# sourceMappingURL=profile-response.dto.js.map