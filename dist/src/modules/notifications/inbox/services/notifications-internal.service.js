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
exports.NotificationsInternalService = exports.NOTIFICATION_SELECT = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../../../../common/i18n");
const prisma_service_1 = require("../../../../infra/prisma/prisma.service");
const notifications_cache_config_1 = require("../../shared/config/notifications-cache.config");
const notification_cache_service_1 = require("../../shared/services/notification-cache.service");
exports.NOTIFICATION_SELECT = {
    id: true,
    utilisateurId: true,
    titre: true,
    message: true,
    type: true,
    luAt: true,
    createdAt: true,
};
let NotificationsInternalService = class NotificationsInternalService {
    prisma;
    notificationsCache;
    constructor(prisma, notificationsCache) {
        this.prisma = prisma;
        this.notificationsCache = notificationsCache;
    }
    async findAll(userId, query) {
        const key = (0, notifications_cache_config_1.buildNotificationsCacheKey)("notifications-list", {
            userId,
            page: query.page,
            per_page: query.per_page,
            lu: query.lu,
            type: query.type,
        });
        return this.notificationsCache.wrap(key, () => this.computeFindAll(userId, query));
    }
    async findOne(id, userId, locale) {
        const key = (0, notifications_cache_config_1.buildNotificationsCacheKey)("notification-detail", {
            id,
            userId,
        });
        return this.notificationsCache.wrap(key, () => this.computeFindOne(id, userId, locale));
    }
    async createForUsers(userIds, notification) {
        if (userIds.length === 0)
            return 0;
        const { count } = await this.prisma.notification.createMany({
            data: userIds.map((utilisateurId) => ({
                utilisateurId,
                ...notification,
            })),
        });
        (0, notifications_cache_config_1.bumpNotificationsCacheGeneration)();
        return count;
    }
    async markAsRead(id, userId, locale) {
        const existing = await this.prisma.notification.findFirst({
            where: { id, utilisateurId: userId },
            select: { id: true, luAt: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "notificationNotFound"));
        }
        const notification = await this.prisma.notification.update({
            where: { id },
            data: { luAt: existing.luAt ?? new Date() },
            select: exports.NOTIFICATION_SELECT,
        });
        (0, notifications_cache_config_1.bumpNotificationsCacheGeneration)();
        return notification;
    }
    async markAllAsRead(userId) {
        const result = await this.prisma.notification.updateMany({
            where: { utilisateurId: userId, luAt: null },
            data: { luAt: new Date() },
        });
        (0, notifications_cache_config_1.bumpNotificationsCacheGeneration)();
        return { updatedCount: result.count };
    }
    async computeFindAll(userId, query) {
        const page = query.page ?? 1;
        const perPage = query.per_page ?? 10;
        const where = { utilisateurId: userId };
        if (query.lu !== undefined)
            where.luAt = query.lu ? { not: null } : null;
        if (query.type)
            where.type = query.type;
        const totalItems = await this.prisma.notification.count({ where });
        const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / perPage);
        const safePage = Math.min(Math.max(1, page), totalPages);
        const offset = (safePage - 1) * perPage;
        const [count, data] = await Promise.all([
            this.prisma.notification.count({
                where: { utilisateurId: userId, luAt: null },
            }),
            this.prisma.notification.findMany({
                where,
                select: exports.NOTIFICATION_SELECT,
                orderBy: { createdAt: "desc" },
                skip: offset,
                take: perPage,
            }),
        ]);
        return {
            data,
            count,
            pagination: {
                current_page: safePage,
                total_pages: totalPages,
                per_page: perPage,
                total_items: totalItems,
            },
        };
    }
    async computeFindOne(id, userId, locale) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, utilisateurId: userId },
            select: exports.NOTIFICATION_SELECT,
        });
        if (!notification) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "notificationNotFound"));
        }
        return notification;
    }
};
exports.NotificationsInternalService = NotificationsInternalService;
exports.NotificationsInternalService = NotificationsInternalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_cache_service_1.NotificationCacheService])
], NotificationsInternalService);
//# sourceMappingURL=notifications-internal.service.js.map