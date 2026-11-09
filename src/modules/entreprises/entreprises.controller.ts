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
import { CreateEntrepriseDto } from "./dto/create-entreprise.dto";
import {
  EntrepriseResponseSchemaDto,
  EntreprisesPaginatedResponseSchemaDto,
} from "./dto/entreprise-response.dto";
import { EntreprisesQueryDto } from "./dto/entreprises-query.dto";
import { MotifDto, UpdateEntrepriseDto } from "./dto/update-entreprise.dto";
import type { CycleAction } from "./entreprise-cycle.util";
import { EntreprisesService } from "./entreprises.service";

@ApiTags("Admin — Entreprises")
@ApiAudience("plateforme")
@ApiBearerAuth()
@Roles(...PLATFORM_ROLES)
@Controller("admin/entreprises")
export class EntreprisesController {
  constructor(private readonly entreprises: EntreprisesService) {}

  @Get()
  @ApiEndpoint({
    summary: "Lister les entreprises",
    status: 206,
    schema: EntreprisesPaginatedResponseSchemaDto,
  })
  async findAll(
    @Req() req: AuthedRequest,
    @Query() query: EntreprisesQueryDto,
  ) {
    const locale = this.locale(req);
    const { data, pagination } = await this.entreprises.findAll(query);
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "entreprisesFetched"),
      locale,
    );
  }

  @Get(":id")
  @ApiEndpoint({
    summary: "Détail d'une entreprise",
    schema: EntrepriseResponseSchemaDto,
    notFound: "Entreprise introuvable",
  })
  async findOne(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale = this.locale(req);
    const data = await this.entreprises.findOne(id, locale);
    return successResponse(
      translate(locale, "entrepriseFetched"),
      data,
      locale,
    );
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint({
    summary: "Créer une entreprise",
    description:
      "Avec `admin` (nom, prénom, e-mail, mot de passe), crée le premier ADMIN_CLIENT, actif immédiatement. Aucun e-mail n'est envoyé : l'administrateur transmet lui-même les identifiants.",
    status: 201,
    schema: EntrepriseResponseSchemaDto,
    notFound: "Pack introuvable",
    invalid: "Données invalides, pack inactif ou e-mail admin déjà utilisé",
  })
  async create(@Req() req: AuthedRequest, @Body() dto: CreateEntrepriseDto) {
    const locale = this.locale(req);
    const data = await this.entreprises.create(requireUserId(req), dto, locale);
    return successResponse(
      translate(locale, "entrepriseCreated"),
      data,
      locale,
    );
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN)
  @ApiEndpoint({
    summary: "Modifier une entreprise",
    description:
      "Profil et notes internes. Statut : routes de cycle de vie ; pack et limites : abonnement.",
    schema: EntrepriseResponseSchemaDto,
    notFound: "Entreprise introuvable",
    invalid: "Données invalides ou corps vide",
  })
  async update(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateEntrepriseDto,
  ) {
    const locale = this.locale(req);
    const data = await this.entreprises.update(
      requireUserId(req),
      id,
      dto,
      locale,
    );
    return successResponse(
      translate(locale, "entrepriseUpdated"),
      data,
      locale,
    );
  }

  @Post(":id/suspendre")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint({
    summary: "Suspendre une entreprise",
    description:
      "Ses comptes sont bloqués immédiatement (hors profil et déconnexion).",
    schema: EntrepriseResponseSchemaDto,
    notFound: "Entreprise introuvable",
    invalid: "Transition interdite depuis le statut actuel",
  })
  suspendre(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: MotifDto,
  ) {
    return this.cycle(req, id, "suspendre", dto, "entrepriseSuspended");
  }

  @Post(":id/reactiver")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint({
    summary: "Réactiver une entreprise suspendue",
    schema: EntrepriseResponseSchemaDto,
    notFound: "Entreprise introuvable",
    invalid: "Transition interdite depuis le statut actuel",
  })
  reactiver(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: MotifDto,
  ) {
    return this.cycle(req, id, "reactiver", dto, "entrepriseReactivated");
  }

  @Post(":id/cloturer")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint({
    summary: "Clôturer une entreprise (résiliation définitive)",
    schema: EntrepriseResponseSchemaDto,
    notFound: "Entreprise introuvable",
    invalid: "Entreprise déjà résiliée",
  })
  cloturer(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: MotifDto,
  ) {
    return this.cycle(req, id, "cloturer", dto, "entrepriseClosed");
  }

  private async cycle(
    req: AuthedRequest,
    id: number,
    action: CycleAction,
    dto: MotifDto,
    messageKey:
      "entrepriseSuspended" | "entrepriseReactivated" | "entrepriseClosed",
  ) {
    const locale = this.locale(req);
    const data = await this.entreprises.changerStatut(
      requireUserId(req),
      id,
      action,
      dto.motif,
      locale,
    );
    return successResponse(translate(locale, messageKey), data, locale);
  }

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
