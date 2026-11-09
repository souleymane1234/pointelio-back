import {
  Body,
  Controller,
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
import { Role, StatutDemande } from "@prisma/client";
import { PACK_MODULES } from "../../common/constants/pack-modules.constants";
import { ApiEndpoint } from "../../common/decorators/api-endpoint.decorator";
import { ModuleRequis } from "../../common/decorators/module-requis.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
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
import { DemandesService } from "./demandes.service";
import {
  CreateDemandeDto,
  DeciderDemandeDto,
  DemandesQueryDto,
  UpdateDemandeDto,
} from "./dto/demande.dto";
import {
  DemandeResponseSchemaDto,
  DemandesPaginatedResponseSchemaDto,
} from "./dto/demande-response.dto";

@ApiTags("Demandes")
@ApiBearerAuth()
@ModuleRequis(PACK_MODULES.CONGES)
@Roles(...TENANT_ADMIN_ROLES, Role.MANAGER, Role.SURVEILLANT, Role.EMPLOYE)
@Controller("demandes")
export class DemandesController {
  constructor(private readonly demandes: DemandesService) {}

  @Get()
  @ApiEndpoint({
    summary: "Lister les demandes d'absence / congé",
    audience: ["mobile", "employeur"],
    description:
      "Employé : les siennes. Surveillant : son site. RH / manager / admin : l'entreprise.",
    status: 206,
    schema: DemandesPaginatedResponseSchemaDto,
  })
  async findAll(@Req() req: AuthedRequest, @Query() query: DemandesQueryDto) {
    const locale = this.locale(req);
    const { data, pagination } = await this.demandes.findAll(
      requireUser(req),
      requireTenant(req).entrepriseId,
      query,
    );
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "demandesFetched"),
      locale,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint({
    summary: "Créer une demande",
    audience: "mobile",
    description:
      "nbJours calculé selon l'horaire. Maladie : justificatif obligatoire. Chevauchement refusé.",
    status: 201,
    schema: DemandeResponseSchemaDto,
    invalid: "Période invalide, chevauchement, ou justificatif manquant",
  })
  async create(@Req() req: AuthedRequest, @Body() dto: CreateDemandeDto) {
    const locale = this.locale(req);
    const data = await this.demandes.create(
      requireUser(req),
      requireTenant(req).entrepriseId,
      dto,
      locale,
    );
    return successResponse(translate(locale, "demandeCreated"), data, locale);
  }

  @Get(":id")
  @ApiEndpoint({
    summary: "Détail d'une demande",
    audience: ["mobile", "employeur"],
    schema: DemandeResponseSchemaDto,
    notFound: "Demande introuvable",
  })
  async findOne(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    const data = await this.demandes.findOne(
      requireUser(req),
      requireTenant(req).entrepriseId,
      id,
      locale,
    );
    return successResponse(translate(locale, "demandeFetched"), data, locale);
  }

  @Patch(":id")
  @ApiEndpoint({
    summary: "Modifier une demande en attente",
    audience: "mobile",
    schema: DemandeResponseSchemaDto,
    notFound: "Demande introuvable",
    invalid: "Demande non modifiable, chevauchement ou données invalides",
  })
  async update(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDemandeDto,
  ) {
    const locale = this.locale(req);
    const data = await this.demandes.update(
      requireUser(req),
      requireTenant(req).entrepriseId,
      id,
      dto,
      locale,
    );
    return successResponse(translate(locale, "demandeUpdated"), data, locale);
  }

  @Post(":id/decider")
  @Roles(...TENANT_ADMIN_ROLES, Role.MANAGER)
  @ApiEndpoint({
    summary: "Approuver ou refuser une demande",
    audience: "employeur",
    description:
      "Motif obligatoire en cas de refus. Impossible de statuer sur sa propre demande.",
    schema: DemandeResponseSchemaDto,
    notFound: "Demande introuvable",
    invalid: "Demande déjà traitée, motif manquant, ou auto-décision",
  })
  async decider(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: DeciderDemandeDto,
  ) {
    const locale = this.locale(req);
    const data = await this.demandes.decider(
      requireUser(req),
      requireTenant(req).entrepriseId,
      id,
      dto,
      locale,
    );
    const key =
      dto.statut === StatutDemande.APPROUVEE
        ? "demandeApprouvee"
        : "demandeRefusee";
    return successResponse(translate(locale, key), data, locale);
  }

  @Post(":id/annuler")
  @ApiEndpoint({
    summary: "Annuler une demande",
    audience: ["mobile", "employeur"],
    description:
      "L'employé annule une demande en attente. RH / manager peuvent aussi annuler une demande approuvée non commencée.",
    schema: DemandeResponseSchemaDto,
    notFound: "Demande introuvable",
    invalid: "Demande déjà commencée ou dans un statut non annulable",
  })
  async annuler(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    const data = await this.demandes.annuler(
      requireUser(req),
      requireTenant(req).entrepriseId,
      id,
      locale,
    );
    return successResponse(translate(locale, "demandeAnnulee"), data, locale);
  }

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
