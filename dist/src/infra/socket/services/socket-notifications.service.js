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
var SocketNotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const notifications_realtime_constants_1 = require("../../../modules/notifications/delivery/constants/notifications-realtime.constants");
const socket_logs_config_1 = require("../config/socket-logs.config");
let SocketNotificationsService = SocketNotificationsService_1 = class SocketNotificationsService {
    config;
    logger = new common_1.Logger(SocketNotificationsService_1.name);
    constructor(config) {
        this.config = config;
    }
    joinUserRoom(client, userId) {
        const room = (0, notifications_realtime_constants_1.buildNotificationsUserRoom)(userId);
        void client.join(room);
        return room;
    }
    emitNotificationToUsers(server, userIds, payload) {
        const uniqueIds = [...new Set(userIds.filter(Boolean))];
        if (uniqueIds.length === 0) {
            if ((0, socket_logs_config_1.isSocketLoggingEnabled)(this.config)) {
                this.logger.warn(`[Socket] emitNotificationToUsers: aucun userId — event ${notifications_realtime_constants_1.NOTIFICATIONS_SOCKET_EVENT_NEW} ignore`);
            }
            return;
        }
        const eventPayload = {
            ...payload,
            createdAt: payload.createdAt ?? new Date().toISOString(),
        };
        if ((0, socket_logs_config_1.isSocketLoggingEnabled)(this.config)) {
            this.logger.log(`[Socket] emission ${notifications_realtime_constants_1.NOTIFICATIONS_SOCKET_EVENT_NEW} type=${payload.type} destinataires=${uniqueIds.length} rooms=${uniqueIds
                .map((id) => (0, notifications_realtime_constants_1.buildNotificationsUserRoom)(id))
                .join(", ")}`);
        }
        uniqueIds.forEach((userId) => {
            const room = (0, notifications_realtime_constants_1.buildNotificationsUserRoom)(userId);
            server.to(room).emit(notifications_realtime_constants_1.NOTIFICATIONS_SOCKET_EVENT_NEW, eventPayload);
        });
    }
};
exports.SocketNotificationsService = SocketNotificationsService;
exports.SocketNotificationsService = SocketNotificationsService = SocketNotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SocketNotificationsService);
//# sourceMappingURL=socket-notifications.service.js.map