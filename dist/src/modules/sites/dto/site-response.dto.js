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
exports.SitesPaginatedResponseSchemaDto = exports.SiteResponseSchemaDto = exports.SiteSchemaDto = exports.SiteJourHoraireSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const pagination_response_dto_1 = require("../../../common/dto/pagination-response.dto");
class SiteJourHoraireSchemaDto {
    jour;
    heureDebut;
    heureFin;
}
exports.SiteJourHoraireSchemaDto = SiteJourHoraireSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "1 = lundi … 7 = dimanche." }),
    __metadata("design:type", Number)
], SiteJourHoraireSchemaDto.prototype, "jour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "08:00" }),
    __metadata("design:type", String)
], SiteJourHoraireSchemaDto.prototype, "heureDebut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "17:00" }),
    __metadata("design:type", String)
], SiteJourHoraireSchemaDto.prototype, "heureFin", void 0);
class SiteSchemaDto {
    id;
    entrepriseId;
    nom;
    adresse;
    latitude;
    longitude;
    rayonM;
    precisionMaxM;
    toleranceMin;
    horairesJours;
    joursTravail;
    qrToken;
    actif;
    employesCount;
    createdAt;
    updatedAt;
}
exports.SiteSchemaDto = SiteSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], SiteSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], SiteSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Siège Plateau" }),
    __metadata("design:type", String)
], SiteSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], SiteSchemaDto.prototype, "adresse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5.3197 }),
    __metadata("design:type", Number)
], SiteSchemaDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -4.0168 }),
    __metadata("design:type", Number)
], SiteSchemaDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    __metadata("design:type", Number)
], SiteSchemaDto.prototype, "rayonM", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], SiteSchemaDto.prototype, "precisionMaxM", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        nullable: true,
        example: 15,
        description: "Minutes de retard acceptées. null = l'employeur n'a pas défini de tolérance.",
    }),
    __metadata("design:type", Object)
], SiteSchemaDto.prototype, "toleranceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [SiteJourHoraireSchemaDto],
        description: "Jours et plages choisis par l'employeur (1 = lundi … 7 = dimanche).",
    }),
    __metadata("design:type", Array)
], SiteSchemaDto.prototype, "horairesJours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [1, 2, 3, 4, 5],
        type: [Number],
        description: "Jours ouvrés (dérivé de horairesJours).",
    }),
    __metadata("design:type", Array)
], SiteSchemaDto.prototype, "joursTravail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "q3V9r0wq5x0Jb4kz2Yc8mQ1h7sT6uP2d",
        description: "Jeton du QR statique à imprimer sur le site.",
    }),
    __metadata("design:type", String)
], SiteSchemaDto.prototype, "qrToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SiteSchemaDto.prototype, "actif", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: "Utilisateurs rattachés." }),
    __metadata("design:type", Number)
], SiteSchemaDto.prototype, "employesCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SiteSchemaDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SiteSchemaDto.prototype, "updatedAt", void 0);
let SiteResponseSchemaDto = class SiteResponseSchemaDto {
    success;
    message;
    data;
};
exports.SiteResponseSchemaDto = SiteResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], SiteResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SiteResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SiteSchemaDto }),
    __metadata("design:type", SiteSchemaDto)
], SiteResponseSchemaDto.prototype, "data", void 0);
exports.SiteResponseSchemaDto = SiteResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(SiteSchemaDto, SiteJourHoraireSchemaDto)
], SiteResponseSchemaDto);
let SitesPaginatedResponseSchemaDto = class SitesPaginatedResponseSchemaDto {
    success;
    message;
    data;
    pagination;
};
exports.SitesPaginatedResponseSchemaDto = SitesPaginatedResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], SitesPaginatedResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SitesPaginatedResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SiteSchemaDto] }),
    __metadata("design:type", Array)
], SitesPaginatedResponseSchemaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_response_dto_1.PaginationMetaSchemaDto }),
    __metadata("design:type", pagination_response_dto_1.PaginationMetaSchemaDto)
], SitesPaginatedResponseSchemaDto.prototype, "pagination", void 0);
exports.SitesPaginatedResponseSchemaDto = SitesPaginatedResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(SiteSchemaDto, SiteJourHoraireSchemaDto, pagination_response_dto_1.PaginationMetaSchemaDto)
], SitesPaginatedResponseSchemaDto);
//# sourceMappingURL=site-response.dto.js.map