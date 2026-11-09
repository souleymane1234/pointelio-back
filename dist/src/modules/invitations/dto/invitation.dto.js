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
exports.AcceptInvitationDto = exports.InvitationTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const auth_validation_constants_1 = require("../../auth/shared/auth-validation.constants");
class InvitationTokenDto {
    token;
}
exports.InvitationTokenDto = InvitationTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Jeton reçu dans le lien d'activation." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], InvitationTokenDto.prototype, "token", void 0);
class AcceptInvitationDto extends InvitationTokenDto {
    password;
}
exports.AcceptInvitationDto = AcceptInvitationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "MotDePasse8",
        description: "EMPLOYE / SURVEILLANT : PIN de 4 chiffres ou 8 caractères min. ; autres rôles : 8 caractères min.",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(auth_validation_constants_1.ADMIN_APP_USER_PASSWORD_LENGTH),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], AcceptInvitationDto.prototype, "password", void 0);
//# sourceMappingURL=invitation.dto.js.map