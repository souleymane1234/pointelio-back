import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { ApiEndpoint } from "../../common/decorators/api-endpoint.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { normalizeLocale, translate } from "../../common/i18n";
import { TENANT_ADMIN_ROLES } from "../../common/rbac/role-groups";
import {
  type AuthedRequest,
  requireTenant,
  requireUser,
} from "../../common/types/request-context";
import { successResponse } from "../../common/utils/response.util";
import { DashboardService } from "./dashboard.service";
import { PresencePeriodeQueryDto, PresenceQueryDto } from "./dto/presence-query.dto";
import { PresenceResponseSchemaDto } from "./dto/presence-response.dto";

@ApiTags("Dashboard")
@ApiBearerAuth()
@Roles(...TENANT_ADMIN_ROLES, Role.MANAGER, Role.SURVEILLANT)
@Controller("dashboard")
export class DashboardClientController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get("presence")
  @ApiEndpoint({
    summary: "Présence et paie du jour",
    audience: ["mobile", "employeur"],
    description:
      "Retards selon les jours, heures et tolérance (facultative) définis par l'employeur sur le site. Une journée est payée seulement si l'employé a badgé à l'arrivée et à la descente. Surveillant : limité à son site.",
    schema: PresenceResponseSchemaDto,
  })
  async presence(@Req() req: AuthedRequest, @Query() query: PresenceQueryDto) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.dashboard.presence(
      requireUser(req),
      requireTenant(req).entrepriseId,
      query,
    );
    return successResponse(translate(locale, "presenceFetched"), data, locale);
  }

  @Get("presence/periode")
  @ApiEndpoint({
    summary: "Présence et paie sur une période",
    audience: ["mobile", "employeur"],
    description:
      "Cumul par employé entre `du` et `au` (inclus, 62 jours max) : jours ouvrés, présences, absences (dont justifiées par un congé approuvé), retards, oublis de départ, jours payés et montant. Les jours à venir sont ignorés. Surveillant : limité à son site.",
    invalid: "Dates invalides ou période trop longue",
  })
  async presencePeriode(
    @Req() req: AuthedRequest,
    @Query() query: PresencePeriodeQueryDto,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.dashboard.presencePeriode(
      requireUser(req),
      requireTenant(req).entrepriseId,
      query,
      locale,
    );
    return successResponse(
      translate(locale, "presencePeriodeFetched"),
      data,
      locale,
    );
  }
}
