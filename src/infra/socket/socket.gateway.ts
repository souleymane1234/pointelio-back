import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {
  parsePlainUserId,
  SocketAuthService,
} from "./services/socket-auth.service";
import {
  SocketNotificationsService,
  type NotificationRealtimePayload,
} from "./services/socket-notifications.service";
import { isSocketLoggingEnabled } from "./config/socket-logs.config";

@WebSocketGateway({
  namespace: "/realtime",
  path: "/socket.io",
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: false,
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);
  private readonly namespace = "/realtime";
  private readonly socketPath = "/socket.io";

  constructor(
    private readonly config: ConfigService,
    private readonly socketAuth: SocketAuthService,
    private readonly socketNotifications: SocketNotificationsService,
  ) {}

  @WebSocketServer()
  server!: Server;

  afterInit() {
    if (!isSocketLoggingEnabled(this.config)) return;
    this.logger.log("Socket.IO gateway initialise");
    this.logger.log(`Socket namespace: ${this.namespace}`);
    this.logger.log(`Socket path: ${this.socketPath}`);
  }

  async handleConnection(client: Socket) {
    if (isSocketLoggingEnabled(this.config)) {
      this.logger.log(`Client connecte: ${client.id}`);
    }

    const userId = await this.socketAuth.resolveAuthenticatedUserId(client);
    if (!userId) {
      const detail = await this.socketAuth.describeAuthFailure(client);
      if (isSocketLoggingEnabled(this.config)) {
        this.logger.warn(
          `Connexion refusee ${client.id}: JWT access manquant ou invalide | ${detail.summary} | handshake=${JSON.stringify(detail.handshake)}`,
        );
      }
      client.emit("auth_error", {
        message:
          "JWT access requis (handshake auth.token ou Authorization Bearer)",
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

  handleDisconnect(client: Socket) {
    if (isSocketLoggingEnabled(this.config)) {
      this.logger.log(`Client deconnecte: ${client.id}`);
    }
  }

  @SubscribeMessage("ping")
  handlePing(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload?: unknown,
  ) {
    return {
      event: "pong",
      data: {
        socketId: client.id,
        payload: payload ?? null,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @SubscribeMessage("notifications.subscribe")
  async handleNotificationsSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload?: { token?: string; userId?: number | string },
  ) {
    const allowPlain = this.socketAuth.isPlainUserIdAllowed();

    let userId: number | null = null;
    const plainUserId = allowPlain ? parsePlainUserId(payload?.userId) : null;
    if (plainUserId) {
      userId = plainUserId;
    } else if (payload?.token?.trim()) {
      userId = await this.socketAuth.verifyAccessTokenAndGetUserId(
        payload.token.trim(),
      );
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

  /** Facade pour les services metiers (ex: NotificationsService). */
  emitNotificationToUsers(
    userIds: number[],
    payload: NotificationRealtimePayload,
  ) {
    this.socketNotifications.emitNotificationToUsers(
      this.server,
      userIds,
      payload,
    );
  }

  /** Logs console quand un client est authentifie et joint une room. */
  private logRealtimeRoomJoined(
    source: "handshake" | "notifications.subscribe",
    client: Socket,
    userId: number,
    room: string,
  ) {
    const h = client.handshake;
    const forwardedRaw = h.headers["x-forwarded-for"];
    const forwarded =
      typeof forwardedRaw === "string"
        ? forwardedRaw.split(",")[0]?.trim()
        : Array.isArray(forwardedRaw)
          ? forwardedRaw[0]
          : undefined;

    if (!isSocketLoggingEnabled(this.config)) {
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
      userAgent:
        typeof h.headers["user-agent"] === "string"
          ? h.headers["user-agent"].slice(0, 120)
          : null,
    };

    this.logger.log(
      `[Realtime OK] client dans la room ${JSON.stringify(info)}`,
    );
  }
}
