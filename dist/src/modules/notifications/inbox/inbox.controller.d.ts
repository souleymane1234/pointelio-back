import { NotificationsQueryDto } from "./dto/notifications-query.dto";
import { NotificationsService } from "../notifications.service";
import { type AuthedRequest } from "../../../common/types/request-context";
export declare class NotificationsInboxController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: AuthedRequest, query: NotificationsQueryDto): Promise<import("../../../common/interfaces/response.interface").PaginatedResponse<{
        id: number;
        createdAt: Date;
        type: string;
        utilisateurId: number;
        titre: string;
        message: string;
        luAt: Date | null;
    }>>;
    markAllAsRead(req: AuthedRequest): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
        updatedCount: number;
    }>>;
    findOne(req: AuthedRequest, id: number): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
        id: number;
        createdAt: Date;
        type: string;
        utilisateurId: number;
        titre: string;
        message: string;
        luAt: Date | null;
    }>>;
    markAsRead(req: AuthedRequest, id: number): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
        id: number;
        createdAt: Date;
        type: string;
        utilisateurId: number;
        titre: string;
        message: string;
        luAt: Date | null;
    }>>;
}
