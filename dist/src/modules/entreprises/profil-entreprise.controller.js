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
exports.ProfilEntrepriseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const abonnement_inactif_decorator_1 = require("../../common/decorators/abonnement-inactif.decorator");
const api_audience_decorator_1 = require("../../common/decorators/api-audience.decorator");
const api_endpoint_decorator_1 = require("../../common/decorators/api-endpoint.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const request_context_1 = require("../../common/types/request-context");
const response_util_1 = require("../../common/utils/response.util");
const entreprise_response_dto_1 = require("./dto/entreprise-response.dto");
const update_entreprise_dto_1 = require("./dto/update-entreprise.dto");
const profil_entreprise_service_1 = require("./profil-entreprise.service");
let ProfilEntrepriseController = class ProfilEntrepriseController {
    profil;
    constructor(profil) {
        this.profil = profil;
    }
    async get(req) {
        const locale = this.locale(req);
        const data = await this.profil.get((0, request_context_1.requireTenant)(req).entrepriseId, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "entrepriseProfilFetched"), data, locale);
    }
    async update(req, dto) {
        const locale = this.locale(req);
        const data = await this.profil.update((0, request_context_1.requireUserId)(req), (0, request_context_1.requireTenant)(req).entrepriseId, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "entrepriseProfilUpdated"), data, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.ProfilEntrepriseController = ProfilEntrepriseController;
__decorate([
    (0, common_1.Get)(),
    (0, abonnement_inactif_decorator_1.AutoriseAbonnementInactif)(),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Profil de mon entreprise",
        schema: entreprise_response_dto_1.EntrepriseProfilResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilEntrepriseController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_CLIENT),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Compléter le profil de mon entreprise",
        description: "`profilComplete` passe à true quand secteur, ville, adresse, contact et e-mail ou téléphone de contact sont renseignés.",
        schema: entreprise_response_dto_1.EntrepriseProfilResponseSchemaDto,
        invalid: "Données invalides ou corps vide",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_entreprise_dto_1.UpdateProfilEntrepriseDto]),
    __metadata("design:returntype", Promise)
], ProfilEntrepriseController.prototype, "update", null);
exports.ProfilEntrepriseController = ProfilEntrepriseController = __decorate([
    (0, swagger_1.ApiTags)("Entreprise — Profil"),
    (0, api_audience_decorator_1.ApiAudience)("employeur"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES),
    (0, common_1.Controller)("entreprise/profil"),
    __metadata("design:paramtypes", [profil_entreprise_service_1.ProfilEntrepriseService])
], ProfilEntrepriseController);
//# sourceMappingURL=profil-entreprise.controller.js.map