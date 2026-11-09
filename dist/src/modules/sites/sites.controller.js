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
exports.SitesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const api_audience_decorator_1 = require("../../common/decorators/api-audience.decorator");
const api_endpoint_decorator_1 = require("../../common/decorators/api-endpoint.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const request_context_1 = require("../../common/types/request-context");
const response_util_1 = require("../../common/utils/response.util");
const site_dto_1 = require("./dto/site.dto");
const site_response_dto_1 = require("./dto/site-response.dto");
const sites_service_1 = require("./sites.service");
let SitesController = class SitesController {
    sites;
    constructor(sites) {
        this.sites = sites;
    }
    async findAll(req, query) {
        const locale = this.locale(req);
        const { data, pagination } = await this.sites.findAll((0, request_context_1.requireTenant)(req).entrepriseId, query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "sitesFetched"), locale);
    }
    async findOne(req, id) {
        const locale = this.locale(req);
        const data = await this.sites.findOne((0, request_context_1.requireTenant)(req).entrepriseId, id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "siteFetched"), data, locale);
    }
    async create(req, dto) {
        const locale = this.locale(req);
        const data = await this.sites.create((0, request_context_1.requireUserId)(req), (0, request_context_1.requireTenant)(req).entrepriseId, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "siteCreated"), data, locale);
    }
    async update(req, id, dto) {
        const locale = this.locale(req);
        const data = await this.sites.update((0, request_context_1.requireUserId)(req), (0, request_context_1.requireTenant)(req).entrepriseId, id, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "siteUpdated"), data, locale);
    }
    async deactivate(req, id) {
        const locale = this.locale(req);
        const data = await this.sites.deactivate((0, request_context_1.requireUserId)(req), (0, request_context_1.requireTenant)(req).entrepriseId, id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "siteDeactivated"), data, locale);
    }
    async regenerateQr(req, id) {
        const locale = this.locale(req);
        const data = await this.sites.regenerateQr((0, request_context_1.requireUserId)(req), (0, request_context_1.requireTenant)(req).entrepriseId, id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "siteQrRegenerated"), data, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.SitesController = SitesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Lister les sites de mon entreprise",
        status: 206,
        schema: site_response_dto_1.SitesPaginatedResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, site_dto_1.SitesQueryDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Détail d'un site",
        schema: site_response_dto_1.SiteResponseSchemaDto,
        notFound: "Site introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Créer un site",
        description: "Génère le QR statique du site. L'employeur choisit les jours travaillés (`horairesJours`) avec heure d'arrivée et de descente. Le rayon GPS est obligatoire ; la tolérance de retard (`toleranceMin`) est facultative. Refusé si la limite de sites de l'offre est atteinte.",
        status: 201,
        schema: site_response_dto_1.SiteResponseSchemaDto,
        invalid: "Données invalides, horaires manquants ou limite de sites atteinte",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, site_dto_1.CreateSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Modifier un site",
        schema: site_response_dto_1.SiteResponseSchemaDto,
        notFound: "Site introuvable",
        invalid: "Données invalides, corps vide ou limite de sites atteinte",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, site_dto_1.UpdateSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Désactiver un site",
        description: "L'historique des pointages est conservé.",
        schema: site_response_dto_1.SiteResponseSchemaDto,
        notFound: "Site introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(":id/qr/regenerer"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Régénérer le QR d'un site",
        description: "L'ancien QR cesse immédiatement d'être valable.",
        schema: site_response_dto_1.SiteResponseSchemaDto,
        notFound: "Site introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "regenerateQr", null);
exports.SitesController = SitesController = __decorate([
    (0, swagger_1.ApiTags)("Sites"),
    (0, api_audience_decorator_1.ApiAudience)("employeur"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES),
    (0, common_1.Controller)("sites"),
    __metadata("design:paramtypes", [sites_service_1.SitesService])
], SitesController);
//# sourceMappingURL=sites.controller.js.map