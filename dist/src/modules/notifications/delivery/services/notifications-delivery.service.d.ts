import { SocketGateway } from "../../../../infra/socket/socket.gateway";
import type { NewNotification } from "../../inbox/services/notifications-internal.service";
export declare class NotificationsDeliveryService {
    private readonly socketGateway;
    constructor(socketGateway: SocketGateway);
    dispatch(userIds: number[], notification: NewNotification): void;
}
