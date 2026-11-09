import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { DemandesController } from "./demandes.controller";
import { DemandesService } from "./demandes.service";

@Module({
  imports: [PrismaModule, AuditModule, NotificationsModule],
  controllers: [DemandesController],
  providers: [DemandesService],
  exports: [DemandesService],
})
export class DemandesModule {}
