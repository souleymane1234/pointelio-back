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
exports.PacksPaginatedResponseSchemaDto = exports.PackResponseSchemaDto = exports.PackSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const pack_modules_constants_1 = require("../../../common/constants/pack-modules.constants");
const pagination_response_dto_1 = require("../../../common/dto/pagination-response.dto");
class PackSchemaDto {
    id;
    code;
    nom;
    prixMensuel;
    description;
    maxEmployes;
    maxSites;
    essaiJours;
    modules;
    ordre;
    actif;
    entreprisesCount;
    createdAt;
    updatedAt;
}
exports.PackSchemaDto = PackSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PackSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "STARTER" }),
    __metadata("design:type", String)
], PackSchemaDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Starter" }),
    __metadata("design:type", String)
], PackSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000, description: "FCFA / mois." }),
    __metadata("design:type", Number)
], PackSchemaDto.prototype, "prixMensuel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    __metadata("design:type", Object)
], PackSchemaDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 10 }),
    __metadata("design:type", Object)
], PackSchemaDto.prototype, "maxEmployes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 1 }),
    __metadata("design:type", Object)
], PackSchemaDto.prototype, "maxSites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 14 }),
    __metadata("design:type", Number)
], PackSchemaDto.prototype, "essaiJours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: pack_modules_constants_1.PACK_MODULE_VALUES, isArray: true }),
    __metadata("design:type", Array)
], PackSchemaDto.prototype, "modules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PackSchemaDto.prototype, "ordre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PackSchemaDto.prototype, "actif", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, description: "Entreprises abonnées à ce pack." }),
    __metadata("design:type", Number)
], PackSchemaDto.prototype, "entreprisesCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PackSchemaDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PackSchemaDto.prototype, "updatedAt", void 0);
let PackResponseSchemaDto = class PackResponseSchemaDto {
    success;
    message;
    data;
};
exports.PackResponseSchemaDto = PackResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PackResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Pack récupéré avec succès" }),
    __metadata("design:type", String)
], PackResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PackSchemaDto }),
    __metadata("design:type", PackSchemaDto)
], PackResponseSchemaDto.prototype, "data", void 0);
exports.PackResponseSchemaDto = PackResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(PackSchemaDto)
], PackResponseSchemaDto);
let PacksPaginatedResponseSchemaDto = class PacksPaginatedResponseSchemaDto {
    success;
    message;
    data;
    pagination;
};
exports.PacksPaginatedResponseSchemaDto = PacksPaginatedResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PacksPaginatedResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Packs récupérés avec succès" }),
    __metadata("design:type", String)
], PacksPaginatedResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PackSchemaDto] }),
    __metadata("design:type", Array)
], PacksPaginatedResponseSchemaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_response_dto_1.PaginationMetaSchemaDto }),
    __metadata("design:type", pagination_response_dto_1.PaginationMetaSchemaDto)
], PacksPaginatedResponseSchemaDto.prototype, "pagination", void 0);
exports.PacksPaginatedResponseSchemaDto = PacksPaginatedResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(PackSchemaDto, pagination_response_dto_1.PaginationMetaSchemaDto)
], PacksPaginatedResponseSchemaDto);
//# sourceMappingURL=pack-response.dto.js.map