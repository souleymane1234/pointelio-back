"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketAuthService = void 0;
exports.parsePlainUserId = parsePlainUserId;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const token_service_1 = require("../../../modules/auth/session/services/token.service");
let SocketAuthService = class SocketAuthService {
    tokenService;
    config;
    constructor(tokenService, config) {
        this.tokenService = tokenService;
        this.config = config;
    }
    async resolveAuthenticatedUserId(client) {
        if (this.isPlainUserIdAllowed()) {
            const plain = this.extractPlainUserId(client);
            if (plain)
                return plain;
        }
        const token = this.extractBearerToken(client);
        if (!token)
            return null;
        return this.tokenService.verifyAccessTokenAndGetUserId(token);
    }
    async resolveAuthenticatedUser(client) {
        const token = this.extractBearerToken(client);
        if (!token)
            return null;
        return this.tokenService.verifyAccessTokenAndGetUser(token);
    }
    verifyAccessTokenAndGetUserId(token) {
        return this.tokenService.verifyAccessTokenAndGetUserId(token);
    }
    isPlainUserIdAllowed() {
        return (this.config.get("SOCKET_AUTH_ALLOW_PLAIN_USERID", "false") ===
            "true");
    }
    extractPlainUserId(client) {
        return (parsePlainUserId(client.handshake.auth?.userId) ??
            parsePlainUserId(client.handshake.query?.userId));
    }
    extractBearerToken(client) {
        const auth = client.handshake.auth;
        const fromAuthToken = typeof auth?.token === "string" ? auth.token.trim() : "";
        if (fromAuthToken)
            return fromAuthToken;
        const fromAccess = typeof auth?.accessToken === "string" ? auth.accessToken.trim() : "";
        if (fromAccess)
            return fromAccess;
        const rawHeader = client.handshake.headers.authorization;
        const header = typeof rawHeader === "string"
            ? rawHeader
            : Array.isArray(rawHeader)
                ? rawHeader[0]
                : "";
        const m = header.match(/^Bearer\s+(.+)$/i);
        if (m?.[1]?.trim())
            return m[1].trim();
        const q = client.handshake.query?.token;
        const fromQuery = typeof q === "string" ? q.trim() : "";
        if (fromQuery)
            return fromQuery;
        return null;
    }
    buildHandshakeDebug(client) {
        const auth = client.handshake.auth;
        const authKeys = auth ? Object.keys(auth) : [];
        const q = client.handshake.query;
        const stringifyAuthValue = (key, value) => {
            if (typeof value !== "string")
                return `[${typeof value}]`;
            const lower = key.toLowerCase();
            if (/token|secret|password|authorization|bearer/i.test(lower)) {
                return this.redactJwtLike(value);
            }
            return value.length > 120 ? `${value.slice(0, 120)}…` : value;
        };
        const authEntries = {};
        for (const key of authKeys) {
            authEntries[key] = stringifyAuthValue(key, auth?.[key]);
        }
        const queryKeys = q && typeof q === "object" && !Array.isArray(q) ? Object.keys(q) : [];
        const querySummary = {};
        for (const key of queryKeys) {
            const raw = q[key];
            const val = typeof raw === "string"
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
        const authz = typeof rawAuthz === "string"
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
    redactJwtLike(value) {
        const len = value.length;
        const preview = this.config.get("SOCKET_LOG_JWT_PREVIEW", "false") === "true";
        if (!preview || len === 0)
            return `[string len=${len}]`;
        if (len <= 24)
            return `[len=${len} value=<court>]`;
        return `[len=${len} prefix=${value.slice(0, 12)}… suffix=…${value.slice(-8)}]`;
    }
    async describeAuthFailure(client) {
        const handshake = this.buildHandshakeDebug(client);
        const token = this.extractBearerToken(client);
        if (!token) {
            return {
                summary: "aucun_bearer_extrait (auth.token, auth.accessToken, Authorization Bearer, query.token)",
                handshake,
            };
        }
        const diag = await this.tokenService.verifyAccessTokenDiagnose(token);
        if (diag.ok) {
            return {
                summary: "incoherent_jwt_et_user_ok_mais_auth_refusee (signaler au backend)",
                handshake,
            };
        }
        const summary = diag.detail ? `${diag.reason}:${diag.detail}` : diag.reason;
        return { summary, handshake };
    }
};
exports.SocketAuthService = SocketAuthService;
exports.SocketAuthService = SocketAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [token_service_1.TokenService,
        config_1.ConfigService])
], SocketAuthService);
function parsePlainUserId(raw) {
    const id = typeof raw === "number"
        ? raw
        : typeof raw === "string"
            ? Number(raw.trim())
            : Number.NaN;
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}
//# sourceMappingURL=socket-auth.service.js.map