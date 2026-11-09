"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const socket_auth_service_1 = require("./services/socket-auth.service");
const socket_notifications_service_1 = require("./services/socket-notifications.service");
const socket_logs_config_1 = require("./config/socket-logs.config");
let SocketGateway = SocketGateway_1 = class SocketGateway {
    config;
    socketAuth;
    socketNotifications;
    logger = new common_1.Logger(SocketGateway_1.name);
    namespace = "/realtime";
    socketPath = "/socket.io";
    constructor(config, socketAuth, socketNotifications) {
        this.config = config;
        this.socketAuth = socketAuth;
        this.socketNotifications = socketNotifications;
    }
    server;
    afterInit() {
        if (!(0, socket_logs_config_1.isSocketLoggingEnabled)(this.config))
            return;
        this.logger.log("Socket.IO gateway initialise");
        this.logger.log(`Socket namespace: ${this.namespace}`);
        this.logger.log(`Socket path: ${this.socketPath}`);
    }
    async handleConnection(client) {
        if ((0, socket_logs_config_1.isSocketLoggingEnabled)(this.config)) {
            this.logger.log(`Client connecte: ${client.id}`);
        }
        const userId = await this.socketAuth.resolveAuthenticatedUserId(client);
        if (!userId) {
            const detail = await this.socketAuth.describeAuthFailure(client);
            if ((0, socket_logs_config_1.isSocketLoggingEnabled)(this.config)) {
                this.logger.warn(`Connexion refusee ${client.id}: JWT access manquant ou invalide | ${detail.summary} | handshake=${JSON.stringify(detail.handshake)}`);
            }
            client.emit("auth_error", {
                message: "JWT access requis (handshake auth.token ou Authorization Bearer)",
            });
            client.disconnect(true);
            return;
        }
        const room = this.socketNotifications.joinUserRoom(client, userId);
        this.logRealtimeRoomJoined("handshake", client, userId, room);
        client.emit("connected", {
            message: "Connexion Socket.IO etablie",
            socketId: client.id,
            userId,
            timestamp: new Date().toISOString(),
        });
    }
    handleDisconnect(client) {
        if ((0, socket_logs_config_1.isSocketLoggingEnabled)(this.config)) {
            this.logger.log(`Client deconnecte: ${client.id}`);
        }
    }
    handlePing(client, payload) {
        return {
            event: "pong",
            data: {
                socketId: client.id,
                payload: payload ?? null,
                timestamp: new Date().toISOString(),
            },
        };
    }
    async handleNotificationsSubscribe(client, payload) {
        const allowPlain = this.socketAuth.isPlainUserIdAllowed();
        let userId = null;
        const plainUserId = allowPlain ? (0, socket_auth_service_1.parsePlainUserId)(payload?.userId) : null;
        if (plainUserId) {
            userId = plainUserId;
        }
        else if (payload?.token?.trim()) {
            userId = await this.socketAuth.verifyAccessTokenAndGetUserId(payload.token.trim());
        }
        if (!userId) {
            return {
                event: "notifications.subscribe.error",
                data: {
                    message: allowPlain
                        ? "token JWT ou userId requis"
                        : "token JWT (access) requis",
                },
            };
        }
        const room = this.socketNotifications.joinUserRoom(client, userId);
        this.logRealtimeRoomJoined("notifications.subscribe", client, userId, room);
        return {
            event: "notifications.subscribed",
            data: { userId, room },
        };
    }
    emitNotificationToUsers(userIds, payload) {
        this.socketNotifications.emitNotificationToUsers(this.server, userIds, payload);
    }
    logRealtimeRoomJoined(source, client, userId, room) {
        const h = client.handshake;
        const forwardedRaw = h.headers["x-forwarded-for"];
        const forwarded = typeof forwardedRaw === "string"
            ? forwardedRaw.split(",")[0]?.trim()
            : Array.isArray(forwardedRaw)
                ? forwardedRaw[0]
                : undefined;
        if (!(0, socket_logs_config_1.isSocketLoggingEnabled)(this.config)) {
            return;
        }
        const info = {
            ok: true,
            source,
            namespace: this.namespace,
            socketPath: this.socketPath,
            socketId: client.id,
            userId,
            room,
            transport: client.conn?.transport?.name ?? null,
            address: h.address ?? null,
            forwardedFor: forwarded ?? null,
            userAgent: typeof h.headers["user-agent"] === "string"
                ? h.headers["user-agent"].slice(0, 120)
                : null,
        };
        this.logger.log(`[Realtime OK] client dans la room ${JSON.stringify(info)}`);
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("ping"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handlePing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("notifications.subscribe"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleNotificationsSubscribe", null);
exports.SocketGateway = SocketGateway = SocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "/realtime",
        path: "/socket.io",
        cors: {
            origin: true,
            methods: ["GET", "POST"],
            credentials: false,
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService,
        socket_auth_service_1.SocketAuthService,
        socket_notifications_service_1.SocketNotificationsService])
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map