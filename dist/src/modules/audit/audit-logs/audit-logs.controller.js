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
exports.AuditLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_audience_decorator_1 = require("../../../common/decorators/api-audience.decorator");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../../common/i18n");
const role_groups_1 = require("../../../common/rbac/role-groups");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const response_util_1 = require("../../../common/utils/response.util");
const request_context_1 = require("../../../common/types/request-context");
const audit_actions_service_1 = require("../recorder/services/audit-actions.service");
const audit_service_1 = require("../audit.service");
const api_audit_logs_decorator_1 = require("./decorators/api-audit-logs.decorator");
const audit_logs_query_dto_1 = require("./dto/audit-logs-query.dto");
let AuditLogsController = class AuditLogsController {
    auditTrailsService;
    auditActions;
    constructor(auditTrailsService, auditActions) {
        this.auditTrailsService = auditTrailsService;
        this.auditActions = auditActions;
    }
    async listAuditLogs(req, query) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const { data, pagination } = await this.auditTrailsService.listAuditLogs((0, request_context_1.requireUser)(req), query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "auditLogsFetched"), locale);
    }
    async exportAuditLogs(req, query, res) {
        const actor = (0, request_context_1.requireUser)(req);
        const csv = await this.auditTrailsService.exportAuditLogsCsv(actor, query);
        void this.auditActions.auditExported(actor.id, { ...query });
        const stamp = new Date().toISOString().slice(0, 10);
        const filename = `audit-trail-${stamp}.csv`;
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.status(common_1.HttpStatus.OK).send(csv);
    }
};
exports.AuditLogsController = AuditLogsController;
__decorate([
    (0, common_1.Get)(),
    (0, api_audit_logs_decorator_1.ApiListAuditLogs)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audit_logs_query_dto_1.AuditLogsQueryDto]),
    __metadata("design:returntype", Promise)
], AuditLogsController.prototype, "listAuditLogs", null);
__decorate([
    (0, common_1.Get)("export"),
    (0, swagger_1.ApiProduces)("text/csv"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audit_logs_query_dto_1.AuditLogsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AuditLogsController.prototype, "exportAuditLogs", null);
exports.AuditLogsController = AuditLogsController = __decorate([
    (0, swagger_1.ApiTags)("Admin - Audit Trails"),
    (0, api_audience_decorator_1.ApiAudience)("employeur", "plateforme"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.PLATFORM_ROLES, client_1.Role.ADMIN_CLIENT),
    (0, common_1.Controller)("admin/audit-trails/audit-logs"),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        audit_actions_service_1.AuditActionsService])
], AuditLogsController);
//# sourceMappingURL=audit-logs.controller.js.map