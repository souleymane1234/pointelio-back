import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { getRequestStore } from "../context/request-store";
import { normalizeLocale, translate } from "../i18n";
import { isPlatformRole } from "../rbac/role-groups";
import type { AuthedRequest } from "../types/request-context";

/**
 * Isolation entreprise : un compte d'entreprise doit être rattaché à une
 * entreprise existante. Son `entrepriseId` est publié dans le contexte de
 * requête, où l'extension Prisma tenant le lit pour filtrer les requêtes.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const user = request.user;
    if (!user || isPlatformRole(user.role)) {
      return true;
    }

    if (!request.tenant) {
      const locale =
        request.locale ?? normalizeLocale(request.headers.language as string);
      throw new ForbiddenException(translate(locale, "tenantManquant"));
    }

    const store = getRequestStore();
    if (store) {
      store.entrepriseId = request.tenant.entrepriseId;
    }
    return true;
  }
}
