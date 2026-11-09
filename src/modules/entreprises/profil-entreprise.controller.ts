import { Body, Controller, Get, Patch, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { AutoriseAbonnementInactif } from "../../common/decorators/abonnement-inactif.decorator";
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
import { successResponse } from "../../common/utils/response.util";
import { EntrepriseProfilResponseSchemaDto } from "./dto/entreprise-response.dto";
import { UpdateProfilEntrepriseDto } from "./dto/update-entreprise.dto";
import { ProfilEntrepriseService } from "./profil-entreprise.service";

@ApiTags("Entreprise — Profil")
@ApiAudience("employeur")
@ApiBearerAuth()
@Roles(...TENANT_ADMIN_ROLES)
@Controller("entreprise/profil")
export class ProfilEntrepriseController {
  constructor(private readonly profil: ProfilEntrepriseService) {}

  @Get()
  @AutoriseAbonnementInactif()
  @ApiEndpoint({
    summary: "Profil de mon entreprise",
    schema: EntrepriseProfilResponseSchemaDto,
  })
  async get(@Req() req: AuthedRequest) {
    const locale = this.locale(req);
    const data = await this.profil.get(requireTenant(req).entrepriseId, locale);
    return successResponse(
      translate(locale, "entrepriseProfilFetched"),
      data,
      locale,
    );
  }

  @Patch()
  @Roles(Role.ADMIN_CLIENT)
  @ApiEndpoint({
    summary: "Compléter le profil de mon entreprise",
    description:
      "`profilComplete` passe à true quand secteur, ville, adresse, contact et e-mail ou téléphone de contact sont renseignés.",
    schema: EntrepriseProfilResponseSchemaDto,
    invalid: "Données invalides ou corps vide",
  })
  async update(
    @Req() req: AuthedRequest,
    @Body() dto: UpdateProfilEntrepriseDto,
  ) {
    const locale = this.locale(req);
    const data = await this.profil.update(
      requireUserId(req),
      requireTenant(req).entrepriseId,
      dto,
      locale,
    );
    return successResponse(
      translate(locale, "entrepriseProfilUpdated"),
      data,
      locale,
    );
  }

  private locale(req: AuthedRequest) {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }
}
