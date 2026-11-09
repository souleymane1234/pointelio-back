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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const admin_sent_notifications_query_dto_1 = require("./campaigns/dto/admin-sent-notifications-query.dto");
const admin_sent_notifications_service_1 = require("./campaigns/services/admin-sent-notifications.service");
const notifications_delivery_service_1 = require("./delivery/services/notifications-delivery.service");
const notifications_internal_service_1 = require("./inbox/services/notifications-internal.service");
const notification_types_constants_1 = require("./shared/notification-types.constants");
let NotificationsService = class NotificationsService {
    prisma;
    internal;
    delivery;
    auditActions;
    adminSentNotifications;
    constructor(prisma, internal, delivery, auditActions, adminSentNotifications) {
        this.prisma = prisma;
        this.internal = internal;
        this.delivery = delivery;
        this.auditActions = auditActions;
        this.adminSentNotifications = adminSentNotifications;
    }
    findAll(userId, query) {
        return this.internal.findAll(userId, query);
    }
    findOne(id, userId, locale) {
        return this.internal.findOne(id, userId, locale);
    }
    markAsRead(id, userId, locale) {
        return this.internal.markAsRead(id, userId, locale);
    }
    markAllAsRead(userId) {
        return this.internal.markAllAsRead(userId);
    }
    async notifyUsers(userIds, notification) {
        const uniqueIds = [...new Set(userIds)];
        const count = await this.internal.createForUsers(uniqueIds, notification);
        this.delivery.dispatch(uniqueIds, notification);
        return count;
    }
    async sendAdminNotificationToUser(actor, userId, titre, message, locale) {
        const target = await this.prisma.utilisateur.findFirst({
            where: {
                id: userId,
                statut: client_1.StatutCompte.ACTIF,
                ...this.tenantFilter(actor),
            },
            select: { id: true, entrepriseId: true },
        });
        if (!target) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "userNotFound"));
        }
        await this.notifyUsers([target.id], {
            titre,
            message,
            type: notification_types_constants_1.NOTIFICATION_TYPES.ADMIN_BROADCAST,
        });
        await this.recordSent(actor, target.entrepriseId, {
            target: admin_sent_notifications_query_dto_1.AdminNotificationSendTarget.USER,
            targetUserId: target.id,
            titre,
            message,
            recipientCount: 1,
        });
        return { recipientCount: 1 };
    }
    async sendAdminNotificationToRole(actor, role, titre, message, entrepriseId) {
        const scope = (0, role_groups_1.isPlatformRole)(actor.role)
            ? entrepriseId
                ? { entrepriseId }
                : {}
            : this.tenantFilter(actor);
        const users = await this.prisma.utilisateur.findMany({
            where: { role, statut: client_1.StatutCompte.ACTIF, ...scope },
            select: { id: true },
        });
        const userIds = users.map((u) => u.id);
        if (userIds.length > 0) {
            await this.notifyUsers(userIds, {
                titre,
                message,
                type: notification_types_constants_1.NOTIFICATION_TYPES.ADMIN_BROADCAST,
            });
        }
        await this.recordSent(actor, scope.entrepriseId ?? null, {
            target: admin_sent_notifications_query_dto_1.AdminNotificationSendTarget.ROLE,
            role,
            titre,
            message,
            recipientCount: userIds.length,
        });
        return { recipientCount: userIds.length };
    }
    listAdminSentNotifications(actor, query) {
        return this.adminSentNotifications.findAll(actor, query);
    }
    getAdminSentNotification(actor, id, locale) {
        return this.adminSentNotifications.findOne(actor, id, locale);
    }
    tenantFilter(actor) {
        return (0, role_groups_1.isPlatformRole)(actor.role)
            ? {}
            : { entrepriseId: actor.entrepriseId ?? -1 };
    }
    recordSent(actor, entrepriseId, details) {
        return this.auditActions.adminNotificationSent(actor.id, entrepriseId, details);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_internal_service_1.NotificationsInternalService,
        notifications_delivery_service_1.NotificationsDeliveryService,
        audit_actions_service_1.AuditActionsService,
        admin_sent_notifications_service_1.AdminSentNotificationsService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map