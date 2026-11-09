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
exports.AuthRefreshResponseSchemaDto = exports.AuthRegisterLoginResponseSchemaDto = exports.AuthDataSchemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class AuthUserSchemaDto {
    id;
    entrepriseId;
    siteId;
    matricule;
    nom;
    prenom;
    email;
    telephone;
    role;
    poste;
    photoUrl;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], AuthUserSchemaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        nullable: true,
        example: 1,
        description: "Null pour l'équipe Pointelio (SUPER_ADMIN / SUPPORT).",
    }),
    __metadata("design:type", Object)
], AuthUserSchemaDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true, example: 3 }),
    __metadata("design:type", Object)
], AuthUserSchemaDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "EMP-0042" }),
    __metadata("design:type", Object)
], AuthUserSchemaDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Traoré" }),
    __metadata("design:type", String)
], AuthUserSchemaDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Moussa" }),
    __metadata("design:type", String)
], AuthUserSchemaDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "moussa@acme.ci" }),
    __metadata("design:type", Object)
], AuthUserSchemaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "+2250700000000" }),
    __metadata("design:type", Object)
], AuthUserSchemaDto.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Role, example: client_1.Role.EMPLOYE }),
    __metadata("design:type", String)
], AuthUserSchemaDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true, example: "Caissier" }),
    __metadata("design:type", Object)
], AuthUserSchemaDto.prototype, "poste", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        nullable: true,
        example: "https://example.com/photo.jpg",
    }),
    __metadata("design:type", Object)
], AuthUserSchemaDto.prototype, "photoUrl", void 0);
class AuthDataSchemaDto {
    access_token;
    refresh_token;
    user;
}
exports.AuthDataSchemaDto = AuthDataSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ name: "access_token" }),
    __metadata("design:type", String)
], AuthDataSchemaDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "refresh_token" }),
    __metadata("design:type", String)
], AuthDataSchemaDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AuthUserSchemaDto }),
    __metadata("design:type", AuthUserSchemaDto)
], AuthDataSchemaDto.prototype, "user", void 0);
class AuthRefreshDataSchemaDto {
    access_token;
    refresh_token;
}
__decorate([
    (0, swagger_1.ApiProperty)({ name: "access_token" }),
    __metadata("design:type", String)
], AuthRefreshDataSchemaDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "refresh_token" }),
    __metadata("design:type", String)
], AuthRefreshDataSchemaDto.prototype, "refresh_token", void 0);
let AuthRegisterLoginResponseSchemaDto = class AuthRegisterLoginResponseSchemaDto {
    success;
    message;
    data;
};
exports.AuthRegisterLoginResponseSchemaDto = AuthRegisterLoginResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AuthRegisterLoginResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Connexion réussie" }),
    __metadata("design:type", String)
], AuthRegisterLoginResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AuthDataSchemaDto }),
    __metadata("design:type", AuthDataSchemaDto)
], AuthRegisterLoginResponseSchemaDto.prototype, "data", void 0);
exports.AuthRegisterLoginResponseSchemaDto = AuthRegisterLoginResponseSchemaDto = __decorate([
    (0, swagger_1.ApiExtraModels)(AuthUserSchemaDto, AuthDataSchemaDto, AuthRefreshDataSchemaDto)
], AuthRegisterLoginResponseSchemaDto);
class AuthRefreshResponseSchemaDto {
    success;
    message;
    data;
}
exports.AuthRefreshResponseSchemaDto = AuthRefreshResponseSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AuthRefreshResponseSchemaDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Tokens renouvelés" }),
    __metadata("design:type", String)
], AuthRefreshResponseSchemaDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AuthRefreshDataSchemaDto }),
    __metadata("design:type", AuthRefreshDataSchemaDto)
], AuthRefreshResponseSchemaDto.prototype, "data", void 0);
//# sourceMappingURL=auth-response.dto.js.map