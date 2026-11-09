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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const api_endpoint_decorator_1 = require("../../common/decorators/api-endpoint.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const throttler_constants_1 = require("../../common/throttler/throttler.constants");
const request_context_1 = require("../../common/types/request-context");
const response_util_1 = require("../../common/utils/response.util");
const auth_response_dto_1 = require("../auth/session/dto/auth-response.dto");
const auth_response_mobile_util_1 = require("../auth/session/utils/auth-response-mobile.util");
const invitation_dto_1 = require("./dto/invitation.dto");
const invitations_service_1 = require("./invitations.service");
let InvitationsController = class InvitationsController {
    invitations;
    constructor(invitations) {
        this.invitations = invitations;
    }
    async verifier(req, dto) {
        const locale = this.locale(req);
        const data = await this.invitations.verifier(dto.token, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "invitationFetched"), data, locale);
    }
    async accepter(req, dto) {
        const locale = this.locale(req);
        const result = await this.invitations.accepter(dto.token, dto.password, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "invitationAccepted"), (0, auth_response_mobile_util_1.authSuccessData)(result), locale);
    }
    async renvoyer(req, utilisateurId) {
        const locale = this.locale(req);
        const data = await this.invitations.renvoyer((0, request_context_1.requireUser)(req), utilisateurId, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "invitationSent"), data, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("verifier"),
    (0, throttler_1.Throttle)((0, throttler_constants_1.authThrottleOptions)()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Vérifier un lien d'activation",
        audience: "mobile",
        description: "Lien d'activation reçu par **e-mail** (pas de SMS ni d'OTP). Renvoie l'e-mail, le rôle et l'entreprise pour l'écran d'activation.",
        invalid: "Lien invalide, expiré ou déjà utilisé",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, invitation_dto_1.InvitationTokenDto]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "verifier", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("accepter"),
    (0, throttler_1.Throttle)((0, throttler_constants_1.authThrottleOptions)()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Activer son compte",
        audience: "mobile",
        description: "Définit le PIN / mot de passe, passe le compte au statut ACTIF et renvoie les tokens. EMPLOYE / SURVEILLANT : PIN de 4 chiffres.",
        schema: auth_response_dto_1.AuthRegisterLoginResponseSchemaDto,
        invalid: "Lien invalide ou mot de passe non conforme",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, invitation_dto_1.AcceptInvitationDto]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "accepter", null);
__decorate([
    (0, common_1.Post)("utilisateurs/:utilisateurId/renvoyer"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.USER_MANAGER_ROLES),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Renvoyer l'invitation d'un compte",
        audience: ["employeur", "plateforme"],
        description: "Renvoie le **lien d'activation par e-mail** (pas de SMS). Remplace l'invitation en cours. Le compte doit être INVITE et avoir un e-mail.",
        notFound: "Utilisateur introuvable ou hors périmètre",
        invalid: "Compte déjà activé ou sans e-mail",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("utilisateurId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "renvoyer", null);
exports.InvitationsController = InvitationsController = __decorate([
    (0, swagger_1.ApiTags)("Invitations"),
    (0, common_1.Controller)("invitations"),
    __metadata("design:paramtypes", [invitations_service_1.InvitationsService])
], InvitationsController);
//# sourceMappingURL=invitations.controller.js.map