"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const audit_module_1 = require("../audit/audit.module");
const cache_module_1 = require("../../infra/cache/cache.module");
const prisma_module_1 = require("../../infra/prisma/prisma.module");
const socket_module_1 = require("../../infra/socket/socket.module");
const campaigns_controller_1 = require("./campaigns/campaigns.controller");
const admin_sent_notifications_service_1 = require("./campaigns/services/admin-sent-notifications.service");
const notification_cache_service_1 = require("./shared/services/notification-cache.service");
const notifications_delivery_service_1 = require("./delivery/services/notifications-delivery.service");
const notifications_internal_service_1 = require("./inbox/services/notifications-internal.service");
const inbox_controller_1 = require("./inbox/inbox.controller");
const notifications_service_1 = require("./notifications.service");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, cache_module_1.AppCacheModule, socket_module_1.SocketModule, audit_module_1.AuditModule],
        controllers: [inbox_controller_1.NotificationsInboxController, campaigns_controller_1.NotificationCampaignsController],
        providers: [
            notification_cache_service_1.NotificationCacheService,
            notifications_internal_service_1.NotificationsInternalService,
            notifications_delivery_service_1.NotificationsDeliveryService,
            notifications_service_1.NotificationsService,
            admin_sent_notifications_service_1.AdminSentNotificationsService,
        ],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map