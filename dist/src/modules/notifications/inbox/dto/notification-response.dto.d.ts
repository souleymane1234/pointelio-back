import { PaginationMetaSchemaDto } from "../../../../common/dto/pagination-response.dto";
export declare class NotificationSchemaDto {
    id: number;
    utilisateurId: number;
    titre: string;
    message: string;
    type: string;
    luAt: Date | null;
    createdAt: Date;
}
export declare class NotificationResponseSchemaDto {
    success: true;
    message: string;
    data: NotificationSchemaDto;
}
export declare class NotificationsPaginatedResponseSchemaDto {
    success: true;
    message: string;
    data: NotificationSchemaDto[];
    count: number;
    pagination: PaginationMetaSchemaDto;
}
export declare class MarkAllNotificationsReadSchemaDto {
    success: true;
    message: string;
    data: {
        updatedCount: number;
    };
}
