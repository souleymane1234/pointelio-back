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
exports.SurveillantEmployesResponseSchemaDto = exports.PointageCorrectionsResponseSchemaDto = exports.PointageCorrectionResponseSchemaDto = exports.PointagesPaginatedResponseSchemaDto = exports.PointageResponseSchemaDto = exports.SurveillantEmployeSchemaDto = exports.PointageCorrectionSchemaDto = exports.PointageSchemaDto = exports.PointageSiteSchemaDto = exports.PointagePersonneSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const pagination_response_dto_1 = require("../../../common/dto/pagination-response.dto");
const anomalies_constants_1 = require("../anomalies.constants");
class PointagePersonneSchemaDto {
    id;
    nom;
    prenom;
    matricule;
    salaireJournalier;
}
exports.PointagePersonneSchemaDto = PointagePersonneSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], PointagePersonneSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Traoré" }),
    __metadata("design:type", String)
], PointagePersonneSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Awa" }),
    __metadata("design:type", String)
], PointagePersonneSchemaDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "EMP-0042" }),
    __metadata("design:type", Object)
], PointagePersonneSchemaDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 5000, required: false }),
    __metadata("design:type", Object)
], PointagePersonneSchemaDto.prototype, "salaireJournalier", void 0);
class PointageSiteSchemaDto {
    id;
    nom;
}
exports.PointageSiteSchemaDto = PointageSiteSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PointageSiteSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Siège Plateau" }),
    __metadata("design:type", String)
], PointageSiteSchemaDto.prototype, "nom", void 0);
class PointageSchemaDto {
    id;
    entrepriseId;
    employeId;
    siteId;
    pointeParId;
    type;
    methode;
    latitude;
    longitude;
    precisionM;
    distanceM;
    statutValidation;
    motifStatut;
    mockDetecte;
    requestId;
    heureServeur;
    createdAt;
    employe;
    site;
    pointePar;
    retardMinutes;
    paieValidee;
    montantJour;
    anomalies;
}
exports.PointageSchemaDto = PointageSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "1024",
        description: "Identifiant BigInt sérialisé en texte.",
    }),
    __metadata("design:type", String)
], PointageSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PointageSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], PointageSchemaDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PointageSchemaDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true }),
    __metadata("design:type", Object)
], PointageSchemaDto.prototype, "pointeParId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TypePointage }),
    __metadata("design:type", String)
], PointageSchemaDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.MethodePointage }),
    __metadata("design:type", String)
], PointageSchemaDto.prototype, "methode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 5.3197 }),
    __metadata("design:type", Object)
], PointageSchemaDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: -4.0168 }),
    __metadata("design:type", Object)
], PointageSchemaDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 12 }),
    __metadata("design:type", Object)
], PointageSchemaDto.prototype, "precisionM", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 8.4 }),
    __metadata("design:type", Object)
], PointageSchemaDto.prototype, "distanceM", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StatutValidation }),
    __metadata("design:type", String)
], PointageSchemaDto.prototype, "statutValidation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], PointageSchemaDto.prototype, "motifStatut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PointageSchemaDto.prototype, "mockDetecte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PointageSchemaDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PointageSchemaDto.prototype, "heureServeur", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PointageSchemaDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PointagePersonneSchemaDto }),
    __metadata("design:type", PointagePersonneSchemaDto)
], PointageSchemaDto.prototype, "employe", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PointageSiteSchemaDto }),
    __metadata("design:type", PointageSiteSchemaDto)
], PointageSchemaDto.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PointagePersonneSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], PointageSchemaDto.prototype, "pointePar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        nullable: true,
        example: 12,
        description: "Minutes de retard au-delà de la tolérance du site (arrivées uniquement).",
    }),
    __metadata("design:type", Object)
], PointageSchemaDto.prototype, "retardMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "true si l'employé a une arrivée et un départ le même jour (journée payée).",
    }),
    __metadata("design:type", Boolean)
], PointageSchemaDto.prototype, "paieValidee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5000,
        description: "Montant du jour en FCFA (salaire journalier si paie validée).",
    }),
    __metadata("design:type", Number)
], PointageSchemaDto.prototype, "montantJour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: anomalies_constants_1.ANOMALIE_VALUES,
        isArray: true,
        description: "Anomalies calculées (GPS, retard, oubli de départ).",
    }),
    __metadata("design:type", Array)
], PointageSchemaDto.prototype, "anomalies", void 0);
class PointageCorrectionSchemaDto {
    id;
    pointageId;
    auteurId;
    motif;
    avant;
    apres;
    createdAt;
    auteur;
}
exports.PointageCorrectionSchemaDto = PointageCorrectionSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], PointageCorrectionSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "1024" }),
    __metadata("design:type", String)
], PointageCorrectionSchemaDto.prototype, "pointageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], PointageCorrectionSchemaDto.prototype, "auteurId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PointageCorrectionSchemaDto.prototype, "motif", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    __metadata("design:type", Object)
], PointageCorrectionSchemaDto.prototype, "avant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    __metadata("design:type", Object)
], PointageCorrectionSchemaDto.prototype, "apres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PointageCorrectionSchemaDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PointagePersonneSchemaDto }),
    __metadata("design:type", PointagePersonneSchemaDto)
], PointageCorrectionSchemaDto.prototype, "auteur", void 0);
class SurveillantEmployeSchemaDto {
    id;
    nom;
    prenom;
    matricule;
    poste;
    photoUrl;
    dernierPointageJour;
}
exports.SurveillantEmployeSchemaDto = SurveillantEmployeSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], SurveillantEmployeSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Traoré" }),
    __metadata("design:type", String)
], SurveillantEmployeSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Awa" }),
    __metadata("design:type", String)
], SurveillantEmployeSchemaDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], SurveillantEmployeSchemaDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], SurveillantEmployeSchemaDto.prototype, "poste", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], SurveillantEmployeSchemaDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: PointageSchemaDto,
        nullable: true,
        description: "Dernier pointage du jour civil (fuseau de l'entreprise).",
    }),
    __metadata("design:type", Object)
], SurveillantEmployeSchemaDto.prototype, "dernierPointageJour", void 0);
let PointageResponseSchemaDto = class PointageResponseSchemaDto {
    success;
    message;
    data;
};
exports.PointageResponseSchemaDto = PointageResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PointageResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PointageResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PointageSchemaDto }),
    __metadata("design:type", PointageSchemaDto)
], PointageResponseSchemaDto.prototype, "data", void 0);
exports.PointageResponseSchemaDto = PointageResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(PointageSchemaDto, PointagePersonneSchemaDto, PointageSiteSchemaDto)
], PointageResponseSchemaDto);
let PointagesPaginatedResponseSchemaDto = class PointagesPaginatedResponseSchemaDto {
    success;
    message;
    data;
    pagination;
};
exports.PointagesPaginatedResponseSchemaDto = PointagesPaginatedResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PointagesPaginatedResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PointagesPaginatedResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PointageSchemaDto] }),
    __metadata("design:type", Array)
], PointagesPaginatedResponseSchemaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_response_dto_1.PaginationMetaSchemaDto }),
    __metadata("design:type", pagination_response_dto_1.PaginationMetaSchemaDto)
], PointagesPaginatedResponseSchemaDto.prototype, "pagination", void 0);
exports.PointagesPaginatedResponseSchemaDto = PointagesPaginatedResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(PointageSchemaDto, pagination_response_dto_1.PaginationMetaSchemaDto)
], PointagesPaginatedResponseSchemaDto);
let PointageCorrectionResponseSchemaDto = class PointageCorrectionResponseSchemaDto {
    success;
    message;
    data;
};
exports.PointageCorrectionResponseSchemaDto = PointageCorrectionResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PointageCorrectionResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PointageCorrectionResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PointageCorrectionSchemaDto }),
    __metadata("design:type", PointageCorrectionSchemaDto)
], PointageCorrectionResponseSchemaDto.prototype, "data", void 0);
exports.PointageCorrectionResponseSchemaDto = PointageCorrectionResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(PointageCorrectionSchemaDto)
], PointageCorrectionResponseSchemaDto);
let PointageCorrectionsResponseSchemaDto = class PointageCorrectionsResponseSchemaDto {
    success;
    message;
    data;
};
exports.PointageCorrectionsResponseSchemaDto = PointageCorrectionsResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PointageCorrectionsResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PointageCorrectionsResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PointageCorrectionSchemaDto] }),
    __metadata("design:type", Array)
], PointageCorrectionsResponseSchemaDto.prototype, "data", void 0);
exports.PointageCorrectionsResponseSchemaDto = PointageCorrectionsResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(PointageCorrectionSchemaDto)
], PointageCorrectionsResponseSchemaDto);
let SurveillantEmployesResponseSchemaDto = class SurveillantEmployesResponseSchemaDto {
    success;
    message;
    data;
};
exports.SurveillantEmployesResponseSchemaDto = SurveillantEmployesResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], SurveillantEmployesResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SurveillantEmployesResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SurveillantEmployeSchemaDto] }),
    __metadata("design:type", Array)
], SurveillantEmployesResponseSchemaDto.prototype, "data", void 0);
exports.SurveillantEmployesResponseSchemaDto = SurveillantEmployesResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(SurveillantEmployeSchemaDto)
], SurveillantEmployesResponseSchemaDto);
//# sourceMappingURL=pointage-response.dto.js.map