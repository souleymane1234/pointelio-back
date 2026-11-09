import { ConfigService } from "@nestjs/config";
import { Server, Socket } from "socket.io";
export interface NotificationRealtimePayload {
    id?: number;
    type: string;
    titre: string;
    message: string;
    createdAt?: string;
}
export declare class SocketNotificationsService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    joinUserRoom(client: Socket, userId: number): string;
    emitNotificationToUsers(server: Server, userIds: number[], payload: NotificationRealtimePayload): void;
}
