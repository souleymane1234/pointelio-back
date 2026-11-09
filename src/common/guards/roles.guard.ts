import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Role } from "@prisma/client";
import { normalizeLocale, translate } from "../i18n";
import { ROLES_KEY } from "../rbac/roles.constants";
import type { AuthedRequest } from "../types/request-context";

/** RBAC : rôles exigés par `@Roles(...)` (rôle lu en base par `JwtAuthGuard`). */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const role = request.user?.role;
    if (!role) {
      const locale =
        request.locale ?? normalizeLocale(request.headers.language as string);
      throw new UnauthorizedException(translate(locale, "tokenMissing"));
    }
    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException();
    }
    return true;
  }
}
