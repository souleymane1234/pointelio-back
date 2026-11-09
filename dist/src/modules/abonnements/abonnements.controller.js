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
exports.AbonnementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const abonnement_inactif_decorator_1 = require("../../common/decorators/abonnement-inactif.decorator");
const api_endpoint_decorator_1 = require("../../common/decorators/api-endpoint.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const request_context_1 = require("../../common/types/request-context");
const response_util_1 = require("../../common/utils/response.util");
const abonnements_service_1 = require("./abonnements.service");
const abonnement_response_dto_1 = require("./dto/abonnement-response.dto");
const update_abonnement_dto_1 = require("./dto/update-abonnement.dto");
let AbonnementsController = class AbonnementsController {
    abonnements;
    constructor(abonnements) {
        this.abonnements = abonnements;
    }
    async mine(req) {
        const locale = this.locale(req);
        const data = await this.abonnements.get((0, request_context_1.requireTenant)(req).entrepriseId, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "abonnementFetched"), data, locale);
    }
    async get(req, id) {
        const locale = this.locale(req);
        const data = await this.abonnements.get(id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "abonnementFetched"), data, locale);
    }
    async update(req, id, dto) {
        const locale = this.locale(req);
        const data = await this.abonnements.modifier((0, request_context_1.requireUserId)(req), id, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "abonnementUpdated"), data, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.AbonnementsController = AbonnementsController;
__decorate([
    (0, common_1.Get)("abonnement"),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES),
    (0, abonnement_inactif_decorator_1.AutoriseAbonnementInactif)(),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Abonnement de mon entreprise",
        audience: "employeur",
        description: "Statut, offre effective, usage et prix. Accessible même si l'abonnement est bloqué.",
        schema: abonnement_response_dto_1.AbonnementResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AbonnementsController.prototype, "mine", null);
__decorate([
    (0, common_1.Get)("admin/entreprises/:id/abonnement"),
    (0, roles_decorator_1.Roles)(...role_groups_1.PLATFORM_ROLES),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Abonnement d'une entreprise",
        audience: "plateforme",
        schema: abonnement_response_dto_1.AbonnementResponseSchemaDto,
        notFound: "Entreprise introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AbonnementsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)("admin/entreprises/:id/abonnement"),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Modifier l'abonnement d'une entreprise",
        audience: "plateforme",
        description: "Changement de pack, d'échéance, de statut de facturation ou des surcharges (offre sur mesure). Refusé si les nouvelles limites ne couvrent pas l'usage actuel.",
        schema: abonnement_response_dto_1.AbonnementResponseSchemaDto,
        notFound: "Entreprise ou pack introuvable",
        invalid: "Pack inactif, corps vide ou limites insuffisantes",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_abonnement_dto_1.UpdateAbonnementDto]),
    __metadata("design:returntype", Promise)
], AbonnementsController.prototype, "update", null);
exports.AbonnementsController = AbonnementsController = __decorate([
    (0, swagger_1.ApiTags)("Abonnements"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [abonnements_service_1.AbonnementsService])
], AbonnementsController);
//# sourceMappingURL=abonnements.controller.js.map