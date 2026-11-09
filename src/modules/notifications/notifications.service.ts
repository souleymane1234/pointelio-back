import { Injectable, NotFoundException } from "@nestjs/common";
import { StatutCompte, type Role } from "@prisma/client";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import type { AuthUser } from "../../common/types/request-context";
import { translate, type Locale } from "../../common/i18n";
import { isPlatformRole } from "../../common/rbac/role-groups";
import { PrismaService } from "../../infra/prisma/prisma.service";
import {
  AdminNotificationSendTarget,
  type AdminSentNotificationsQueryDto,
} from "./campaigns/dto/admin-sent-notifications-query.dto";
import type { NotificationsQueryDto } from "./inbox/dto/notifications-query.dto";
import {
  AdminSentNotificationsService,
  type NotificationSentDetails,
} from "./campaigns/services/admin-sent-notifications.service";
import { NotificationsDeliveryService } from "./delivery/services/notifications-delivery.service";
import {
  NotificationsInternalService,
  type NewNotification,
} from "./inbox/services/notifications-internal.service";
import { NOTIFICATION_TYPES } from "./shared/notification-types.constants";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly internal: NotificationsInternalService,
    private readonly delivery: NotificationsDeliveryService,
    private readonly auditActions: AuditActionsService,
    private readonly adminSentNotifications: AdminSentNotificationsService,
  ) {}

  findAll(userId: number, query: NotificationsQueryDto) {
    return this.internal.findAll(userId, query);
  }

  findOne(id: number, userId: number, locale: Locale) {
    return this.internal.findOne(id, userId, locale);
  }

  markAsRead(id: number, userId: number, locale: Locale) {
    return this.internal.markAsRead(id, userId, locale);
  }

  markAllAsRead(userId: number) {
    return this.internal.markAllAsRead(userId);
  }

  /** Point d'entrée des modules métier : enregistre puis diffuse en temps réel. */
  async notifyUsers(userIds: number[], notification: NewNotification) {
    const uniqueIds = [...new Set(userIds)];
    const count = await this.internal.createForUsers(uniqueIds, notification);
    this.delivery.dispatch(uniqueIds, notification);
    return count;
  }

  async sendAdminNotificationToUser(
    actor: AuthUser,
    userId: number,
    titre: string,
    message: string,
    locale: Locale,
  ) {
    const target = await this.prisma.utilisateur.findFirst({
      where: {
        id: userId,
        statut: StatutCompte.ACTIF,
        ...this.tenantFilter(actor),
      },
      select: { id: true, entrepriseId: true },
    });
    if (!target) {
      throw new NotFoundException(translate(locale, "userNotFound"));
    }

    await this.notifyUsers([target.id], {
      titre,
      message,
      type: NOTIFICATION_TYPES.ADMIN_BROADCAST,
    });
    await this.recordSent(actor, target.entrepriseId, {
      target: AdminNotificationSendTarget.USER,
      targetUserId: target.id,
      titre,
      message,
      recipientCount: 1,
    });
    return { recipientCount: 1 };
  }

  async sendAdminNotificationToRole(
    actor: AuthUser,
    role: Role,
    titre: string,
    message: string,
    entrepriseId: number | undefined,
  ) {
    const scope = isPlatformRole(actor.role)
      ? entrepriseId
        ? { entrepriseId }
        : {}
      : this.tenantFilter(actor);
    const users = await this.prisma.utilisateur.findMany({
      where: { role, statut: StatutCompte.ACTIF, ...scope },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);

    if (userIds.length > 0) {
      await this.notifyUsers(userIds, {
        titre,
        message,
        type: NOTIFICATION_TYPES.ADMIN_BROADCAST,
      });
    }
    await this.recordSent(actor, scope.entrepriseId ?? null, {
      target: AdminNotificationSendTarget.ROLE,
      role,
      titre,
      message,
      recipientCount: userIds.length,
    });
    return { recipientCount: userIds.length };
  }

  listAdminSentNotifications(
    actor: AuthUser,
    query: AdminSentNotificationsQueryDto,
  ) {
    return this.adminSentNotifications.findAll(actor, query);
  }

  getAdminSentNotification(actor: AuthUser, id: string, locale: Locale) {
    return this.adminSentNotifications.findOne(actor, id, locale);
  }

  private tenantFilter(actor: AuthUser): { entrepriseId?: number } {
    return isPlatformRole(actor.role)
      ? {}
      : { entrepriseId: actor.entrepriseId ?? -1 };
  }

  private recordSent(
    actor: AuthUser,
    entrepriseId: number | null,
    details: NotificationSentDetails,
  ) {
    return this.auditActions.adminNotificationSent(
      actor.id,
      entrepriseId,
      details,
    );
  }
}
