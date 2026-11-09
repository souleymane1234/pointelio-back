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
exports.AnomaliesQueryDto = exports.PointagesQueryDto = exports.CorrigerPointageDto = exports.PointerSurveillantDto = exports.PointerQrDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const anomalies_constants_1 = require("../anomalies.constants");
const trim = ({ value }) => typeof value === "string" ? value.trim() : value;
const trimSpaces = ({ value }) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
class PointerQrDto {
    qrToken;
    type;
    latitude;
    longitude;
    precisionM;
    requestId;
    mockDetecte;
}
exports.PointerQrDto = PointerQrDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "q3V9r0wq5x0Jb4kz2Yc8mQ1h7sT6uP2d",
        description: "Jeton lu sur le QR statique du site.",
    }),
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], PointerQrDto.prototype, "qrToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TypePointage }),
    (0, class_validator_1.IsEnum)(client_1.TypePointage),
    __metadata("design:type", String)
], PointerQrDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5.3197 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], PointerQrDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -4.0168 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], PointerQrDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 12,
        description: "Précision GPS du terminal, en mètres.",
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5000),
    __metadata("design:type", Number)
], PointerQrDto.prototype, "precisionM", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "8f3a2b1c-9d8e-4f5a-b6c7-d8e9f0a1b2c3",
        description: "Identifiant d'idempotence (double appui / retry réseau).",
    }),
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], PointerQrDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "true si le terminal signale une position simulée.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PointerQrDto.prototype, "mockDetecte", void 0);
class PointerSurveillantDto {
    employeId;
    type;
    requestId;
    latitude;
    longitude;
    precisionM;
    mockDetecte;
}
exports.PointerSurveillantDto = PointerSurveillantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PointerSurveillantDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TypePointage }),
    (0, class_validator_1.IsEnum)(client_1.TypePointage),
    __metadata("design:type", String)
], PointerSurveillantDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "surv-8f3a2b1c-9d8e-4f5a",
        description: "Identifiant d'idempotence.",
    }),
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], PointerSurveillantDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5.3197 }),
    (0, class_validator_1.ValidateIf)((o) => o.longitude !== undefined),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], PointerSurveillantDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: -4.0168 }),
    (0, class_validator_1.ValidateIf)((o) => o.latitude !== undefined),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], PointerSurveillantDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5000),
    __metadata("design:type", Number)
], PointerSurveillantDto.prototype, "precisionM", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PointerSurveillantDto.prototype, "mockDetecte", void 0);
class CorrigerPointageDto {
    motif;
    type;
    siteId;
    heureServeur;
    statutValidation;
    motifStatut;
}
exports.CorrigerPointageDto = CorrigerPointageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Erreur de badge : départ saisi à la place d'une arrivée.",
    }),
    (0, class_transformer_1.Transform)(trimSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CorrigerPointageDto.prototype, "motif", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TypePointage }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TypePointage),
    __metadata("design:type", String)
], CorrigerPointageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CorrigerPointageDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "2026-10-27T08:05:00.000Z",
        description: "Heure serveur corrigée (ISO 8601).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CorrigerPointageDto.prototype, "heureServeur", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.StatutValidation }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatutValidation),
    __metadata("design:type", String)
], CorrigerPointageDto.prototype, "statutValidation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", String)
], CorrigerPointageDto.prototype, "motifStatut", void 0);
class PointagesQueryDto {
    page;
    per_page;
    employeId;
    siteId;
    type;
    methode;
    statutValidation;
    dateDebut;
    dateFin;
}
exports.PointagesQueryDto = PointagesQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PointagesQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], PointagesQueryDto.prototype, "per_page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PointagesQueryDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PointagesQueryDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TypePointage }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TypePointage),
    __metadata("design:type", String)
], PointagesQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.MethodePointage }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.MethodePointage),
    __metadata("design:type", String)
], PointagesQueryDto.prototype, "methode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.StatutValidation }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatutValidation),
    __metadata("design:type", String)
], PointagesQueryDto.prototype, "statutValidation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "2026-10-01T00:00:00.000Z",
        description: "Borne inférieure (heureServeur, inclusive).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PointagesQueryDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "2026-10-31T23:59:59.000Z",
        description: "Borne supérieure (heureServeur, exclusive si date seule).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PointagesQueryDto.prototype, "dateFin", void 0);
class AnomaliesQueryDto extends PointagesQueryDto {
    anomalie;
}
exports.AnomaliesQueryDto = AnomaliesQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: anomalies_constants_1.ANOMALIE_VALUES,
        description: "Filtrer sur un type d'anomalie (défaut : toutes).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(anomalies_constants_1.ANOMALIE_VALUES),
    __metadata("design:type", String)
], AnomaliesQueryDto.prototype, "anomalie", void 0);
//# sourceMappingURL=pointage.dto.js.map