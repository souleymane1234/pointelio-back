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
exports.PresencePeriodeQueryDto = exports.PresenceQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PresenceQueryDto {
    date;
    siteId;
}
exports.PresenceQueryDto = PresenceQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "2026-10-27",
        description: "Jour civil (YYYY-MM-DD). Défaut : aujourd'hui (fuseau entreprise).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, {
        message: "La date doit être au format YYYY-MM-DD.",
    }),
    __metadata("design:type", String)
], PresenceQueryDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3, description: "Filtrer sur un site." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PresenceQueryDto.prototype, "siteId", void 0);
const DATE_MESSAGE = "La date doit être au format YYYY-MM-DD.";
class PresencePeriodeQueryDto {
    du;
    au;
    siteId;
    employeId;
}
exports.PresencePeriodeQueryDto = PresencePeriodeQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-11-02", description: "Premier jour (inclus)." }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: DATE_MESSAGE }),
    __metadata("design:type", String)
], PresencePeriodeQueryDto.prototype, "du", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2026-11-08",
        description: "Dernier jour (inclus). 62 jours maximum.",
    }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: DATE_MESSAGE }),
    __metadata("design:type", String)
], PresencePeriodeQueryDto.prototype, "au", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3, description: "Filtrer sur un site." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PresencePeriodeQueryDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 12,
        description: "Un seul employé : la réponse inclut aussi son détail jour par jour (`employes[0].detail`).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PresencePeriodeQueryDto.prototype, "employeId", void 0);
//# sourceMappingURL=presence-query.dto.js.map