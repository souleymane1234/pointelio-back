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
exports.AdminSentNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const audit_actions_constants_1 = require("../../../audit/shared/audit-actions.constants");
const i18n_1 = require("../../../../common/i18n");
const role_groups_1 = require("../../../../common/rbac/role-groups");
const prisma_service_1 = require("../../../../infra/prisma/prisma.service");
const admin_sent_notifications_query_dto_1 = require("../dto/admin-sent-notifications-query.dto");
const SENT_LOG_SELECT = {
    id: true,
    entrepriseId: true,
    details: true,
    createdAt: true,
    acteur: { select: { id: true, nom: true, prenom: true, email: true } },
};
let AdminSentNotificationsService = class AdminSentNotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(actor, query) {
        const page = query.page ?? 1;
        const perPage = query.per_page ?? 10;
        const where = this.buildWhere(actor, query);
        const totalItems = await this.prisma.auditLog.count({ where });
        const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / perPage);
        const safePage = Math.min(Math.max(1, page), totalPages);
        const logs = await this.prisma.auditLog.findMany({
            where,
            select: SENT_LOG_SELECT,
            orderBy: { createdAt: "desc" },
            skip: (safePage - 1) * perPage,
            take: perPage,
        });
        return {
            data: logs.map((log) => this.mapLog(log)),
            pagination: {
                current_page: safePage,
                total_pages: totalPages,
                per_page: perPage,
                total_items: totalItems,
            },
        };
    }
    async findOne(actor, id, locale) {
        const logId = /^\d+$/.test(id) ? BigInt(id) : null;
        const log = logId
            ? await this.prisma.auditLog.findFirst({
                where: { ...this.buildWhere(actor, {}), id: logId },
                select: SENT_LOG_SELECT,
            })
            : null;
        if (!log) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "adminSentNotificationNotFound"));
        }
        return this.mapLog(log);
    }
    buildWhere(actor, query) {
        const filters = [
            { action: audit_actions_constants_1.AUDIT_ACTIONS.NOTIFICATION_ENVOYEE },
        ];
        if (!(0, role_groups_1.isPlatformRole)(actor.role)) {
            filters.push({ entrepriseId: actor.entrepriseId ?? -1 });
        }
        else if (query.entrepriseId) {
            filters.push({ entrepriseId: query.entrepriseId });
        }
        if (query.acteurId)
            filters.push({ acteurId: query.acteurId });
        if (query.target) {
            filters.push({ details: { path: "$.target", equals: query.target } });
        }
        if (query.role) {
            filters.push({ details: { path: "$.role", equals: query.role } });
        }
        if (query.search) {
            filters.push({
                details: { path: "$.titre", string_contains: query.search },
            });
        }
        if (query.dateFrom || query.dateTo) {
            filters.push({
                createdAt: {
                    ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
                    ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
                },
            });
        }
        return { AND: filters };
    }
    mapLog(log) {
        const details = (log.details ?? {});
        return {
            id: log.id.toString(),
            titre: details.titre ?? "",
            message: details.message ?? "",
            target: details.target ?? admin_sent_notifications_query_dto_1.AdminNotificationSendTarget.USER,
            targetUserId: details.targetUserId ?? null,
            targetRole: details.role ?? null,
            entrepriseId: log.entrepriseId,
            recipientCount: details.recipientCount ?? 0,
            sentAt: log.createdAt,
            sentBy: log.acteur,
        };
    }
};
exports.AdminSentNotificationsService = AdminSentNotificationsService;
exports.AdminSentNotificationsService = AdminSentNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSentNotificationsService);
//# sourceMappingURL=admin-sent-notifications.service.js.map