import { type Role } from "@prisma/client";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import type { AuthUser } from "../../common/types/request-context";
import { type Locale } from "../../common/i18n";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AdminNotificationSendTarget, type AdminSentNotificationsQueryDto } from "./campaigns/dto/admin-sent-notifications-query.dto";
import type { NotificationsQueryDto } from "./inbox/dto/notifications-query.dto";
import { AdminSentNotificationsService } from "./campaigns/services/admin-sent-notifications.service";
import { NotificationsDeliveryService } from "./delivery/services/notifications-delivery.service";
import { NotificationsInternalService, type NewNotification } from "./inbox/services/notifications-internal.service";
export declare class NotificationsService {
    private readonly prisma;
    private readonly internal;
    private readonly delivery;
    private readonly auditActions;
    private readonly adminSentNotifications;
    constructor(prisma: PrismaService, internal: NotificationsInternalService, delivery: NotificationsDeliveryService, auditActions: AuditActionsService, adminSentNotifications: AdminSentNotificationsService);
    findAll(userId: number, query: NotificationsQueryDto): Promise<{
        data: {
            id: number;
            createdAt: Date;
            type: string;
            utilisateurId: number;
            titre: string;
            message: string;
            luAt: Date | null;
        }[];
        count: number;
        pagination: {
            current_page: number;
            total_pages: number;
            per_page: number;
            total_items: number;
        };
    }>;
    findOne(id: number, userId: number, locale: Locale): Promise<{
        id: number;
        createdAt: Date;
        type: string;
        utilisateurId: number;
        titre: string;
        message: string;
        luAt: Date | null;
    }>;
    markAsRead(id: number, userId: number, locale: Locale): Promise<{
        id: number;
        createdAt: Date;
        type: string;
        utilisateurId: number;
        titre: string;
        message: string;
        luAt: Date | null;
    }>;
    markAllAsRead(userId: number): Promise<{
        updatedCount: number;
    }>;
    notifyUsers(userIds: number[], notification: NewNotification): Promise<number>;
    sendAdminNotificationToUser(actor: AuthUser, userId: number, titre: string, message: string, locale: Locale): Promise<{
        recipientCount: number;
    }>;
    sendAdminNotificationToRole(actor: AuthUser, role: Role, titre: string, message: string, entrepriseId: number | undefined): Promise<{
        recipientCount: number;
    }>;
    listAdminSentNotifications(actor: AuthUser, query: AdminSentNotificationsQueryDto): Promise<{
        data: {
            id: string;
            titre: string;
            message: string;
            target: AdminNotificationSendTarget;
            targetUserId: number | null;
            targetRole: import("@prisma/client").$Enums.Role | null;
            entrepriseId: number | null;
            recipientCount: number;
            sentAt: Date;
            sentBy: {
                email: string | null;
                id: number;
                nom: string;
                prenom: string;
            } | null;
        }[];
        pagination: {
            current_page: number;
            total_pages: number;
            per_page: number;
            total_items: number;
        };
    }>;
    getAdminSentNotification(actor: AuthUser, id: string, locale: Locale): Promise<{
        id: string;
        titre: string;
        message: string;
        target: AdminNotificationSendTarget;
        targetUserId: number | null;
        targetRole: import("@prisma/client").$Enums.Role | null;
        entrepriseId: number | null;
        recipientCount: number;
        sentAt: Date;
        sentBy: {
            email: string | null;
            id: number;
            nom: string;
            prenom: string;
        } | null;
    }>;
    private tenantFilter;
    private recordSent;
}
