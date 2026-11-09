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
exports.DashboardClientController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const api_endpoint_decorator_1 = require("../../common/decorators/api-endpoint.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const request_context_1 = require("../../common/types/request-context");
const response_util_1 = require("../../common/utils/response.util");
const dashboard_service_1 = require("./dashboard.service");
const presence_query_dto_1 = require("./dto/presence-query.dto");
const presence_response_dto_1 = require("./dto/presence-response.dto");
let DashboardClientController = class DashboardClientController {
    dashboard;
    constructor(dashboard) {
        this.dashboard = dashboard;
    }
    async presence(req, query) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.dashboard.presence((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, query);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "presenceFetched"), data, locale);
    }
    async presencePeriode(req, query) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.dashboard.presencePeriode((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, query, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "presencePeriodeFetched"), data, locale);
    }
};
exports.DashboardClientController = DashboardClientController;
__decorate([
    (0, common_1.Get)("presence"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Présence et paie du jour",
        audience: ["mobile", "employeur"],
        description: "Retards selon les jours, heures et tolérance (facultative) définis par l'employeur sur le site. Une journée est payée seulement si l'employé a badgé à l'arrivée et à la descente. Surveillant : limité à son site.",
        schema: presence_response_dto_1.PresenceResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, presence_query_dto_1.PresenceQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardClientController.prototype, "presence", null);
__decorate([
    (0, common_1.Get)("presence/periode"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Présence et paie sur une période",
        audience: ["mobile", "employeur"],
        description: "Cumul par employé entre `du` et `au` (inclus, 62 jours max) : jours ouvrés, présences, absences (dont justifiées par un congé approuvé), retards, oublis de départ, jours payés et montant. Les jours à venir sont ignorés. Surveillant : limité à son site.",
        invalid: "Dates invalides ou période trop longue",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, presence_query_dto_1.PresencePeriodeQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardClientController.prototype, "presencePeriode", null);
exports.DashboardClientController = DashboardClientController = __decorate([
    (0, swagger_1.ApiTags)("Dashboard"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER, client_1.Role.SURVEILLANT),
    (0, common_1.Controller)("dashboard"),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardClientController);
//# sourceMappingURL=dashboard-client.controller.js.map