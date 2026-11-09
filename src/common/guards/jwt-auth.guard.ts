import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { StatutCompte, type Role } from "@prisma/client";
import { normalizeLocale, translate, type Locale } from "../i18n";
import type {
  AuthedRequest,
  AuthUser,
  TenantContext,
} from "../types/request-context";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { IS_PUBLIC_KEY } from "../constants/auth.constants";
import { AuthTokenRevocationStore } from "../../modules/auth/session/services/auth-token-revocation.store";
import { extractBearerToken } from "../../modules/auth/session/utils/bearer-token.util";
import { parseJwtUserId } from "../utils/jwt-subject.util";

export interface JwtPayload {
  /** Id `Utilisateur` sérialisé en texte (claim JWT standard). */
  sub: string;
  type?: string;
  role?: Role;
}

/**
 * Premier maillon de la chaîne de guards : authentifie le JWT et pose
 * `req.user` (et `req.tenant` pour un compte d'entreprise).
 * Les droits (rôles, abonnement, modules) sont vérifiés par les guards suivants.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly tokenRevocation: AuthTokenRevocationStore,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const locale = this.locale(request);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const path = request.path || request.url.split("?")[0];
    if (isPublic || this.isDocsOrOpenApiPath(path)) {
      const token = extractBearerToken(request);
      if (token) {
        try {
          await this.attachUserFromToken(request, token, locale);
        } catch (e) {
          if (!isPublic) {
            throw e;
          }
        }
      }
      return true;
    }

    const token = extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException(translate(locale, "tokenMissing"));
    }

    try {
      await this.attachUserFromToken(request, token, locale);
      return true;
    } catch (e) {
      if (
        e instanceof UnauthorizedException ||
        e instanceof ForbiddenException
      ) {
        throw e;
      }
      throw new UnauthorizedException(
        translate(locale, "tokenInvalidOrExpired"),
      );
    }
  }

  private async attachUserFromToken(
    request: AuthedRequest,
    token: string,
    locale: Locale,
  ): Promise<void> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    if (payload.type && payload.type !== "access") {
      throw new UnauthorizedException(translate(locale, "tokenInvalid"));
    }

    if (await this.tokenRevocation.isRevoked(token)) {
      throw new UnauthorizedException(
        translate(locale, "tokenInvalidOrExpired"),
      );
    }

    const { user, tenant } = await this.resolveUser(payload, locale);
    request.user = user;
    request.tenant = tenant;
  }

  /**
   * Rôle, statut et entreprise font foi en base, pas dans le JWT : un compte
   * rétrogradé ou suspendu perd ses droits immédiatement.
   */
  private async resolveUser(
    payload: JwtPayload,
    locale: Locale,
  ): Promise<{ user: AuthUser; tenant?: TenantContext }> {
    const id = parseJwtUserId(payload.sub);
    const row = id
      ? await this.prisma.utilisateur.findUnique({
          where: { id },
          select: {
            id: true,
            role: true,
            statut: true,
            entrepriseId: true,
            entreprise: { select: { statut: true, dateEcheance: true } },
          },
        })
      : null;
    if (!row || row.statut !== StatutCompte.ACTIF) {
      throw new UnauthorizedException(
        translate(locale, "tokenInvalidOrExpired"),
      );
    }

    return {
      user: { id: row.id, role: row.role, entrepriseId: row.entrepriseId },
      tenant:
        row.entrepriseId !== null && row.entreprise
          ? {
              entrepriseId: row.entrepriseId,
              statut: row.entreprise.statut,
              dateEcheance: row.entreprise.dateEcheance,
            }
          : undefined,
    };
  }

  private locale(req: AuthedRequest): Locale {
    return req.locale ?? normalizeLocale(req.headers.language as string);
  }

  private isDocsOrOpenApiPath(path: string): boolean {
    return /\/docs(\/|$)/.test(path) || path.includes("docs-json");
  }
}
