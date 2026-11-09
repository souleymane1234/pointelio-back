import { type Locale } from "../../../../common/i18n";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import type { NotificationsQueryDto } from "../dto/notifications-query.dto";
import { NotificationCacheService } from "../../shared/services/notification-cache.service";
export declare const NOTIFICATION_SELECT: {
    id: true;
    utilisateurId: true;
    titre: true;
    message: true;
    type: true;
    luAt: true;
    createdAt: true;
};
export type NewNotification = {
    titre: string;
    message: string;
    type: string;
};
export declare class NotificationsInternalService {
    private readonly prisma;
    private readonly notificationsCache;
    constructor(prisma: PrismaService, notificationsCache: NotificationCacheService);
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
    createForUsers(userIds: number[], notification: NewNotification): Promise<number>;
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
    private computeFindAll;
    private computeFindOne;
}
