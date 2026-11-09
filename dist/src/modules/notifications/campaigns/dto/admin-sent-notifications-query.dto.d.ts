import { Role } from "@prisma/client";
export declare enum AdminNotificationSendTarget {
    USER = "user",
    ROLE = "role"
}
export declare class AdminSentNotificationsQueryDto {
    page?: number;
    per_page?: number;
    search?: string;
    target?: AdminNotificationSendTarget;
    acteurId?: number;
    role?: Role;
    entrepriseId?: number;
    dateFrom?: string;
    dateTo?: string;
}
