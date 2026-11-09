import { Injectable } from "@nestjs/common";
import type { AuthUser } from "../../common/types/request-context";
import type { AuditLogsQueryDto } from "./audit-logs/dto/audit-logs-query.dto";
import type { RecordAuditActionInput } from "./shared/audit-trails.types";
import { AuditLogsService } from "./audit-logs/services/audit-logs.service";
import { AuditTrailRecorderService } from "./recorder/services/audit-trail-recorder.service";

@Injectable()
export class AuditService {
  constructor(
    private readonly auditLogsService: AuditLogsService,
    private readonly auditTrailRecorderService: AuditTrailRecorderService,
  ) {}

  async listAuditLogs(actor: AuthUser, query: AuditLogsQueryDto) {
    return this.auditLogsService.list(actor, query);
  }

  async exportAuditLogsCsv(actor: AuthUser, query: AuditLogsQueryDto) {
    return this.auditLogsService.exportCsv(actor, query);
  }

  async recordAction(input: RecordAuditActionInput) {
    return this.auditTrailRecorderService.recordAction(input);
  }
}
