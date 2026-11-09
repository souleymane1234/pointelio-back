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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsDeliveryService = void 0;
const common_1 = require("@nestjs/common");
const socket_gateway_1 = require("../../../../infra/socket/socket.gateway");
let NotificationsDeliveryService = class NotificationsDeliveryService {
    socketGateway;
    constructor(socketGateway) {
        this.socketGateway = socketGateway;
    }
    dispatch(userIds, notification) {
        this.socketGateway.emitNotificationToUsers(userIds, notification);
    }
};
exports.NotificationsDeliveryService = NotificationsDeliveryService;
exports.NotificationsDeliveryService = NotificationsDeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [socket_gateway_1.SocketGateway])
], NotificationsDeliveryService);
//# sourceMappingURL=notifications-delivery.service.js.map