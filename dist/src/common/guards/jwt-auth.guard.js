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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const i18n_1 = require("../i18n");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const auth_constants_1 = require("../constants/auth.constants");
const auth_token_revocation_store_1 = require("../../modules/auth/session/services/auth-token-revocation.store");
const bearer_token_util_1 = require("../../modules/auth/session/utils/bearer-token.util");
const jwt_subject_util_1 = require("../utils/jwt-subject.util");
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    reflector;
    prisma;
    tokenRevocation;
    constructor(jwtService, reflector, prisma, tokenRevocation) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.prisma = prisma;
        this.tokenRevocation = tokenRevocation;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const locale = this.locale(request);
        const isPublic = this.reflector.getAllAndOverride(auth_constants_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const path = request.path || request.url.split("?")[0];
        if (isPublic || this.isDocsOrOpenApiPath(path)) {
            const token = (0, bearer_token_util_1.extractBearerToken)(request);
            if (token) {
                try {
                    await this.attachUserFromToken(request, token, locale);
                }
                catch (e) {
                    if (!isPublic) {
                        throw e;
                    }
                }
            }
            return true;
        }
        const token = (0, bearer_token_util_1.extractBearerToken)(request);
        if (!token) {
            throw new common_1.UnauthorizedException((0, i18n_1.translate)(locale, "tokenMissing"));
        }
        try {
            await this.attachUserFromToken(request, token, locale);
            return true;
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException ||
                e instanceof common_1.ForbiddenException) {
                throw e;
            }
            throw new common_1.UnauthorizedException((0, i18n_1.translate)(locale, "tokenInvalidOrExpired"));
        }
    }
    async attachUserFromToken(request, token, locale) {
        const payload = await this.jwtService.verifyAsync(token);
        if (payload.type && payload.type !== "access") {
            throw new common_1.UnauthorizedException((0, i18n_1.translate)(locale, "tokenInvalid"));
        }
        if (await this.tokenRevocation.isRevoked(token)) {
            throw new common_1.UnauthorizedException((0, i18n_1.translate)(locale, "tokenInvalidOrExpired"));
        }
        const { user, tenant } = await this.resolveUser(payload, locale);
        request.user = user;
        request.tenant = tenant;
    }
    async resolveUser(payload, locale) {
        const id = (0, jwt_subject_util_1.parseJwtUserId)(payload.sub);
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
        if (!row || row.statut !== client_1.StatutCompte.ACTIF) {
            throw new common_1.UnauthorizedException((0, i18n_1.translate)(locale, "tokenInvalidOrExpired"));
        }
        return {
            user: { id: row.id, role: row.role, entrepriseId: row.entrepriseId },
            tenant: row.entrepriseId !== null && row.entreprise
                ? {
                    entrepriseId: row.entrepriseId,
                    statut: row.entreprise.statut,
                    dateEcheance: row.entreprise.dateEcheance,
                }
                : undefined,
        };
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
    isDocsOrOpenApiPath(path) {
        return /\/docs(\/|$)/.test(path) || path.includes("docs-json");
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        prisma_service_1.PrismaService,
        auth_token_revocation_store_1.AuthTokenRevocationStore])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map