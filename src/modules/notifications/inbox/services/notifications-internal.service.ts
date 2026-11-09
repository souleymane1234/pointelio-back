import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { translate, type Locale } from "../../../../common/i18n";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import {
  buildNotificationsCacheKey,
  bumpNotificationsCacheGeneration,
} from "../../shared/config/notifications-cache.config";
import type { NotificationsQueryDto } from "../dto/notifications-query.dto";
import { NotificationCacheService } from "../../shared/services/notification-cache.service";

export const NOTIFICATION_SELECT = {
  id: true,
  utilisateurId: true,
  titre: true,
  message: true,
  type: true,
  luAt: true,
  createdAt: true,
} satisfies Prisma.NotificationSelect;

export type NewNotification = {
  titre: string;
  message: string;
  type: string;
};

@Injectable()
export class NotificationsInternalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsCache: NotificationCacheService,
  ) {}

  async findAll(userId: number, query: NotificationsQueryDto) {
    const key = buildNotificationsCacheKey("notifications-list", {
      userId,
      page: query.page,
      per_page: query.per_page,
      lu: query.lu,
      type: query.type,
    });
    return this.notificationsCache.wrap(key, () =>
      this.computeFindAll(userId, query),
    );
  }

  async findOne(id: number, userId: number, locale: Locale) {
    const key = buildNotificationsCacheKey("notification-detail", {
      id,
      userId,
    });
    return this.notificationsCache.wrap(key, () =>
      this.computeFindOne(id, userId, locale),
    );
  }

  /** Crée une notification par destinataire (même contenu). */
  async createForUsers(userIds: number[], notification: NewNotification) {
    if (userIds.length === 0) return 0;
    const { count } = await this.prisma.notification.createMany({
      data: userIds.map((utilisateurId) => ({
        utilisateurId,
        ...notification,
      })),
    });
    bumpNotificationsCacheGeneration();
    return count;
  }

  async markAsRead(id: number, userId: number, locale: Locale) {
    const existing = await this.prisma.notification.findFirst({
      where: { id, utilisateurId: userId },
      select: { id: true, luAt: true },
    });
    if (!existing) {
      throw new NotFoundException(translate(locale, "notificationNotFound"));
    }

    const notification = await this.prisma.notification.update({
      where: { id },
      data: { luAt: existing.luAt ?? new Date() },
      select: NOTIFICATION_SELECT,
    });
    bumpNotificationsCacheGeneration();
    return notification;
  }

  async markAllAsRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { utilisateurId: userId, luAt: null },
      data: { luAt: new Date() },
    });
    bumpNotificationsCacheGeneration();
    return { updatedCount: result.count };
  }

  private async computeFindAll(userId: number, query: NotificationsQueryDto) {
    const page = query.page ?? 1;
    const perPage = query.per_page ?? 10;
    const where: Prisma.NotificationWhereInput = { utilisateurId: userId };
    if (query.lu !== undefined) where.luAt = query.lu ? { not: null } : null;
    if (query.type) where.type = query.type;

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
        select: NOTIFICATION_SELECT,
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

  private async computeFindOne(id: number, userId: number, locale: Locale) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, utilisateurId: userId },
      select: NOTIFICATION_SELECT,
    });
    if (!notification) {
      throw new NotFoundException(translate(locale, "notificationNotFound"));
    }
    return notification;
  }
}
