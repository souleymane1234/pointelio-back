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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const auth_validation_constants_1 = require("../../auth/shared/auth-validation.constants");
const phone_util_1 = require("../../../common/utils/phone.util");
const collapseSpaces = ({ value }) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
const nullableText = ({ value }) => {
    if (value === null)
        return null;
    if (typeof value === "string")
        return value.trim() || null;
    return value;
};
class UpdateUserDto {
    role;
    statut;
    suspensionReason;
    nom;
    prenom;
    email;
    telephone;
    password;
    entrepriseId;
    siteId;
    horaireId;
    salaireJournalier;
    matricule;
    poste;
    dateEmbauche;
    photoUrl;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Role }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Role),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.StatutCompte,
        description: "SUSPENDU pour suspendre, ACTIF pour réactiver, DESACTIVE pour renvoyer. Préférer les endpoints dédiés /reaffecter, /suspendre, /reactiver, /renvoyer.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatutCompte),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Motif de suspension (enregistré uniquement dans l'audit, non persisté sur le compte).",
        example: "Départ de l'entreprise",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim() || undefined : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "suspensionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Traoré" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(collapseSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Moussa" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(collapseSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        example: "nouveau@acme.ci",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === null)
            return null;
        if (typeof value === "string")
            return value.trim().toLowerCase() || null;
        return value;
    }),
    (0, class_validator_1.ValidateIf)((o) => o.email !== null),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        example: "+2250707070707",
        description: "null ou chaîne vide = retirer le téléphone.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === null)
            return null;
        if (typeof value === "string" && value.trim() === "")
            return null;
        if (typeof value === "string")
            return (0, phone_util_1.normalizePhoneInput)(value);
        return value;
    }),
    (0, class_validator_1.ValidateIf)((o) => o.telephone !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\+?[0-9]{8,20}$/, {
        message: "Le numéro de téléphone doit contenir 8 à 20 chiffres (préfixe + autorisé).",
    }),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "0000",
        description: "Réinitialise le mot de passe / PIN (pas de SMS ni d'OTP). EMPLOYE / SURVEILLANT : PIN de 4 chiffres ou 8 caractères min. ; autres rôles : 8 caractères min.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" && value.trim() === "" ? undefined : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(auth_validation_constants_1.ADMIN_APP_USER_PASSWORD_LENGTH),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        description: "Changement d'entreprise (équipe Pointelio uniquement).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, nullable: true, example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.ValidateIf)((o) => o.siteId !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, nullable: true, example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.ValidateIf)((o) => o.horaireId !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "horaireId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 5000,
        description: "Salaire journalier en FCFA (EMPLOYE).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "salaireJournalier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "EMP-0042" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.matricule !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "Caissier" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.poste !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "poste", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "2026-01-15" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.dateEmbauche !== null),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "dateEmbauche", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        description: "URL publique de la photo ; null (ou chaîne vide) pour effacer.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.photoUrl !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2048),
    (0, class_validator_1.Matches)(/^https?:\/\//, {
        message: "La photo doit être une URL http(s) valide.",
    }),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "photoUrl", void 0);
//# sourceMappingURL=update-user.dto.js.map