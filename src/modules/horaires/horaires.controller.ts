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
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { ApiAudience } from "../../common/decorators/api-audience.decorator";
import { ApiEndpoint } from "../../common/decorators/api-endpoint.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { SuccessResponseSchemaDto } from "../../common/dto/response-schemas.dto";
import { normalizeLocale, translate } from "../../common/i18n";
import { TENANT_ADMIN_ROLES } from "../../common/rbac/role-groups";
import {
  type AuthedRequest,
  requireTenant,
  requireUserId,
} from "../../common/types/request-context";
import { successResponse } from "../../common/utils/response.util";
import { CreateHoraireDto, UpdateHoraireDto } from "./dto/horaire.dto";
import {
  HoraireResponseSchemaDto,
  HorairesResponseSchemaDto,
} from "./dto/horaire-response.dto";
import { HorairesService } from "./horaires.service";

@ApiTags("Horaires")
@ApiAudience("employeur")
@ApiBearerAuth()
@Roles(...TENANT_ADMIN_ROLES)
@Controller("horaires")
export class HorairesController {
  constructor(private readonly horaires: HorairesService) {}

  @Get()
  @Roles(...TENANT_ADMIN_ROLES, Role.MANAGER)
  @ApiEndpoint({
    summary: "Lister les horaires de mon entreprise",
    schema: HorairesResponseSchemaDto,
  })
  async findAll(@Req() req: AuthedRequest) {
    const locale = this.locale(req);
    const data = await this.horaires.findAll(requireTenant(req).entrepriseId);
    return successResponse(translate(locale, "horairesFetched"), data, locale);
  }

  @Get(":id")
  @Roles(...TENANT_ADMIN_ROLES, Role.MANAGER)
  @ApiEndpoint({
    summary: "Détail d'un horaire",
    schema: HoraireResponseSchemaDto,
    notFound: "Horaire introuvable",
  })
  async findOne(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    const data = await this.horaires.findOne(
      requireTenant(req).entrepriseId,
      id,
      locale,
    );
    return successResponse(translate(locale, "horaireFetched"), data, locale);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint({
    summary: "Créer un horaire",
    description:
      "Un seul horaire sans le module HORAIRES_MULTIPLES (403 au-delà).",
    status: 201,
    schema: HoraireResponseSchemaDto,
    invalid: "Données invalides",
  })
  async create(@Req() req: AuthedRequest, @Body() dto: CreateHoraireDto) {
    const locale = this.locale(req);
    const data = await this.horaires.create(
      requireUserId(req),
      requireTenant(req).entrepriseId,
      dto,
      locale,
    );
    return successResponse(translate(locale, "horaireCreated"), data, locale);
  }

  @Patch(":id")
  @ApiEndpoint({
    summary: "Modifier un horaire",
    schema: HoraireResponseSchemaDto,
    notFound: "Horaire introuvable",
    invalid: "Données invalides ou corps vide",
  })
  async update(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateHoraireDto,
  ) {
    const locale = this.locale(req);
    const data = await this.horaires.update(
      requireUserId(req),
      requireTenant(req).entrepriseId,
      id,
      dto,
      locale,
    );
    return successResponse(translate(locale, "horaireUpdated"), data, locale);
  }

  @Delete(":id")
  @ApiEndpoint({
    summary: "Supprimer un horaire",
    schema: SuccessResponseSchemaDto,
    notFound: "Horaire introuvable",
    invalid: "Horaire encore attribué à des utilisateurs",
  })
  async remove(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    await this.horaires.remove(
      requireUserId(req),
      requireTenant(req).entrepriseId,
      id,
      locale,
    );
    return successResponse(
      translate(locale, "horaireDeleted"),
      undefined,
      locale,
    );
  }

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
