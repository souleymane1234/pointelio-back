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
exports.CreatePackDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pack_modules_constants_1 = require("../../../common/constants/pack-modules.constants");
const trim = ({ value }) => typeof value === "string" ? value.trim() : value;
class CreatePackDto {
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
}
exports.CreatePackDto = CreatePackDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "STARTER", description: "Majuscules, chiffres, _." }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim().toUpperCase() : value),
    (0, class_validator_1.Matches)(/^[A-Z][A-Z0-9_]{1,49}$/, {
        message: "Le code doit contenir 2 à 50 caractères : A-Z, 0-9 ou _.",
    }),
    __metadata("design:type", String)
], CreatePackDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Starter" }),
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreatePackDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000, description: "Prix mensuel en FCFA." }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePackDto.prototype, "prixMensuel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Idéal pour les petites équipes." }),
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", String)
], CreatePackDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        nullable: true,
        example: 10,
        description: "null = illimité.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.maxEmployes !== null),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreatePackDto.prototype, "maxEmployes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        nullable: true,
        example: 1,
        description: "null = illimité.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.maxSites !== null),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreatePackDto.prototype, "maxSites", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 14, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePackDto.prototype, "essaiJours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: pack_modules_constants_1.PACK_MODULE_VALUES,
        isArray: true,
        example: ["QR", "GPS"],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsIn)(pack_modules_constants_1.PACK_MODULE_VALUES, { each: true }),
    __metadata("design:type", Array)
], CreatePackDto.prototype, "modules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePackDto.prototype, "ordre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePackDto.prototype, "actif", void 0);
//# sourceMappingURL=create-pack.dto.js.map