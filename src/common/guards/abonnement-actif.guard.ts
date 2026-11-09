import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ABONNEMENT_INACTIF_AUTORISE_KEY } from "../constants/auth.constants";
import { normalizeLocale, translate } from "../i18n";
import type { AuthedRequest } from "../types/request-context";
import { isAbonnementBloque } from "../utils/abonnement.util";

/** Bloque un compte d'entreprise dont l'abonnement est suspendu, résilié ou expiré. */
@Injectable()
export class AbonnementActifGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const tenant = request.tenant;
    if (!tenant || !isAbonnementBloque(tenant.statut, tenant.dateEcheance)) {
      return true;
    }

    const autorise = this.reflector.getAllAndOverride<boolean>(
      ABONNEMENT_INACTIF_AUTORISE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (autorise) {
      return true;
    }

    const locale =
      request.locale ?? normalizeLocale(request.headers.language as string);
    throw new ForbiddenException(translate(locale, "abonnementInactif"));
  }
}
