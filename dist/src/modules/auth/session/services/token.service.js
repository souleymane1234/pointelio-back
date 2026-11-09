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
exports.TokenService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const audit_actions_service_1 = require("../../../audit/recorder/services/audit-actions.service");
const prisma_service_1 = require("../../../../infra/prisma/prisma.service");
const i18n_1 = require("../../../../common/i18n");
const response_util_1 = require("../../../../common/utils/response.util");
const jwt_subject_util_1 = require("../../../../common/utils/jwt-subject.util");
const auth_token_revocation_store_1 = require("./auth-token-revocation.store");
const auth_user_session_service_1 = require("./auth-user-session.service");
const login_select_1 = require("./login.select");
const jwt_expiry_config_1 = require("../config/jwt-expiry.config");
let TokenService = class TokenService {
    jwtService;
    prisma;
    auditActions;
    tokenRevocation;
    authUserSession;
    constructor(jwtService, prisma, auditActions, tokenRevocation, authUserSession) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.auditActions = auditActions;
        this.tokenRevocation = tokenRevocation;
        this.authUserSession = authUserSession;
    }
    signTokenPair(userId, role) {
        const sub = String(userId);
        return {
            accessToken: this.jwtService.sign({ sub, type: "access", role }, { expiresIn: (0, jwt_expiry_config_1.getJwtAccessExpiresInSeconds)(), jwtid: (0, crypto_1.randomUUID)() }),
            refreshToken: this.jwtService.sign({ sub, type: "refresh" }, { expiresIn: (0, jwt_expiry_config_1.getJwtRefreshExpiresInSeconds)(), jwtid: (0, crypto_1.randomUUID)() }),
        };
    }
    buildAuthResponse(user) {
        const tokens = this.signTokenPair(user.id, user.role);
        const profile = {
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
    async refresh(refreshToken, locale) {
        const refreshInvalid = () => new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "refreshInvalid")], undefined, locale));
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken);
        }
        catch {
            throw refreshInvalid();
        }
        const userId = (0, jwt_subject_util_1.parseJwtUserId)(payload.sub);
        if (payload.type !== "refresh" || !userId) {
            throw refreshInvalid();
        }
        const remainingTtlSec = payload.exp
            ? payload.exp - Math.floor(Date.now() / 1000)
            : (0, jwt_expiry_config_1.getJwtRefreshExpiresInSeconds)();
        if (!(await this.tokenRevocation.consume(refreshToken, remainingTtlSec))) {
            throw refreshInvalid();
        }
        const user = await this.prisma.utilisateur.findUnique({
            where: { id: userId },
            select: { id: true, role: true, statut: true },
        });
        if (!user || user.statut !== client_1.StatutCompte.ACTIF) {
            throw refreshInvalid();
        }
        await this.auditActions.authRefreshToken(user.id);
        this.authUserSession.touchLastLoginAt(user.id);
        return this.signTokenPair(user.id, user.role);
    }
    async findAuthUser(userId) {
        return this.prisma.utilisateur.findUnique({
            where: { id: userId },
            select: login_select_1.authUserSelect,
        });
    }
    async verifyAccessTokenAndGetUser(token) {
        const result = await this.verifyAccessTokenDiagnose(token);
        return result.ok ? result.user : null;
    }
    async verifyAccessTokenAndGetUserId(token) {
        const user = await this.verifyAccessTokenAndGetUser(token);
        return user?.id ?? null;
    }
    async verifyAccessTokenDiagnose(token) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token);
        }
        catch (e) {
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
        const userId = (0, jwt_subject_util_1.parseJwtUserId)(payload.sub);
        const user = userId
            ? await this.prisma.utilisateur.findUnique({
                where: { id: userId },
                select: { id: true, role: true, statut: true, entrepriseId: true },
            })
            : null;
        if (!user || user.statut !== client_1.StatutCompte.ACTIF) {
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
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        audit_actions_service_1.AuditActionsService,
        auth_token_revocation_store_1.AuthTokenRevocationStore,
        auth_user_session_service_1.AuthUserSessionService])
], TokenService);
//# sourceMappingURL=token.service.js.map