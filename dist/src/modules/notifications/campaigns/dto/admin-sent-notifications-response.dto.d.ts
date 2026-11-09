import { Role } from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../../common/dto/pagination-response.dto";
import { AdminNotificationSendTarget } from "./admin-sent-notifications-query.dto";
declare class AdminSentByUserSchemaDto {
    id: number;
    nom: string;
    prenom: string;
    email: string | null;
}
export declare class AdminSentNotificationItemSchemaDto {
    id: string;
    titre: string;
    message: string;
    target: AdminNotificationSendTarget;
    targetUserId: number | null;
    targetRole: Role | null;
    entrepriseId: number | null;
    recipientCount: number;
    sentAt: Date;
    sentBy: AdminSentByUserSchemaDto | null;
}
export declare class AdminSentNotificationsPaginatedResponseSchemaDto {
    success: boolean;
    message: string;
    data: AdminSentNotificationItemSchemaDto[];
    pagination: PaginationMetaSchemaDto;
}
export declare class AdminSentNotificationDetailResponseSchemaDto {
    success: boolean;
    message: string;
    data: AdminSentNotificationItemSchemaDto;
}
export {};
