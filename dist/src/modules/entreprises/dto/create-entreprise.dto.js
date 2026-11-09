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
exports.CreateEntrepriseDto = exports.STATUTS_CREATION = exports.EntrepriseAdminDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const auth_validation_constants_1 = require("../../auth/shared/auth-validation.constants");
const entreprise_fields_dto_1 = require("./entreprise-fields.dto");
const collapseSpaces = ({ value }) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
class EntrepriseAdminDto {
    nom;
    prenom;
    email;
    password;
}
exports.EntrepriseAdminDto = EntrepriseAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Koné" }),
    (0, class_transformer_1.Transform)(collapseSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], EntrepriseAdminDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Awa" }),
    (0, class_transformer_1.Transform)(collapseSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], EntrepriseAdminDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "awa.kone@acme.ci" }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", String)
], EntrepriseAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "MotDePasse8",
        description: "Mot de passe du compte (8 caractères min.), transmis par l'administrateur.",
    }),
    (0, class_validator_1.Matches)(new RegExp(`^[\\s\\S]{${auth_validation_constants_1.AUTH_EMAIL_PASSWORD_MIN_LENGTH},128}$`), {
        message: ({ value }) => typeof value === "string" && value !== ""
            ? `Le mot de passe doit contenir entre ${auth_validation_constants_1.AUTH_EMAIL_PASSWORD_MIN_LENGTH} et 128 caractères.`
            : "Le mot de passe du compte est obligatoire.",
    }),
    __metadata("design:type", String)
], EntrepriseAdminDto.prototype, "password", void 0);
exports.STATUTS_CREATION = [
    client_1.StatutEntreprise.ESSAI,
    client_1.StatutEntreprise.ACTIF,
];
class CreateEntrepriseDto extends entreprise_fields_dto_1.EntrepriseProfilFieldsDto {
    raisonSociale;
    packId;
    statut;
    dateEcheance;
    notesInternes;
    admin;
}
exports.CreateEntrepriseDto = CreateEntrepriseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ACME Côte d'Ivoire SARL" }),
    (0, class_transformer_1.Transform)(collapseSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", String)
], CreateEntrepriseDto.prototype, "raisonSociale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateEntrepriseDto.prototype, "packId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: exports.STATUTS_CREATION,
        default: client_1.StatutEntreprise.ESSAI,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.STATUTS_CREATION),
    __metadata("design:type", Object)
], CreateEntrepriseDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "2026-07-01",
        description: "Par défaut : aujourd'hui + `essaiJours` du pack pour un essai, aucune sinon.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEntrepriseDto.prototype, "dateEcheance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Notes internes, invisibles du client." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateEntrepriseDto.prototype, "notesInternes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: EntrepriseAdminDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EntrepriseAdminDto),
    __metadata("design:type", EntrepriseAdminDto)
], CreateEntrepriseDto.prototype, "admin", void 0);
//# sourceMappingURL=create-entreprise.dto.js.map