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
exports.UpdateHoraireDto = exports.CreateHoraireDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
const HEURE_MESSAGE = "L'heure doit être au format HH:mm (00:00 à 23:59).";
class CreateHoraireDto {
    nom;
    heureDebut;
    heureFin;
    toleranceMin;
    joursTravail;
}
exports.CreateHoraireDto = CreateHoraireDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Journée" }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateHoraireDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "08:00" }),
    (0, class_validator_1.Matches)(HEURE, { message: HEURE_MESSAGE }),
    __metadata("design:type", String)
], CreateHoraireDto.prototype, "heureDebut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "17:00",
        description: "Peut être antérieure au début (horaire de nuit, ex. 22:00 → 06:00).",
    }),
    (0, class_validator_1.Matches)(HEURE, { message: HEURE_MESSAGE }),
    __metadata("design:type", String)
], CreateHoraireDto.prototype, "heureFin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 15,
        default: 15,
        description: "Tolérance de retard en minutes.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(240),
    __metadata("design:type", Number)
], CreateHoraireDto.prototype, "toleranceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [1, 2, 3, 4, 5],
        description: "Jours travaillés : 1 = lundi … 7 = dimanche.",
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(1, { each: true }),
    (0, class_validator_1.Max)(7, { each: true }),
    __metadata("design:type", Array)
], CreateHoraireDto.prototype, "joursTravail", void 0);
class UpdateHoraireDto extends (0, swagger_1.PartialType)(CreateHoraireDto) {
}
exports.UpdateHoraireDto = UpdateHoraireDto;
//# sourceMappingURL=horaire.dto.js.map