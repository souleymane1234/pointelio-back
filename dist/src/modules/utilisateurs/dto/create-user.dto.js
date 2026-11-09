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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const auth_validation_constants_1 = require("../../auth/shared/auth-validation.constants");
const phone_util_1 = require("../../../common/utils/phone.util");
let AdminCreateUserPasswordConstraint = class AdminCreateUserPasswordConstraint {
    validate(value, args) {
        const role = args.object.role;
        return typeof value === "string" && value.length <= 128 && !!role
            ? (0, auth_validation_constants_1.isAdminUserPasswordValid)(value, role)
            : false;
    }
    defaultMessage(args) {
        if (typeof args.value !== "string" || args.value === "") {
            return "Le mot de passe est obligatoire.";
        }
        const role = args.object.role ?? client_1.Role.EMPLOYE;
        return (0, auth_validation_constants_1.adminUserPasswordErrorMessage)(role);
    }
};
AdminCreateUserPasswordConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: "adminCreateUserPassword", async: false })
], AdminCreateUserPasswordConstraint);
const collapseSpaces = ({ value }) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
const emptyToUndefined = ({ value }) => typeof value === "string" ? value.trim() || undefined : value;
class CreateUserDto {
    role;
    nom;
    prenom;
    email;
    telephone;
    password;
    statut;
    entrepriseId;
    siteId;
    horaireId;
    salaireJournalier;
    matricule;
    poste;
    dateEmbauche;
    photoUrl;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Role, example: client_1.Role.EMPLOYE }),
    (0, class_validator_1.IsEnum)(client_1.Role),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Traoré" }),
    (0, class_transformer_1.Transform)(collapseSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Moussa" }),
    (0, class_transformer_1.Transform)(collapseSpaces),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateUserDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "moussa@acme.ci",
        description: "Facultatif. Identifiant de connexion au back-office.",
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim().toLowerCase() || undefined : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "+2250700000000",
        description: "Obligatoire. Format international avec indicatif pays.",
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null)
            return undefined;
        if (typeof value === "string" && value.trim() === "")
            return undefined;
        return typeof value === "string" ? (0, phone_util_1.normalizePhoneInput)(value) : value;
    }),
    (0, class_validator_1.Matches)(/^\+?[0-9]{8,20}$/, {
        message: ({ value }) => value
            ? "Le numéro de téléphone doit contenir 8 à 20 chiffres (préfixe + autorisé)."
            : "Le numéro de téléphone est obligatoire.",
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "0000",
        description: "Obligatoire : le compte est actif dès sa création (aucune validation par e-mail). EMPLOYE / SURVEILLANT : PIN de 4 chiffres ou 8 caractères min. ; autres rôles : 8 caractères min.",
    }),
    (0, class_transformer_1.Transform)(emptyToUndefined),
    (0, class_validator_1.Validate)(AdminCreateUserPasswordConstraint),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.StatutCompte,
        description: "Par défaut : ACTIF.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatutCompte),
    __metadata("design:type", String)
], CreateUserDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        description: "Entreprise du compte (équipe Pointelio uniquement ; imposée pour un admin d'entreprise, ignorée pour SUPER_ADMIN / SUPPORT).",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3, description: "Site de rattachement." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2, description: "Horaire de travail." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "horaireId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 5000,
        description: "Salaire d'une journée (FCFA). Obligatoire pour un EMPLOYE : versé si arrivée + départ le même jour.",
    }),
    (0, class_validator_1.ValidateIf)((o) => o.role === client_1.Role.EMPLOYE),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "salaireJournalier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "EMP-0042",
        description: "Unique par entreprise.",
    }),
    (0, class_transformer_1.Transform)(emptyToUndefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateUserDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Caissier" }),
    (0, class_transformer_1.Transform)(emptyToUndefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateUserDto.prototype, "poste", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-01-15" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "dateEmbauche", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "https://cdn.example.com/photos/moussa.jpg",
    }),
    (0, class_transformer_1.Transform)(emptyToUndefined),
    (0, class_validator_1.ValidateIf)((o) => o.photoUrl !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2048),
    (0, class_validator_1.Matches)(/^https?:\/\//, {
        message: "La photo doit être une URL http(s) valide.",
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "photoUrl", void 0);
//# sourceMappingURL=create-user.dto.js.map