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
import { PLATFORM_ROLES } from "../../common/rbac/role-groups";
import {
  type AuthedRequest,
  requireUserId,
} from "../../common/types/request-context";
import {
  paginatedResponse,
  successResponse,
} from "../../common/utils/response.util";
import { CreatePackDto } from "./dto/create-pack.dto";
import {
  PackResponseSchemaDto,
  PacksPaginatedResponseSchemaDto,
} from "./dto/pack-response.dto";
import { PacksQueryDto } from "./dto/packs-query.dto";
import { UpdatePackDto } from "./dto/update-pack.dto";
import { PacksService } from "./packs.service";

@ApiTags("Admin — Packs")
@ApiAudience("plateforme")
@ApiBearerAuth()
@Roles(...PLATFORM_ROLES)
@Controller("admin/packs")
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  @ApiEndpoint({
    summary: "Lister les packs",
    status: 206,
    schema: PacksPaginatedResponseSchemaDto,
  })
  async findAll(@Req() req: AuthedRequest, @Query() query: PacksQueryDto) {
    const locale = this.locale(req);
    const { data, pagination } = await this.packsService.findAll(query);
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "packsFetched"),
      locale,
    );
  }

  @Get(":id")
  @ApiEndpoint({
    summary: "Détail d'un pack",
    schema: PackResponseSchemaDto,
    notFound: "Pack introuvable",
  })
  async findOne(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    const data = await this.packsService.findOne(id, locale);
    return successResponse(translate(locale, "packFetched"), data, locale);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint({
    summary: "Créer un pack",
    status: 201,
    schema: PackResponseSchemaDto,
    invalid: "Données invalides ou code déjà utilisé",
  })
  async create(@Req() req: AuthedRequest, @Body() dto: CreatePackDto) {
    const locale = this.locale(req);
    const data = await this.packsService.create(
      requireUserId(req),
      dto,
      locale,
    );
    return successResponse(translate(locale, "packCreated"), data, locale);
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN)
  @ApiEndpoint({
    summary: "Modifier un pack",
    description:
      "Prix, limites et modules s'appliquent aux entreprises abonnées (hors surcharges propres à l'entreprise).",
    schema: PackResponseSchemaDto,
    notFound: "Pack introuvable",
    invalid: "Données invalides, corps vide ou code déjà utilisé",
  })
  async update(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePackDto,
  ) {
    const locale = this.locale(req);
    const data = await this.packsService.update(
      requireUserId(req),
      id,
      dto,
      locale,
    );
    return successResponse(translate(locale, "packUpdated"), data, locale);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @ApiEndpoint({
    summary: "Désactiver un pack",
    description:
      "Le pack n'est plus proposé aux nouvelles entreprises ; les entreprises abonnées le conservent.",
    schema: PackResponseSchemaDto,
    notFound: "Pack introuvable",
  })
  async deactivate(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    const data = await this.packsService.deactivate(
      requireUserId(req),
      id,
      locale,
    );
    return successResponse(translate(locale, "packDeactivated"), data, locale);
  }

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
