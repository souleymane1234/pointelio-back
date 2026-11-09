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
exports.DeactivateAccountService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const admin_users_cache_config_1 = require("../../../utilisateurs/config/admin-users-cache.config");
const audit_actions_service_1 = require("../../../audit/recorder/services/audit-actions.service");
const i18n_1 = require("../../../../common/i18n");
const response_util_1 = require("../../../../common/utils/response.util");
const prisma_service_1 = require("../../../../infra/prisma/prisma.service");
const jwt_expiry_config_1 = require("../../session/config/jwt-expiry.config");
const auth_token_revocation_store_1 = require("../../session/services/auth-token-revocation.store");
let DeactivateAccountService = class DeactivateAccountService {
    jwtService;
    prisma;
    tokenRevocation;
    auditActions;
    constructor(jwtService, prisma, tokenRevocation, auditActions) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.tokenRevocation = tokenRevocation;
        this.auditActions = auditActions;
    }
    async deactivate(userId, accessToken, locale) {
        if (!accessToken.trim()) {
            throw new common_1.UnauthorizedException((0, i18n_1.translate)(locale, "tokenMissing"));
        }
        const user = await this.prisma.utilisateur.findUnique({
            where: { id: userId },
            select: { id: true, statut: true },
        });
        if (!user) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "userNotFound"));
        }
        if (user.statut === client_1.StatutCompte.DESACTIVE) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "accountAlreadyInactive")], undefined, locale));
        }
        await this.prisma.utilisateur.update({
            where: { id: userId },
            data: { statut: client_1.StatutCompte.DESACTIVE },
        });
        await this.tokenRevocation.revoke(accessToken, this.remainingTtlSec(accessToken, (0, jwt_expiry_config_1.getJwtAccessExpiresInSeconds)()));
        (0, admin_users_cache_config_1.bumpAdminUsersCacheGeneration)();
        await this.auditActions.authAccountDeactivate(userId);
    }
    remainingTtlSec(token, fallbackSec) {
        const decoded = this.jwtService.decode(token);
        if (decoded?.exp) {
            return Math.max(decoded.exp - Math.floor(Date.now() / 1000), 1);
        }
        return fallbackSec;
    }
};
exports.DeactivateAccountService = DeactivateAccountService;
exports.DeactivateAccountService = DeactivateAccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        auth_token_revocation_store_1.AuthTokenRevocationStore,
        audit_actions_service_1.AuditActionsService])
], DeactivateAccountService);
//# sourceMappingURL=deactivate-account.service.js.map