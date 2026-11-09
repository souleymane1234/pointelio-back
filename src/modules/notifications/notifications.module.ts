import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { AppCacheModule } from "../../infra/cache/cache.module";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { SocketModule } from "../../infra/socket/socket.module";
import { NotificationCampaignsController } from "./campaigns/campaigns.controller";
import { AdminSentNotificationsService } from "./campaigns/services/admin-sent-notifications.service";
import { NotificationCacheService } from "./shared/services/notification-cache.service";
import { NotificationsDeliveryService } from "./delivery/services/notifications-delivery.service";
import { NotificationsInternalService } from "./inbox/services/notifications-internal.service";
import { NotificationsInboxController } from "./inbox/inbox.controller";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [PrismaModule, AppCacheModule, SocketModule, AuditModule],
  controllers: [NotificationsInboxController, NotificationCampaignsController],
  providers: [
    NotificationCacheService,
    NotificationsInternalService,
    NotificationsDeliveryService,
    NotificationsService,
    AdminSentNotificationsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
