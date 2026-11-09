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
exports.PhoneLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const auth_validation_constants_1 = require("../../shared/auth-validation.constants");
const phone_util_1 = require("../../../../common/utils/phone.util");
class PhoneLoginDto {
    phone_number;
    secret_code;
}
exports.PhoneLoginDto = PhoneLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "phone_number",
        example: "+2250707070707",
        description: "Numéro au format international E.164 avec indicatif pays obligatoire.",
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? (0, phone_util_1.normalizePhoneInput)(value) : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(32),
    (0, class_validator_1.Matches)(/^\+[0-9]{8,20}$/, {
        message: "Le numéro doit inclure l'indicatif pays (ex. +2250707070707).",
    }),
    __metadata("design:type", String)
], PhoneLoginDto.prototype, "phone_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "secret_code",
        example: "1234",
        minLength: auth_validation_constants_1.AUTH_SECRET_CODE_MIN_LENGTH,
        maxLength: 128,
        description: "Code PIN / mot de passe du compte.",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(auth_validation_constants_1.AUTH_SECRET_CODE_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], PhoneLoginDto.prototype, "secret_code", void 0);
//# sourceMappingURL=phone-login.dto.js.map