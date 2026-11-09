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
exports.EntrepriseProfilFieldsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const nullableText = ({ value }) => {
    if (value === null)
        return null;
    if (typeof value === "string")
        return value.trim() || null;
    return value;
};
class EntrepriseProfilFieldsDto {
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
}
exports.EntrepriseProfilFieldsDto = EntrepriseProfilFieldsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "ACME" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.nomCommercial !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", Object)
], EntrepriseProfilFieldsDto.prototype, "nomCommercial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "Commerce" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.secteur !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", Object)
], EntrepriseProfilFieldsDto.prototype, "secteur", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "CI", description: "Code pays ISO 3166-1." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim().toUpperCase() : value),
    (0, class_validator_1.Matches)(/^[A-Z]{2}$/, {
        message: "Le pays doit être un code ISO à 2 lettres.",
    }),
    __metadata("design:type", String)
], EntrepriseProfilFieldsDto.prototype, "pays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "Abidjan" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.ville !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", Object)
], EntrepriseProfilFieldsDto.prototype, "ville", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "Plateau" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.adresse !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", Object)
], EntrepriseProfilFieldsDto.prototype, "adresse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        example: "CI-ABJ-2026-B-12345",
        description: "RCCM, NCC ou équivalent.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.identifiantLegal !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", Object)
], EntrepriseProfilFieldsDto.prototype, "identifiantLegal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "Awa Koné" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.contactNom !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", Object)
], EntrepriseProfilFieldsDto.prototype, "contactNom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "DRH" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.contactFonction !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", Object)
], EntrepriseProfilFieldsDto.prototype, "contactFonction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "rh@acme.ci" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.contactEmail !== null),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", Object)
], EntrepriseProfilFieldsDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        example: "+2250700000000",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(nullableText),
    (0, class_validator_1.ValidateIf)((o) => o.contactTel !== null),
    (0, class_validator_1.Matches)(/^\+?[0-9 ]{8,20}$/, {
        message: "Le téléphone doit contenir 8 à 20 chiffres (préfixe + autorisé).",
    }),
    __metadata("design:type", Object)
], EntrepriseProfilFieldsDto.prototype, "contactTel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Africa/Abidjan" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], EntrepriseProfilFieldsDto.prototype, "fuseauHoraire", void 0);
//# sourceMappingURL=entreprise-fields.dto.js.map