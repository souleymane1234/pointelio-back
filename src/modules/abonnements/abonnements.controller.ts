import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { AutoriseAbonnementInactif } from "../../common/decorators/abonnement-inactif.decorator";
import { ApiEndpoint } from "../../common/decorators/api-endpoint.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { normalizeLocale, translate } from "../../common/i18n";
import {
  PLATFORM_ROLES,
  TENANT_ADMIN_ROLES,
} from "../../common/rbac/role-groups";
import {
  type AuthedRequest,
  requireTenant,
  requireUserId,
} from "../../common/types/request-context";
import { successResponse } from "../../common/utils/response.util";
import { AbonnementsService } from "./abonnements.service";
import { AbonnementResponseSchemaDto } from "./dto/abonnement-response.dto";
import { UpdateAbonnementDto } from "./dto/update-abonnement.dto";

@ApiTags("Abonnements")
@ApiBearerAuth()
@Controller()
export class AbonnementsController {
  constructor(private readonly abonnements: AbonnementsService) {}

  @Get("abonnement")
  @Roles(...TENANT_ADMIN_ROLES)
  @AutoriseAbonnementInactif()
  @ApiEndpoint({
    summary: "Abonnement de mon entreprise",
    audience: "employeur",
    description:
      "Statut, offre effective, usage et prix. Accessible même si l'abonnement est bloqué.",
    schema: AbonnementResponseSchemaDto,
  })
  async mine(@Req() req: AuthedRequest) {
    const locale = this.locale(req);
    const data = await this.abonnements.get(
      requireTenant(req).entrepriseId,
      locale,
    );
    return successResponse(
      translate(locale, "abonnementFetched"),
      data,
      locale,
    );
  }

  @Get("admin/entreprises/:id/abonnement")
  @Roles(...PLATFORM_ROLES)
  @ApiEndpoint({
    summary: "Abonnement d'une entreprise",
    audience: "plateforme",
    schema: AbonnementResponseSchemaDto,
    notFound: "Entreprise introuvable",
  })
  async get(@Req() req: AuthedRequest, @Param("id", ParseIntPipe) id: number) {
    const locale = this.locale(req);
    const data = await this.abonnements.get(id, locale);
    return successResponse(
      translate(locale, "abonnementFetched"),
      data,
      locale,
    );
  }

  @Patch("admin/entreprises/:id/abonnement")
  @Roles(Role.SUPER_ADMIN)
  @ApiEndpoint({
    summary: "Modifier l'abonnement d'une entreprise",
    audience: "plateforme",
    description:
      "Changement de pack, d'échéance, de statut de facturation ou des surcharges (offre sur mesure). Refusé si les nouvelles limites ne couvrent pas l'usage actuel.",
    schema: AbonnementResponseSchemaDto,
    notFound: "Entreprise ou pack introuvable",
    invalid: "Pack inactif, corps vide ou limites insuffisantes",
  })
  async update(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAbonnementDto,
  ) {
    const locale = this.locale(req);
    const data = await this.abonnements.modifier(
      requireUserId(req),
      id,
      dto,
      locale,
    );
    return successResponse(
      translate(locale, "abonnementUpdated"),
      data,
      locale,
    );
  }

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
