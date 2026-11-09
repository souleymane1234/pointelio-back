import { Role } from "@prisma/client";
import { AdminSendNotificationDto } from "./dto/admin-send-notification.dto";
import { AdminSentNotificationsQueryDto } from "./dto/admin-sent-notifications-query.dto";
import { NotificationsService } from "../notifications.service";
import { type AuthedRequest } from "../../../common/types/request-context";
export declare class NotificationCampaignsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    listSent(req: AuthedRequest, query: AdminSentNotificationsQueryDto): Promise<import("../../../common/interfaces/response.interface").PaginatedResponse<{
        id: string;
        titre: string;
        message: string;
        target: import("./dto/admin-sent-notifications-query.dto").AdminNotificationSendTarget;
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
    }>>;
    getSent(req: AuthedRequest, campaignId: string): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
        id: string;
        titre: string;
        message: string;
        target: import("./dto/admin-sent-notifications-query.dto").AdminNotificationSendTarget;
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
    }>>;
    sendToUser(req: AuthedRequest, userId: number, dto: AdminSendNotificationDto): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
        recipientCount: number;
    }>>;
    sendToRole(req: AuthedRequest, role: Role, dto: AdminSendNotificationDto): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
        recipientCount: number;
    }>>;
}
