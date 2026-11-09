import { Controller, Get, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiAudience } from "../../common/decorators/api-audience.decorator";
import { AutoriseAbonnementInactif } from "../../common/decorators/abonnement-inactif.decorator";
import { normalizeLocale, translate } from "../../common/i18n";
import type { AuthedRequest } from "../../common/types/request-context";
import { successResponse } from "../../common/utils/response.util";
import { ApiMyEntitlements } from "./decorators/api-entitlements.decorator";
import { EntitlementsService } from "./entitlements.service";

@ApiTags("Entitlements")
@ApiAudience("mobile", "employeur")
@ApiBearerAuth()
@Controller("me/entitlements")
export class EntitlementsController {
  constructor(private readonly entitlements: EntitlementsService) {}

  /** Le web et le mobile s'en servent pour afficher ou masquer les fonctions. */
  @Get()
  @AutoriseAbonnementInactif()
  @ApiMyEntitlements()
  async mine(@Req() req: AuthedRequest) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const entrepriseId = req.tenant?.entrepriseId;
    const data = entrepriseId
      ? {
          ...(await this.entitlements.getForEntreprise(entrepriseId, locale)),
          usage: await this.entitlements.getUsage(entrepriseId),
        }
      : null;
    return successResponse(
      translate(locale, "entitlementsFetched"),
      data,
      locale,
    );
  }
}
