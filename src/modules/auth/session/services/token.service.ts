import { randomUUID } from "crypto";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { StatutCompte, type Role } from "@prisma/client";
import { AuditActionsService } from "../../../audit/recorder/services/audit-actions.service";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import { translate, type Locale } from "../../../../common/i18n";
import { validationErrorResponse } from "../../../../common/utils/response.util";
import { AuthResponse } from "../interfaces/auth-response.interface";
import type { JwtPayload } from "../../../../common/guards/jwt-auth.guard";
import { parseJwtUserId } from "../../../../common/utils/jwt-subject.util";
import { AuthTokenRevocationStore } from "./auth-token-revocation.store";
import { AuthUserSessionService } from "./auth-user-session.service";
import { authUserSelect, type AuthUserRow } from "./login.select";
import {
  getJwtAccessExpiresInSeconds,
  getJwtRefreshExpiresInSeconds,
} from "../config/jwt-expiry.config";

export interface AuthenticatedUserSummary {
  id: number;
  role: Role;
  entrepriseId: number | null;
}

export type AccessTokenDiagnosis =
  | { ok: true; user: AuthenticatedUserSummary }
  | {
      ok: false;
      reason:
        | "jwt_verify_echec"
        | "jwt_type_incorrect"
        | "sub_introuvable_en_base"
        | "token_revoke";
      detail?: string;
    };

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly auditActions: AuditActionsService,
    private readonly tokenRevocation: AuthTokenRevocationStore,
    private readonly authUserSession: AuthUserSessionService,
  ) {}

  signTokenPair(
    userId: number,
    role: Role,
  ): { accessToken: string; refreshToken: string } {
    const sub = String(userId);
    return {
      accessToken: this.jwtService.sign(
        { sub, type: "access", role },
        { expiresIn: getJwtAccessExpiresInSeconds(), jwtid: randomUUID() },
      ),
      refreshToken: this.jwtService.sign(
        { sub, type: "refresh" },
        { expiresIn: getJwtRefreshExpiresInSeconds(), jwtid: randomUUID() },
      ),
    };
  }

  buildAuthResponse(user: AuthUserRow): AuthResponse {
    const tokens = this.signTokenPair(user.id, user.role);
    const profile: AuthUserRow = {
      id: user.id,
      entrepriseId: user.entrepriseId,
      siteId: user.siteId,
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      poste: user.poste,
      photoUrl: user.photoUrl,
    };
    return { ...tokens, user: profile };
  }

  async refresh(
    refreshToken: string,
    locale: Locale,
  ): Promise<Pick<AuthResponse, "accessToken" | "refreshToken">> {
    const refreshInvalid = () =>
      new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "refreshInvalid")],
          undefined,
          locale,
        ),
      );

    type RefreshPayload = { sub: string; type?: string; exp?: number };

    let payload: RefreshPayload;
    try {
      payload = await this.jwtService.verifyAsync<RefreshPayload>(refreshToken);
    } catch {
      throw refreshInvalid();
    }

    const userId = parseJwtUserId(payload.sub);
    if (payload.type !== "refresh" || !userId) {
      throw refreshInvalid();
    }

    const remainingTtlSec = payload.exp
      ? payload.exp - Math.floor(Date.now() / 1000)
      : getJwtRefreshExpiresInSeconds();
    if (!(await this.tokenRevocation.consume(refreshToken, remainingTtlSec))) {
      throw refreshInvalid();
    }

    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { id: true, role: true, statut: true },
    });
    if (!user || user.statut !== StatutCompte.ACTIF) {
      throw refreshInvalid();
    }

    await this.auditActions.authRefreshToken(user.id);

    this.authUserSession.touchLastLoginAt(user.id);

    return this.signTokenPair(user.id, user.role);
  }

  /** Profil d'authentification d'un utilisateur (même format que le login). */
  async findAuthUser(userId: number): Promise<AuthUserRow | null> {
    return this.prisma.utilisateur.findUnique({
      where: { id: userId },
      select: authUserSelect,
    });
  }

  /**
   * Vérifie un JWT access et retourne l'utilisateur ou `null` si invalide.
   * Utilisé par les consommateurs HTTP/Socket qui ont juste besoin du user.
   */
  async verifyAccessTokenAndGetUser(
    token: string,
  ): Promise<AuthenticatedUserSummary | null> {
    const result = await this.verifyAccessTokenDiagnose(token);
    return result.ok ? result.user : null;
  }

  /** Comme `verifyAccessTokenAndGetUser` mais retourne uniquement l'id. */
  async verifyAccessTokenAndGetUserId(token: string): Promise<number | null> {
    const user = await this.verifyAccessTokenAndGetUser(token);
    return user?.id ?? null;
  }

  /**
   * Variante qui retourne un diagnostic précis (utile pour les logs de debug,
   * notamment côté Socket.IO).
   */
  async verifyAccessTokenDiagnose(
    token: string,
  ): Promise<AccessTokenDiagnosis> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      return { ok: false, reason: "jwt_verify_echec", detail };
    }

    if (payload.type && payload.type !== "access") {
      return {
        ok: false,
        reason: "jwt_type_incorrect",
        detail: payload.type,
      };
    }

    if (await this.tokenRevocation.isRevoked(token)) {
      return { ok: false, reason: "token_revoke" };
    }

    const userId = parseJwtUserId(payload.sub);
    const user = userId
      ? await this.prisma.utilisateur.findUnique({
          where: { id: userId },
          select: { id: true, role: true, statut: true, entrepriseId: true },
        })
      : null;
    if (!user || user.statut !== StatutCompte.ACTIF) {
      return {
        ok: false,
        reason: "sub_introuvable_en_base",
        detail: payload.sub,
      };
    }

    return {
      ok: true,
      user: { id: user.id, role: user.role, entrepriseId: user.entrepriseId },
    };
  }
}
