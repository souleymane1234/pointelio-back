import { Controller, Get, HttpStatus, Query, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiProduces, ApiTags } from "@nestjs/swagger";
import { ApiAudience } from "../../../common/decorators/api-audience.decorator";
import { Role } from "@prisma/client";
import type { Response } from "express";
import { normalizeLocale, translate } from "../../../common/i18n";
import { PLATFORM_ROLES } from "../../../common/rbac/role-groups";
import { Roles } from "../../../common/decorators/roles.decorator";
import { paginatedResponse } from "../../../common/utils/response.util";
import {
  type AuthedRequest,
  requireUser,
} from "../../../common/types/request-context";
import { AuditActionsService } from "../recorder/services/audit-actions.service";
import { AuditService } from "../audit.service";
import { ApiListAuditLogs } from "./decorators/api-audit-logs.decorator";
import { AuditLogsQueryDto } from "./dto/audit-logs-query.dto";

@ApiTags("Admin - Audit Trails")
@ApiAudience("employeur", "plateforme")
@ApiBearerAuth()
@Roles(...PLATFORM_ROLES, Role.ADMIN_CLIENT)
@Controller("admin/audit-trails/audit-logs")
export class AuditLogsController {
  constructor(
    private readonly auditTrailsService: AuditService,
    private readonly auditActions: AuditActionsService,
  ) {}

  @Get()
  @ApiListAuditLogs()
  async listAuditLogs(
    @Req() req: AuthedRequest,
    @Query() query: AuditLogsQueryDto,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const { data, pagination } = await this.auditTrailsService.listAuditLogs(
      requireUser(req),
      query,
    );
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "auditLogsFetched"),
      locale,
    );
  }

  @Get("export")
  @ApiProduces("text/csv")
  async exportAuditLogs(
    @Req() req: AuthedRequest,
    @Query() query: AuditLogsQueryDto,
    @Res() res: Response,
  ) {
    const actor = requireUser(req);
    const csv = await this.auditTrailsService.exportAuditLogsCsv(actor, query);
    void this.auditActions.auditExported(actor.id, { ...query });
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `audit-trail-${stamp}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(HttpStatus.OK).send(csv);
  }
}
