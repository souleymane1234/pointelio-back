import { ConfigService } from "@nestjs/config";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketAuthService } from "./services/socket-auth.service";
import { SocketNotificationsService, type NotificationRealtimePayload } from "./services/socket-notifications.service";
export declare class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly config;
    private readonly socketAuth;
    private readonly socketNotifications;
    private readonly logger;
    private readonly namespace;
    private readonly socketPath;
    constructor(config: ConfigService, socketAuth: SocketAuthService, socketNotifications: SocketNotificationsService);
    server: Server;
    afterInit(): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handlePing(client: Socket, payload?: unknown): {
        event: string;
        data: {
            socketId: string;
            payload: {} | null;
            timestamp: string;
        };
    };
    handleNotificationsSubscribe(client: Socket, payload?: {
        token?: string;
        userId?: number | string;
    }): Promise<{
        event: string;
        data: {
            message: string;
            userId?: undefined;
            room?: undefined;
        };
    } | {
        event: string;
        data: {
            userId: number;
            room: string;
            message?: undefined;
        };
    }>;
    emitNotificationToUsers(userIds: number[], payload: NotificationRealtimePayload): void;
    private logRealtimeRoomJoined;
}
