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
exports.MotifRhDto = exports.ReaffecterEmployeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ReaffecterEmployeDto {
    siteId;
    horaireId;
}
exports.ReaffecterEmployeDto = ReaffecterEmployeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: "Nouveau site de rattachement." }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReaffecterEmployeDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        nullable: true,
        example: 3,
        description: "Nouvel horaire ; null pour retirer l'horaire individuel.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.ValidateIf)((_, value) => value !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], ReaffecterEmployeDto.prototype, "horaireId", void 0);
class MotifRhDto {
    motif;
}
exports.MotifRhDto = MotifRhDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "Absences répétées",
        description: "Motif enregistré dans l'audit.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim() || undefined : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], MotifRhDto.prototype, "motif", void 0);
//# sourceMappingURL=rh-actions.dto.js.map