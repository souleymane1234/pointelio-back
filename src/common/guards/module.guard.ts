import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { MODULES_REQUIS_KEY } from "../constants/auth.constants";
import type { PackModule } from "../constants/pack-modules.constants";
import { normalizeLocale } from "../i18n";
import type { AuthedRequest } from "../types/request-context";
import { EntitlementsService } from "../../modules/entitlements/entitlements.service";

/**
 * Dernier maillon : refuse une route dont le module (`@ModuleRequis`) n'est pas
 * inclus dans le pack de l'entreprise. L'équipe Pointelio n'est pas concernée.
 */
@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly entitlements: EntitlementsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const modules = this.reflector.getAllAndOverride<PackModule[]>(
      MODULES_REQUIS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!modules || modules.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthedRequest>();
    if (!request.tenant) {
      return true;
    }

    const locale =
      request.locale ?? normalizeLocale(request.headers.language as string);
    for (const module of modules) {
      await this.entitlements.assertModule(
        request.tenant.entrepriseId,
        module,
        locale,
      );
    }
    return true;
  }
}
