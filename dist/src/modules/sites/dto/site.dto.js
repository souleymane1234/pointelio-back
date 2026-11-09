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
exports.SitesQueryDto = exports.UpdateSiteDto = exports.CreateSiteDto = exports.SiteJourHoraireDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
const HEURE_MESSAGE = "L'heure doit être au format HH:mm (00:00 à 23:59).";
class SiteJourHoraireDto {
    jour;
    heureDebut;
    heureFin;
}
exports.SiteJourHoraireDto = SiteJourHoraireDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: "Jour ISO : 1 = lundi … 7 = dimanche.",
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(7),
    __metadata("design:type", Number)
], SiteJourHoraireDto.prototype, "jour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "08:00", description: "Heure d'arrivée attendue." }),
    (0, class_validator_1.Matches)(HEURE, { message: HEURE_MESSAGE }),
    __metadata("design:type", String)
], SiteJourHoraireDto.prototype, "heureDebut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "17:00",
        description: "Heure de descente. Peut être antérieure (horaire de nuit).",
    }),
    (0, class_validator_1.Matches)(HEURE, { message: HEURE_MESSAGE }),
    __metadata("design:type", String)
], SiteJourHoraireDto.prototype, "heureFin", void 0);
class CreateSiteDto {
    nom;
    adresse;
    latitude;
    longitude;
    rayonM;
    precisionMaxM;
    toleranceMin;
    horairesJours;
}
exports.CreateSiteDto = CreateSiteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Siège Plateau" }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        example: "Avenue Chardy, Plateau",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim() || null : value),
    (0, class_validator_1.ValidateIf)((o) => o.adresse !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", Object)
], CreateSiteDto.prototype, "adresse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5.3197 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -4.0168 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 30,
        default: 30,
        description: "Rayon de validation du pointage, en mètres.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(2000),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "rayonM", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 50,
        default: 50,
        description: "Précision GPS maximale acceptée ; au-delà, le mobile demande de réessayer.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "precisionMaxM", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        nullable: true,
        example: 15,
        description: "Facultatif. Minutes de retard acceptées avant de marquer l'employé en retard. null ou omis = aucune tolérance.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((_, value) => value !== null),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(240),
    __metadata("design:type", Object)
], CreateSiteDto.prototype, "toleranceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [SiteJourHoraireDto],
        example: [
            { jour: 1, heureDebut: "08:00", heureFin: "17:00" },
            { jour: 2, heureDebut: "08:00", heureFin: "17:00" },
            { jour: 3, heureDebut: "08:00", heureFin: "17:00" },
            { jour: 4, heureDebut: "08:00", heureFin: "17:00" },
            { jour: 5, heureDebut: "08:00", heureFin: "17:00" },
        ],
        description: "Jours travaillés choisis par l'employeur, avec heure d'arrivée et de descente. Uniquement les jours listés sont ouvrés (1 = lundi … 7 = dimanche).",
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayUnique)((item) => item.jour),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SiteJourHoraireDto),
    __metadata("design:type", Array)
], CreateSiteDto.prototype, "horairesJours", void 0);
class UpdateSiteDto extends (0, swagger_1.PartialType)(CreateSiteDto) {
    actif;
}
exports.UpdateSiteDto = UpdateSiteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Réactiver un site désactivé (soumis à la limite de sites).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSiteDto.prototype, "actif", void 0);
class SitesQueryDto {
    page;
    per_page;
    search;
    actif;
}
exports.SitesQueryDto = SitesQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SitesQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], SitesQueryDto.prototype, "per_page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Recherche sur le nom ou l'adresse." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim() || undefined : value),
    __metadata("design:type", String)
], SitesQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "true | false" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === true || value === "true")
            return true;
        if (value === false || value === "false")
            return false;
        return undefined;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SitesQueryDto.prototype, "actif", void 0);
//# sourceMappingURL=site.dto.js.map