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
exports.EntitlementsResponseSchemaDto = exports.EntitlementsSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const pack_modules_constants_1 = require("../../../common/constants/pack-modules.constants");
class EntitlementsPackSchemaDto {
    id;
    code;
    nom;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EntitlementsPackSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "STARTER" }),
    __metadata("design:type", String)
], EntitlementsPackSchemaDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Starter" }),
    __metadata("design:type", String)
], EntitlementsPackSchemaDto.prototype, "nom", void 0);
class EntitlementsLimitesSchemaDto {
    maxEmployes;
    maxSites;
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 10 }),
    __metadata("design:type", Object)
], EntitlementsLimitesSchemaDto.prototype, "maxEmployes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 1 }),
    __metadata("design:type", Object)
], EntitlementsLimitesSchemaDto.prototype, "maxSites", void 0);
class EntitlementsUsageSchemaDto {
    employes;
    sites;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7 }),
    __metadata("design:type", Number)
], EntitlementsUsageSchemaDto.prototype, "employes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EntitlementsUsageSchemaDto.prototype, "sites", void 0);
class EntitlementsSchemaDto {
    entrepriseId;
    statut;
    dateEcheance;
    pack;
    limites;
    modules;
    usage;
}
exports.EntitlementsSchemaDto = EntitlementsSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EntitlementsSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StatutEntreprise }),
    __metadata("design:type", String)
], EntitlementsSchemaDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], EntitlementsSchemaDto.prototype, "dateEcheance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EntitlementsPackSchemaDto }),
    __metadata("design:type", EntitlementsPackSchemaDto)
], EntitlementsSchemaDto.prototype, "pack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: EntitlementsLimitesSchemaDto,
        description: "null = illimité. Sans MULTI_SITES, maxSites vaut 1.",
    }),
    __metadata("design:type", EntitlementsLimitesSchemaDto)
], EntitlementsSchemaDto.prototype, "limites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: pack_modules_constants_1.PACK_MODULE_VALUES, isArray: true }),
    __metadata("design:type", Array)
], EntitlementsSchemaDto.prototype, "modules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EntitlementsUsageSchemaDto }),
    __metadata("design:type", EntitlementsUsageSchemaDto)
], EntitlementsSchemaDto.prototype, "usage", void 0);
class EntitlementsResponseSchemaDto {
    success;
    message;
    data;
}
exports.EntitlementsResponseSchemaDto = EntitlementsResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], EntitlementsResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Droits récupérés avec succès" }),
    __metadata("design:type", String)
], EntitlementsResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: EntitlementsSchemaDto,
        nullable: true,
        description: "null pour l'équipe Pointelio (aucune entreprise).",
    }),
    __metadata("design:type", Object)
], EntitlementsResponseSchemaDto.prototype, "data", void 0);
//# sourceMappingURL=entitlements-response.dto.js.map