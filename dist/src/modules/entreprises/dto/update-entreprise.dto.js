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
exports.MotifDto = exports.UpdateProfilEntrepriseDto = exports.UpdateEntrepriseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const entreprise_fields_dto_1 = require("./entreprise-fields.dto");
class UpdateEntrepriseDto extends entreprise_fields_dto_1.EntrepriseProfilFieldsDto {
    raisonSociale;
    notesInternes;
}
exports.UpdateEntrepriseDto = UpdateEntrepriseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "ACME Côte d'Ivoire SARL" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", String)
], UpdateEntrepriseDto.prototype, "raisonSociale", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.notesInternes !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", Object)
], UpdateEntrepriseDto.prototype, "notesInternes", void 0);
class UpdateProfilEntrepriseDto extends entreprise_fields_dto_1.EntrepriseProfilFieldsDto {
}
exports.UpdateProfilEntrepriseDto = UpdateProfilEntrepriseDto;
class MotifDto {
    motif;
}
exports.MotifDto = MotifDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "Impayé depuis 60 jours",
        description: "Enregistré dans l'audit.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], MotifDto.prototype, "motif", void 0);
//# sourceMappingURL=update-entreprise.dto.js.map