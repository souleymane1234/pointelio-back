import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import type { Response } from "express";
import { PACK_MODULES } from "../../../common/constants/pack-modules.constants";
import { ApiEndpoint } from "../../../common/decorators/api-endpoint.decorator";
import { ModuleRequis } from "../../../common/decorators/module-requis.decorator";
import { Roles } from "../../../common/decorators/roles.decorator";
import { normalizeLocale, translate } from "../../../common/i18n";
import {
  type AuthedRequest,
  requireTenant,
  requireUser,
} from "../../../common/types/request-context";
import { successResponse } from "../../../common/utils/response.util";
import { PointerSurveillantDto } from "../dto/pointage.dto";
import {
  PointageResponseSchemaDto,
  SurveillantEmployesResponseSchemaDto,
} from "../dto/pointage-response.dto";
import { SurveillantService } from "./surveillant.service";

@ApiTags("Pointages — Surveillant")
@ApiBearerAuth()
@Roles(Role.SURVEILLANT)
@ModuleRequis(PACK_MODULES.SURVEILLANT)
@Controller("pointages/surveillant")
export class SurveillantController {
  constructor(private readonly surveillant: SurveillantService) {}

  @Get("employes")
  @ApiEndpoint({
    summary: "Employés du site du surveillant",
    audience: "mobile",
    description:
      "Comptes EMPLOYE actifs du site, avec le dernier pointage du jour.",
    schema: SurveillantEmployesResponseSchemaDto,
    invalid: "Le surveillant n'est rattaché à aucun site",
  })
  async employes(@Req() req: AuthedRequest) {
    const locale = this.locale(req);
    const data = await this.surveillant.employesDuSite(
      requireUser(req),
      requireTenant(req).entrepriseId,
      locale,
    );
    return successResponse(
      translate(locale, "surveillantEmployesFetched"),
      data,
      locale,
    );
  }

  @Post()
  @ApiEndpoint({
    summary: "Badger un employé du site",
    audience: "mobile",
    description:
      "methode = SURVEILLANT. GPS optionnel. Idempotence par requestId (replay = 200).",
    status: 201,
    schema: PointageResponseSchemaDto,
    invalid: "Employé invalide, séquence incorrecte ou site manquant",
  })
  async pointer(
    @Req() req: AuthedRequest,
    @Body() dto: PointerSurveillantDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const locale = this.locale(req);
    const { replay, pointage } = await this.surveillant.pointerPour(
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

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
