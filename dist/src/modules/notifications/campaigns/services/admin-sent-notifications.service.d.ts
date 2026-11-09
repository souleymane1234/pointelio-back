import { type Role } from "@prisma/client";
import type { AuthUser } from "../../../../common/types/request-context";
import { type Locale } from "../../../../common/i18n";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import { AdminNotificationSendTarget, type AdminSentNotificationsQueryDto } from "../dto/admin-sent-notifications-query.dto";
export type NotificationSentDetails = {
    target: AdminNotificationSendTarget;
    titre: string;
    message: string;
    recipientCount: number;
    targetUserId?: number;
    role?: Role;
};
export declare class AdminSentNotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(actor: AuthUser, query: AdminSentNotificationsQueryDto): Promise<{
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
    findOne(actor: AuthUser, id: string, locale: Locale): Promise<{
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
    private buildWhere;
    private mapLog;
}
