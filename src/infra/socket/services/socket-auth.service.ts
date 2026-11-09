import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Socket } from "socket.io";
import {
  TokenService,
  type AuthenticatedUserSummary,
} from "../../../modules/auth/session/services/token.service";

export type AuthenticatedSocketUser = AuthenticatedUserSummary;

/**
 * Specialise les concerns Socket.IO autour de l auth :
 *  - extraction du JWT depuis le handshake (auth.token, auth.accessToken,
 *    Authorization Bearer, query.token)
 *  - mode dev "plain userId" (SOCKET_AUTH_ALLOW_PLAIN_USERID=true)
 *  - debug redacte du handshake pour les logs de connexion refusee
 *
 * La verification du JWT et la lecture de l utilisateur sont deleguees au
 * `TokenService` du module Auth (pas de duplication de la logique metier auth).
 */
@Injectable()
export class SocketAuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Resout l identifiant utilisateur a partir du handshake (JWT par defaut).
   * En dev: SOCKET_AUTH_ALLOW_PLAIN_USERID=true autorise auth.userId / query.userId.
   */
  async resolveAuthenticatedUserId(client: Socket): Promise<number | null> {
    if (this.isPlainUserIdAllowed()) {
      const plain = this.extractPlainUserId(client);
      if (plain) return plain;
    }

    const token = this.extractBearerToken(client);
    if (!token) return null;
    return this.tokenService.verifyAccessTokenAndGetUserId(token);
  }

  /** Comme `resolveAuthenticatedUserId` mais retourne aussi le role. */
  async resolveAuthenticatedUser(
    client: Socket,
  ): Promise<AuthenticatedSocketUser | null> {
    const token = this.extractBearerToken(client);
    if (!token) return null;
    return this.tokenService.verifyAccessTokenAndGetUser(token);
  }

  /**
   * Helper expose pour les handlers `notifications.subscribe` qui acceptent un
   * token brut dans le payload.
   */
  verifyAccessTokenAndGetUserId(token: string): Promise<number | null> {
    return this.tokenService.verifyAccessTokenAndGetUserId(token);
  }

  isPlainUserIdAllowed(): boolean {
    return (
      this.config.get<string>("SOCKET_AUTH_ALLOW_PLAIN_USERID", "false") ===
      "true"
    );
  }

  extractPlainUserId(client: Socket): number | null {
    return (
      parsePlainUserId(client.handshake.auth?.userId) ??
      parsePlainUserId(client.handshake.query?.userId)
    );
  }

  extractBearerToken(client: Socket): string | null {
    const auth = client.handshake.auth as Record<string, unknown> | undefined;
    const fromAuthToken =
      typeof auth?.token === "string" ? auth.token.trim() : "";
    if (fromAuthToken) return fromAuthToken;

    const fromAccess =
      typeof auth?.accessToken === "string" ? auth.accessToken.trim() : "";
    if (fromAccess) return fromAccess;

    const rawHeader = client.handshake.headers.authorization;
    const header =
      typeof rawHeader === "string"
        ? rawHeader
        : Array.isArray(rawHeader)
          ? rawHeader[0]
          : "";
    const m = header.match(/^Bearer\s+(.+)$/i);
    if (m?.[1]?.trim()) return m[1].trim();

    const q = client.handshake.query?.token;
    const fromQuery = typeof q === "string" ? q.trim() : "";
    if (fromQuery) return fromQuery;

    return null;
  }

  /** Resume ce que le client a envoye (sans exposer les JWT en clair). */
  buildHandshakeDebug(client: Socket): Record<string, unknown> {
    const auth = client.handshake.auth as Record<string, unknown> | undefined;
    const authKeys = auth ? Object.keys(auth) : [];
    const q = client.handshake.query;

    const stringifyAuthValue = (key: string, value: unknown): string => {
      if (typeof value !== "string") return `[${typeof value}]`;
      const lower = key.toLowerCase();
      if (/token|secret|password|authorization|bearer/i.test(lower)) {
        return this.redactJwtLike(value);
      }
      return value.length > 120 ? `${value.slice(0, 120)}…` : value;
    };

    const authEntries: Record<string, string> = {};
    for (const key of authKeys) {
      authEntries[key] = stringifyAuthValue(key, auth?.[key]);
    }

    const queryKeys =
      q && typeof q === "object" && !Array.isArray(q) ? Object.keys(q) : [];

    const querySummary: Record<string, string> = {};
    for (const key of queryKeys) {
      const raw = (q as Record<string, unknown>)[key];
      const val =
        typeof raw === "string"
          ? raw
          : Array.isArray(raw) && typeof raw[0] === "string"
            ? raw[0]
            : "";
      querySummary[key] =
        /token|secret|password/i.test(key) && val
          ? this.redactJwtLike(val)
          : val || "[empty]";
    }

    const rawAuthz = client.handshake.headers.authorization;
    const authz =
      typeof rawAuthz === "string"
        ? rawAuthz
        : Array.isArray(rawAuthz)
          ? rawAuthz[0]
          : "";

    return {
      transport: client.conn?.transport?.name,
      authKeys,
      auth: authEntries,
      queryKeys,
      query: querySummary,
      hasAuthorizationHeader: Boolean(authz),
      authorizationRedacted: authz
        ? this.redactJwtLike(authz.replace(/^Bearer\s+/i, "").trim())
        : null,
    };
  }

  /**
   * longueur + prefix/suffix courts si SOCKET_LOG_JWT_PREVIEW=true
   */
  redactJwtLike(value: string): string {
    const len = value.length;
    const preview =
      this.config.get<string>("SOCKET_LOG_JWT_PREVIEW", "false") === "true";
    if (!preview || len === 0) return `[string len=${len}]`;
    if (len <= 24) return `[len=${len} value=<court>]`;
    return `[len=${len} prefix=${value.slice(0, 12)}… suffix=…${value.slice(-8)}]`;
  }

  /**
   * Diagnostic detaille (handshake + raison precise du refus) pour les logs
   * de connexion refusee. Delegue le verdict du token au `TokenService`.
   */
  async describeAuthFailure(client: Socket): Promise<{
    summary: string;
    handshake: Record<string, unknown>;
  }> {
    const handshake = this.buildHandshakeDebug(client);
    const token = this.extractBearerToken(client);

    if (!token) {
      return {
        summary:
          "aucun_bearer_extrait (auth.token, auth.accessToken, Authorization Bearer, query.token)",
        handshake,
      };
    }

    const diag = await this.tokenService.verifyAccessTokenDiagnose(token);
    if (diag.ok) {
      return {
        summary:
          "incoherent_jwt_et_user_ok_mais_auth_refusee (signaler au backend)",
        handshake,
      };
    }

    const summary = diag.detail ? `${diag.reason}:${diag.detail}` : diag.reason;
    return { summary, handshake };
  }
}

/** Mode dev : `userId` en clair (nombre ou texte numérique). */
export function parsePlainUserId(raw: unknown): number | null {
  const id =
    typeof raw === "number"
      ? raw
      : typeof raw === "string"
        ? Number(raw.trim())
        : Number.NaN;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
