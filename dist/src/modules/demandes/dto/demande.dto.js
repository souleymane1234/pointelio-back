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
exports.DemandesQueryDto = exports.DeciderDemandeDto = exports.UpdateDemandeDto = exports.CreateDemandeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const trim = ({ value }) => typeof value === "string" ? value.trim() : value;
const trimSpaces = ({ value }) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
const CIVIL_DATE_MESSAGE = "La date doit être au format YYYY-MM-DD.";
class CreateDemandeDto {
    type;
    dateDebut;
    dateFin;
    employeId;
    commentaire;
    justificatifUrl;
}
exports.CreateDemandeDto = CreateDemandeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TypeDemande }),
    (0, class_validator_1.IsEnum)(client_1.TypeDemande),
    __metadata("design:type", String)
], CreateDemandeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-11-02", description: "Date civile inclusive." }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: CIVIL_DATE_MESSAGE }),
    __metadata("design:type", String)
], CreateDemandeDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-11-06", description: "Date civile inclusive." }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: CIVIL_DATE_MESSAGE }),
    __metadata("design:type", String)
], CreateDemandeDto.prototype, "dateFin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 12,
        description: "Réservé aux RH / managers : créer une demande pour un autre employé.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateDemandeDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(trimSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateDemandeDto.prototype, "commentaire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "https://cdn.example.com/justificatifs/certificat.pdf",
        description: "Obligatoire pour une absence maladie.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateDemandeDto.prototype, "justificatifUrl", void 0);
class UpdateDemandeDto {
    type;
    dateDebut;
    dateFin;
    commentaire;
    justificatifUrl;
}
exports.UpdateDemandeDto = UpdateDemandeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TypeDemande }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TypeDemande),
    __metadata("design:type", String)
], UpdateDemandeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-11-02" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: CIVIL_DATE_MESSAGE }),
    __metadata("design:type", String)
], UpdateDemandeDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-11-06" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: CIVIL_DATE_MESSAGE }),
    __metadata("design:type", String)
], UpdateDemandeDto.prototype, "dateFin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(trimSpaces),
    (0, class_validator_1.ValidateIf)((_, v) => v !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", Object)
], UpdateDemandeDto.prototype, "commentaire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.ValidateIf)((_, v) => v !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], UpdateDemandeDto.prototype, "justificatifUrl", void 0);
class DeciderDemandeDto {
    statut;
    decisionMotif;
}
exports.DeciderDemandeDto = DeciderDemandeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: [client_1.StatutDemande.APPROUVEE, client_1.StatutDemande.REFUSEE],
        example: client_1.StatutDemande.APPROUVEE,
    }),
    (0, class_validator_1.IsIn)([client_1.StatutDemande.APPROUVEE, client_1.StatutDemande.REFUSEE]),
    __metadata("design:type", Object)
], DeciderDemandeDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Obligatoire en cas de refus.",
        example: "Effectif insuffisant sur cette période.",
    }),
    (0, class_validator_1.ValidateIf)((o) => o.statut === client_1.StatutDemande.REFUSEE),
    (0, class_transformer_1.Transform)(trimSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], DeciderDemandeDto.prototype, "decisionMotif", void 0);
class DemandesQueryDto {
    page;
    per_page;
    statut;
    type;
    employeId;
    dateDebut;
    dateFin;
}
exports.DemandesQueryDto = DemandesQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DemandesQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], DemandesQueryDto.prototype, "per_page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.StatutDemande }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatutDemande),
    __metadata("design:type", String)
], DemandesQueryDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TypeDemande }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TypeDemande),
    __metadata("design:type", String)
], DemandesQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DemandesQueryDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "2026-11-01",
        description: "Filtre les demandes qui chevauchent [dateDebut, dateFin].",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DemandesQueryDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-11-30" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DemandesQueryDto.prototype, "dateFin", void 0);
//# sourceMappingURL=demande.dto.js.map