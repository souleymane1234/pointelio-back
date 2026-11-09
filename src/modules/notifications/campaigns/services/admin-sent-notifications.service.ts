import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Role } from "@prisma/client";
import { AUDIT_ACTIONS } from "../../../audit/shared/audit-actions.constants";
import type { AuthUser } from "../../../../common/types/request-context";
import { translate, type Locale } from "../../../../common/i18n";
import { isPlatformRole } from "../../../../common/rbac/role-groups";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import {
  AdminNotificationSendTarget,
  type AdminSentNotificationsQueryDto,
} from "../dto/admin-sent-notifications-query.dto";

/** Contenu de `AuditLog.details` pour l'action NOTIFICATION_ENVOYEE. */
export type NotificationSentDetails = {
  target: AdminNotificationSendTarget;
  titre: string;
  message: string;
  recipientCount: number;
  targetUserId?: number;
  role?: Role;
};

const SENT_LOG_SELECT = {
  id: true,
  entrepriseId: true,
  details: true,
  createdAt: true,
  acteur: { select: { id: true, nom: true, prenom: true, email: true } },
} satisfies Prisma.AuditLogSelect;

type SentLogRow = Prisma.AuditLogGetPayload<{
  select: typeof SENT_LOG_SELECT;
}>;

/** Historique des envois : lu depuis l'audit (aucune table de campagne dédiée). */
@Injectable()
export class AdminSentNotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(actor: AuthUser, query: AdminSentNotificationsQueryDto) {
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

  async findOne(actor: AuthUser, id: string, locale: Locale) {
    const logId = /^\d+$/.test(id) ? BigInt(id) : null;
    const log = logId
      ? await this.prisma.auditLog.findFirst({
          where: { ...this.buildWhere(actor, {}), id: logId },
          select: SENT_LOG_SELECT,
        })
      : null;
    if (!log) {
      throw new NotFoundException(
        translate(locale, "adminSentNotificationNotFound"),
      );
    }
    return this.mapLog(log);
  }

  private buildWhere(
    actor: AuthUser,
    query: AdminSentNotificationsQueryDto,
  ): Prisma.AuditLogWhereInput {
    const filters: Prisma.AuditLogWhereInput[] = [
      { action: AUDIT_ACTIONS.NOTIFICATION_ENVOYEE },
    ];

    if (!isPlatformRole(actor.role)) {
      filters.push({ entrepriseId: actor.entrepriseId ?? -1 });
    } else if (query.entrepriseId) {
      filters.push({ entrepriseId: query.entrepriseId });
    }

    if (query.acteurId) filters.push({ acteurId: query.acteurId });
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

  private mapLog(log: SentLogRow) {
    const details = (log.details ?? {}) as Partial<NotificationSentDetails>;
    return {
      id: log.id.toString(),
      titre: details.titre ?? "",
      message: details.message ?? "",
      target: details.target ?? AdminNotificationSendTarget.USER,
      targetUserId: details.targetUserId ?? null,
      targetRole: details.role ?? null,
      entrepriseId: log.entrepriseId,
      recipientCount: details.recipientCount ?? 0,
      sentAt: log.createdAt,
      sentBy: log.acteur,
    };
  }
}
