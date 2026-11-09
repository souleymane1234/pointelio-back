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
exports.LogoutService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const audit_actions_service_1 = require("../../../audit/recorder/services/audit-actions.service");
const i18n_1 = require("../../../../common/i18n");
const auth_token_revocation_store_1 = require("./auth-token-revocation.store");
const jwt_expiry_config_1 = require("../config/jwt-expiry.config");
let LogoutService = class LogoutService {
    jwtService;
    tokenRevocation;
    auditActions;
    constructor(jwtService, tokenRevocation, auditActions) {
        this.jwtService = jwtService;
        this.tokenRevocation = tokenRevocation;
        this.auditActions = auditActions;
    }
    async logout(userId, accessToken, refreshToken, locale) {
        if (!accessToken.trim()) {
            throw new common_1.UnauthorizedException((0, i18n_1.translate)(locale, "tokenMissing"));
        }
        await this.tokenRevocation.revoke(accessToken, this.remainingTtlSec(accessToken, this.accessFallbackTtlSec()));
        const trimmedRefresh = refreshToken?.trim();
        if (trimmedRefresh) {
            await this.tokenRevocation.revoke(trimmedRefresh, this.remainingTtlSec(trimmedRefresh, this.refreshFallbackTtlSec()));
        }
        await this.auditActions.authLogout(userId, {
            refreshTokenRevoked: Boolean(trimmedRefresh),
        });
    }
    remainingTtlSec(token, fallbackSec) {
        const decoded = this.jwtService.decode(token);
        if (decoded?.exp) {
            return Math.max(decoded.exp - Math.floor(Date.now() / 1000), 1);
        }
        return fallbackSec;
    }
    accessFallbackTtlSec() {
        return (0, jwt_expiry_config_1.getJwtAccessExpiresInSeconds)();
    }
    refreshFallbackTtlSec() {
        return (0, jwt_expiry_config_1.getJwtRefreshExpiresInSeconds)();
    }
};
exports.LogoutService = LogoutService;
exports.LogoutService = LogoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        auth_token_revocation_store_1.AuthTokenRevocationStore,
        audit_actions_service_1.AuditActionsService])
], LogoutService);
//# sourceMappingURL=logout.service.js.map