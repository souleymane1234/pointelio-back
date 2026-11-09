import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import type { Role, StatutEntreprise } from "@prisma/client";
import type { Request } from "express";
import type { Locale } from "../i18n";

/** Utilisateur posé sur `req.user` par `JwtAuthGuard` (rôle et entreprise lus en base). */
export type AuthUser = {
  id: number;
  role: Role;
  /** Null pour SUPER_ADMIN / SUPPORT. */
  entrepriseId: number | null;
};

/** Abonnement de l'entreprise de l'utilisateur, posé par `JwtAuthGuard` (absent pour l'équipe Pointelio). */
export type TenantContext = {
  entrepriseId: number;
  statut: StatutEntreprise;
  dateEcheance: Date | null;
};

export type AuthedRequest = Request & {
  locale?: Locale;
  user?: AuthUser;
  tenant?: TenantContext;
};

/** Identifiant de l'utilisateur connecté, `undefined` sur une route publique sans token. */
export function getUserId(req: {
  user?: Partial<AuthUser>;
}): number | undefined {
  return req.user?.id;
}

export function requireUserId(req: { user?: Partial<AuthUser> }): number {
  const userId = getUserId(req);
  if (!userId) {
    throw new UnauthorizedException("Missing user id in request context");
  }
  return userId;
}

/** Contexte d'entreprise du compte connecté (routes réservées aux comptes d'entreprise). */
export function requireTenant(
  req: Pick<AuthedRequest, "tenant">,
): TenantContext {
  if (!req.tenant) {
    throw new ForbiddenException();
  }
  return req.tenant;
}

export function requireUser(req: Pick<AuthedRequest, "user">): AuthUser {
  const user = req.user;
  if (!user?.id || !user.role) {
    throw new UnauthorizedException("Missing user in request context");
  }
  return user;
}
