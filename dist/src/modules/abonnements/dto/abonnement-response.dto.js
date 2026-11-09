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
exports.AbonnementResponseSchemaDto = exports.AbonnementSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const entitlements_response_dto_1 = require("../../entitlements/dto/entitlements-response.dto");
class AbonnementSchemaDto extends entitlements_response_dto_1.EntitlementsSchemaDto {
    dateDemarrage;
    prixMensuel;
    bloque;
}
exports.AbonnementSchemaDto = AbonnementSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], AbonnementSchemaDto.prototype, "dateDemarrage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000, description: "FCFA / mois (prix du pack)." }),
    __metadata("design:type", Number)
], AbonnementSchemaDto.prototype, "prixMensuel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Abonnement suspendu, résilié ou essai échu : accès bloqué.",
    }),
    __metadata("design:type", Boolean)
], AbonnementSchemaDto.prototype, "bloque", void 0);
class AbonnementResponseSchemaDto {
    success;
    message;
    data;
}
exports.AbonnementResponseSchemaDto = AbonnementResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AbonnementResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Abonnement récupéré avec succès" }),
    __metadata("design:type", String)
], AbonnementResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AbonnementSchemaDto }),
    __metadata("design:type", AbonnementSchemaDto)
], AbonnementResponseSchemaDto.prototype, "data", void 0);
//# sourceMappingURL=abonnement-response.dto.js.map