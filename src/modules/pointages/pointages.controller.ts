import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import type { Response } from "express";
import { ApiEndpoint } from "../../common/decorators/api-endpoint.decorator";
import { ModuleRequis } from "../../common/decorators/module-requis.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { PACK_MODULES } from "../../common/constants/pack-modules.constants";
import { normalizeLocale, translate } from "../../common/i18n";
import { TENANT_ADMIN_ROLES } from "../../common/rbac/role-groups";
import {
  type AuthedRequest,
  requireTenant,
  requireUser,
} from "../../common/types/request-context";
import {
  paginatedResponse,
  successResponse,
} from "../../common/utils/response.util";
import { AnomaliesService } from "./anomalies.service";
import { CorrectionsService } from "./corrections.service";
import {
  AnomaliesQueryDto,
  CorrigerPointageDto,
  PointagesQueryDto,
  PointerQrDto,
} from "./dto/pointage.dto";
import {
  PointageCorrectionResponseSchemaDto,
  PointageCorrectionsResponseSchemaDto,
  PointageResponseSchemaDto,
  PointagesPaginatedResponseSchemaDto,
} from "./dto/pointage-response.dto";
import { PointagesService } from "./pointages.service";
import { parsePointageId } from "./parse-pointage-id";

@ApiTags("Pointages")
@ApiBearerAuth()
@Roles(...TENANT_ADMIN_ROLES, Role.MANAGER, Role.SURVEILLANT, Role.EMPLOYE)
@Controller("pointages")
export class PointagesController {
  constructor(
    private readonly pointages: PointagesService,
    private readonly anomalies: AnomaliesService,
    private readonly corrections: CorrectionsService,
  ) {}

  @Get()
  @ApiEndpoint({
    summary: "Lister les pointages",
    audience: ["mobile", "employeur"],
    description:
      "Employé : les siens. Surveillant : son site. RH / manager / admin : l'entreprise.",
    status: 206,
    schema: PointagesPaginatedResponseSchemaDto,
  })
  async findAll(@Req() req: AuthedRequest, @Query() query: PointagesQueryDto) {
    const locale = this.locale(req);
    const { data, pagination } = await this.pointages.findAll(
      requireUser(req),
      requireTenant(req).entrepriseId,
      query,
    );
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "pointagesFetched"),
      locale,
    );
  }

  @Get("anomalies")
  @Roles(...TENANT_ADMIN_ROLES, Role.MANAGER, Role.SURVEILLANT)
  @ApiEndpoint({
    summary: "Lister les anomalies de pointage",
    audience: "employeur",
    description:
      "Hors zone, à vérifier, retards, oublis de départ. Filtrable via `anomalie`.",
    status: 206,
    schema: PointagesPaginatedResponseSchemaDto,
  })
  async findAnomalies(
    @Req() req: AuthedRequest,
    @Query() query: AnomaliesQueryDto,
  ) {
    const locale = this.locale(req);
    const { data, pagination } = await this.anomalies.list(
      requireUser(req),
      requireTenant(req).entrepriseId,
      query,
    );
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "anomaliesFetched"),
      locale,
    );
  }

  @Post("qr")
  @Roles(Role.EMPLOYE, Role.SURVEILLANT)
  @ModuleRequis(PACK_MODULES.QR, PACK_MODULES.GPS)
  @ApiEndpoint({
    summary: "Pointer par QR + GPS",
    audience: "mobile",
    description:
      "Heure serveur, séquence arrivée/départ du jour, idempotence par requestId. Un replay renvoie 200.",
    status: 201,
    schema: PointageResponseSchemaDto,
    invalid: "QR invalide, séquence incorrecte ou données GPS invalides",
  })
  async pointerQr(
    @Req() req: AuthedRequest,
    @Body() dto: PointerQrDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const locale = this.locale(req);
    const { replay, pointage } = await this.pointages.pointerQr(
      requireUser(req),
      requireTenant(req).entrepriseId,
      dto,
      locale,
    );
    res.status(replay ? HttpStatus.OK : HttpStatus.CREATED);
    return successResponse(
      translate(locale, replay ? "pointageReplay" : "pointageCreated"),
      pointage,
      locale,
    );
  }

  @Get(":id")
  @ApiEndpoint({
    summary: "Détail d'un pointage",
    audience: ["mobile", "employeur"],
    schema: PointageResponseSchemaDto,
    notFound: "Pointage introuvable",
  })
  async findOne(@Req() req: AuthedRequest, @Param("id") idParam: string) {
    const locale = this.locale(req);
    const data = await this.pointages.findOne(
      requireUser(req),
      requireTenant(req).entrepriseId,
      parsePointageId(idParam, locale),
      locale,
    );
    return successResponse(translate(locale, "pointageFetched"), data, locale);
  }

  @Get(":id/corrections")
  @Roles(...TENANT_ADMIN_ROLES, Role.MANAGER)
  @ApiEndpoint({
    summary: "Historique des corrections d'un pointage",
    audience: "employeur",
    schema: PointageCorrectionsResponseSchemaDto,
    notFound: "Pointage introuvable",
  })
  async listCorrections(
    @Req() req: AuthedRequest,
    @Param("id") idParam: string,
  ) {
    const locale = this.locale(req);
    const data = await this.corrections.list(
      requireUser(req),
      requireTenant(req).entrepriseId,
      parsePointageId(idParam, locale),
      locale,
    );
    return successResponse(
      translate(locale, "pointageCorrectionsFetched"),
      data,
      locale,
    );
  }

  @Post(":id/corrections")
  @HttpCode(HttpStatus.CREATED)
  @Roles(...TENANT_ADMIN_ROLES, Role.MANAGER)
  @ApiEndpoint({
    summary: "Corriger un pointage",
    audience: "employeur",
    description:
      "Motif obligatoire. Trace avant/après. Les coordonnées GPS d'origine ne sont pas modifiées.",
    status: 201,
    schema: PointageCorrectionResponseSchemaDto,
    notFound: "Pointage introuvable",
    invalid: "Motif manquant, aucun champ à corriger, ou site invalide",
  })
  async corriger(
    @Req() req: AuthedRequest,
    @Param("id") idParam: string,
    @Body() dto: CorrigerPointageDto,
  ) {
    const locale = this.locale(req);
    const data = await this.corrections.corriger(
      requireUser(req),
      requireTenant(req).entrepriseId,
      parsePointageId(idParam, locale),
      dto,
      locale,
    );
    return successResponse(
      translate(locale, "pointageCorrectionCreated"),
      data,
      locale,
    );
  }

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
