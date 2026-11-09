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
exports.UpdateAbonnementDto = exports.STATUTS_ABONNEMENT = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pack_modules_constants_1 = require("../../../common/constants/pack-modules.constants");
exports.STATUTS_ABONNEMENT = [
    client_1.StatutEntreprise.ESSAI,
    client_1.StatutEntreprise.ACTIF,
    client_1.StatutEntreprise.PAIEMENT_EN_ATTENTE,
    client_1.StatutEntreprise.EN_RETARD,
];
class UpdateAbonnementDto {
    packId;
    statut;
    dateEcheance;
    maxEmployesOverride;
    maxSitesOverride;
    modulesOverride;
}
exports.UpdateAbonnementDto = UpdateAbonnementDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateAbonnementDto.prototype, "packId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.STATUTS_ABONNEMENT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.STATUTS_ABONNEMENT),
    __metadata("design:type", Object)
], UpdateAbonnementDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true, example: "2026-12-31" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.dateEcheance !== null),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], UpdateAbonnementDto.prototype, "dateEcheance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, nullable: true, example: 25 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.maxEmployesOverride !== null),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], UpdateAbonnementDto.prototype, "maxEmployesOverride", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, nullable: true, example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.maxSitesOverride !== null),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], UpdateAbonnementDto.prototype, "maxSitesOverride", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: pack_modules_constants_1.PACK_MODULE_VALUES,
        isArray: true,
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.modulesOverride !== null),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsIn)(pack_modules_constants_1.PACK_MODULE_VALUES, { each: true }),
    __metadata("design:type", Object)
], UpdateAbonnementDto.prototype, "modulesOverride", void 0);
//# sourceMappingURL=update-abonnement.dto.js.map