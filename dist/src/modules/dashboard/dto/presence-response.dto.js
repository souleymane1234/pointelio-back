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
exports.PresenceResponseSchemaDto = exports.PresenceJourSchemaDto = exports.PresenceEmployeSchemaDto = exports.PresencePointageSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class PresencePointageSchemaDto {
    id;
    type;
    heureServeur;
    statutValidation;
    retardMinutes;
}
exports.PresencePointageSchemaDto = PresencePointageSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "1024" }),
    __metadata("design:type", String)
], PresencePointageSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TypePointage }),
    __metadata("design:type", String)
], PresencePointageSchemaDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PresencePointageSchemaDto.prototype, "heureServeur", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StatutValidation }),
    __metadata("design:type", String)
], PresencePointageSchemaDto.prototype, "statutValidation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 12 }),
    __metadata("design:type", Object)
], PresencePointageSchemaDto.prototype, "retardMinutes", void 0);
class PresenceEmployeSchemaDto {
    employeId;
    nom;
    prenom;
    matricule;
    siteId;
    siteNom;
    jourOuvre;
    heureDebut;
    heureFin;
    toleranceMin;
    arrivee;
    depart;
    enRetard;
    paieValidee;
    salaireJournalier;
    montantJour;
}
exports.PresenceEmployeSchemaDto = PresenceEmployeSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], PresenceEmployeSchemaDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Traoré" }),
    __metadata("design:type", String)
], PresenceEmployeSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Awa" }),
    __metadata("design:type", String)
], PresenceEmployeSchemaDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], PresenceEmployeSchemaDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PresenceEmployeSchemaDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Siège Plateau" }),
    __metadata("design:type", String)
], PresenceEmployeSchemaDto.prototype, "siteNom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Le jour consulté est un jour ouvré du site.",
    }),
    __metadata("design:type", Boolean)
], PresenceEmployeSchemaDto.prototype, "jourOuvre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "08:00" }),
    __metadata("design:type", Object)
], PresenceEmployeSchemaDto.prototype, "heureDebut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "17:00" }),
    __metadata("design:type", Object)
], PresenceEmployeSchemaDto.prototype, "heureFin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        nullable: true,
        example: 15,
        description: "Tolérance de retard du site (minutes). null = l'employeur n'en a pas défini.",
    }),
    __metadata("design:type", Object)
], PresenceEmployeSchemaDto.prototype, "toleranceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PresencePointageSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], PresenceEmployeSchemaDto.prototype, "arrivee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PresencePointageSchemaDto, nullable: true }),
    __metadata("design:type", Object)
], PresenceEmployeSchemaDto.prototype, "depart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Arrivée après l'heure de début + tolérance." }),
    __metadata("design:type", Boolean)
], PresenceEmployeSchemaDto.prototype, "enRetard", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Journée payée : arrivée et départ enregistrés.",
    }),
    __metadata("design:type", Boolean)
], PresenceEmployeSchemaDto.prototype, "paieValidee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        nullable: true,
        example: 5000,
        description: "Salaire journalier configuré (FCFA).",
    }),
    __metadata("design:type", Object)
], PresenceEmployeSchemaDto.prototype, "salaireJournalier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5000,
        description: "Montant dû ce jour (salaire si paie validée, sinon 0).",
    }),
    __metadata("design:type", Number)
], PresenceEmployeSchemaDto.prototype, "montantJour", void 0);
class PresenceJourSchemaDto {
    date;
    effectif;
    presents;
    retards;
    paiesValidees;
    masseSalarialeJour;
    employes;
}
exports.PresenceJourSchemaDto = PresenceJourSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-10-27" }),
    __metadata("design:type", String)
], PresenceJourSchemaDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: "Employés actifs du périmètre." }),
    __metadata("design:type", Number)
], PresenceJourSchemaDto.prototype, "effectif", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 9 }),
    __metadata("design:type", Number)
], PresenceJourSchemaDto.prototype, "presents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], PresenceJourSchemaDto.prototype, "retards", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8, description: "Journées avec arrivée + départ." }),
    __metadata("design:type", Number)
], PresenceJourSchemaDto.prototype, "paiesValidees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 40000,
        description: "Somme des montants du jour (FCFA).",
    }),
    __metadata("design:type", Number)
], PresenceJourSchemaDto.prototype, "masseSalarialeJour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PresenceEmployeSchemaDto] }),
    __metadata("design:type", Array)
], PresenceJourSchemaDto.prototype, "employes", void 0);
let PresenceResponseSchemaDto = class PresenceResponseSchemaDto {
    success;
    message;
    data;
};
exports.PresenceResponseSchemaDto = PresenceResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PresenceResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PresenceResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PresenceJourSchemaDto }),
    __metadata("design:type", PresenceJourSchemaDto)
], PresenceResponseSchemaDto.prototype, "data", void 0);
exports.PresenceResponseSchemaDto = PresenceResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(PresenceJourSchemaDto, PresenceEmployeSchemaDto)
], PresenceResponseSchemaDto);
//# sourceMappingURL=presence-response.dto.js.map