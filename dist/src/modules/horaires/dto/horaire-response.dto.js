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
exports.HorairesResponseSchemaDto = exports.HoraireResponseSchemaDto = exports.HoraireSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class HoraireSchemaDto {
    id;
    entrepriseId;
    nom;
    heureDebut;
    heureFin;
    toleranceMin;
    joursTravail;
    utilisateursCount;
    createdAt;
}
exports.HoraireSchemaDto = HoraireSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], HoraireSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], HoraireSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Journée" }),
    __metadata("design:type", String)
], HoraireSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "08:00" }),
    __metadata("design:type", String)
], HoraireSchemaDto.prototype, "heureDebut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "17:00" }),
    __metadata("design:type", String)
], HoraireSchemaDto.prototype, "heureFin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    __metadata("design:type", Number)
], HoraireSchemaDto.prototype, "toleranceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [1, 2, 3, 4, 5], type: [Number] }),
    __metadata("design:type", Array)
], HoraireSchemaDto.prototype, "joursTravail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], HoraireSchemaDto.prototype, "utilisateursCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], HoraireSchemaDto.prototype, "createdAt", void 0);
let HoraireResponseSchemaDto = class HoraireResponseSchemaDto {
    success;
    message;
    data;
};
exports.HoraireResponseSchemaDto = HoraireResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], HoraireResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HoraireResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: HoraireSchemaDto }),
    __metadata("design:type", HoraireSchemaDto)
], HoraireResponseSchemaDto.prototype, "data", void 0);
exports.HoraireResponseSchemaDto = HoraireResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(HoraireSchemaDto)
], HoraireResponseSchemaDto);
let HorairesResponseSchemaDto = class HorairesResponseSchemaDto {
    success;
    message;
    data;
};
exports.HorairesResponseSchemaDto = HorairesResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], HorairesResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HorairesResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [HoraireSchemaDto] }),
    __metadata("design:type", Array)
], HorairesResponseSchemaDto.prototype, "data", void 0);
exports.HorairesResponseSchemaDto = HorairesResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(HoraireSchemaDto)
], HorairesResponseSchemaDto);
//# sourceMappingURL=horaire-response.dto.js.map