import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { ApiAudience } from "../../common/decorators/api-audience.decorator";
import { ApiEndpoint } from "../../common/decorators/api-endpoint.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { normalizeLocale, translate } from "../../common/i18n";
import { TENANT_ADMIN_ROLES } from "../../common/rbac/role-groups";
import {
  type AuthedRequest,
  requireTenant,
  requireUserId,
} from "../../common/types/request-context";
import {
  paginatedResponse,
  successResponse,
} from "../../common/utils/response.util";
import { CreateSiteDto, SitesQueryDto, UpdateSiteDto } from "./dto/site.dto";
import {
  SiteResponseSchemaDto,
  SitesPaginatedResponseSchemaDto,
} from "./dto/site-response.dto";
import { SitesService } from "./sites.service";

@ApiTags("Sites")
@ApiAudience("employeur")
@ApiBearerAuth()
@Roles(...TENANT_ADMIN_ROLES)
@Controller("sites")
export class SitesController {
  constructor(private readonly sites: SitesService) {}

  @Get()
  @Roles(...TENANT_ADMIN_ROLES, Role.MANAGER)
  @ApiEndpoint({
    summary: "Lister les sites de mon entreprise",
    status: 206,
    schema: SitesPaginatedResponseSchemaDto,
  })
  async findAll(@Req() req: AuthedRequest, @Query() query: SitesQueryDto) {
    const locale = this.locale(req);
    const { data, pagination } = await this.sites.findAll(
      requireTenant(req).entrepriseId,
      query,
    );
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "sitesFetched"),
      locale,
    );
  }

  @Get(":id")
  @Roles(...TENANT_ADMIN_ROLES, Role.MANAGER)
  @ApiEndpoint({
    summary: "Détail d'un site",
    schema: SiteResponseSchemaDto,
    notFound: "Site introuvable",
  })
  async findOne(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    const data = await this.sites.findOne(
      requireTenant(req).entrepriseId,
      id,
      locale,
    );
    return successResponse(translate(locale, "siteFetched"), data, locale);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint({
    summary: "Créer un site",
    description:
      "Génère le QR statique du site. L'employeur choisit les jours travaillés (`horairesJours`) avec heure d'arrivée et de descente. Le rayon GPS est obligatoire ; la tolérance de retard (`toleranceMin`) est facultative. Refusé si la limite de sites de l'offre est atteinte.",
    status: 201,
    schema: SiteResponseSchemaDto,
    invalid:
      "Données invalides, horaires manquants ou limite de sites atteinte",
  })
  async create(@Req() req: AuthedRequest, @Body() dto: CreateSiteDto) {
    const locale = this.locale(req);
    const data = await this.sites.create(
      requireUserId(req),
      requireTenant(req).entrepriseId,
      dto,
      locale,
    );
    return successResponse(translate(locale, "siteCreated"), data, locale);
  }

  @Patch(":id")
  @ApiEndpoint({
    summary: "Modifier un site",
    schema: SiteResponseSchemaDto,
    notFound: "Site introuvable",
    invalid: "Données invalides, corps vide ou limite de sites atteinte",
  })
  async update(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSiteDto,
  ) {
    const locale = this.locale(req);
    const data = await this.sites.update(
      requireUserId(req),
      requireTenant(req).entrepriseId,
      id,
      dto,
      locale,
    );
    return successResponse(translate(locale, "siteUpdated"), data, locale);
  }

  @Delete(":id")
  @ApiEndpoint({
    summary: "Désactiver un site",
    description: "L'historique des pointages est conservé.",
    schema: SiteResponseSchemaDto,
    notFound: "Site introuvable",
  })
  async deactivate(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    const data = await this.sites.deactivate(
      requireUserId(req),
      requireTenant(req).entrepriseId,
      id,
      locale,
    );
    return successResponse(translate(locale, "siteDeactivated"), data, locale);
  }

  @Post(":id/qr/regenerer")
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint({
    summary: "Régénérer le QR d'un site",
    description: "L'ancien QR cesse immédiatement d'être valable.",
    schema: SiteResponseSchemaDto,
    notFound: "Site introuvable",
  })
  async regenerateQr(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    const data = await this.sites.regenerateQr(
      requireUserId(req),
      requireTenant(req).entrepriseId,
      id,
      locale,
    );
    return successResponse(
      translate(locale, "siteQrRegenerated"),
      data,
      locale,
    );
  }

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
