import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { AuditLogsController } from "./audit-logs/audit-logs.controller";
import { AuditService } from "./audit.service";
import { AuditActionsService } from "./recorder/services/audit-actions.service";
import { AuditLogsService } from "./audit-logs/services/audit-logs.service";
import { AuditTrailRecorderService } from "./recorder/services/audit-trail-recorder.service";

@Module({
  imports: [PrismaModule],
  controllers: [AuditLogsController],
  providers: [
    AuditService,
    AuditLogsService,
    AuditTrailRecorderService,
    AuditActionsService,
  ],
  exports: [AuditService, AuditActionsService],
})
export class AuditModule {}
