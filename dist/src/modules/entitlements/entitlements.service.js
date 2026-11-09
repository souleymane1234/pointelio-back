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
exports.EntitlementsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../common/i18n");
const response_util_1 = require("../../common/utils/response.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const entitlements_util_1 = require("./entitlements.util");
let EntitlementsService = class EntitlementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getForEntreprise(entrepriseId, locale) {
        const entreprise = await this.prisma.entreprise.findUnique({
            where: { id: entrepriseId },
            select: {
                id: true,
                statut: true,
                dateEcheance: true,
                maxSitesOverride: true,
                maxEmployesOverride: true,
                modulesOverride: true,
                pack: {
                    select: {
                        id: true,
                        code: true,
                        nom: true,
                        maxEmployes: true,
                        maxSites: true,
                        modules: true,
                    },
                },
            },
        });
        if (!entreprise) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "entrepriseNotFound"));
        }
        return (0, entitlements_util_1.computeEntitlements)(entreprise);
    }
    async getUsage(entrepriseId) {
        const [employes, sites] = await Promise.all([
            this.countEmployes(entrepriseId),
            this.prisma.site.count({ where: { entrepriseId, actif: true } }),
        ]);
        return { employes, sites };
    }
    async hasModule(entrepriseId, module) {
        const { modules } = await this.getForEntreprise(entrepriseId, "fr");
        return modules.includes(module);
    }
    async assertModule(entrepriseId, module, locale) {
        if (!(await this.hasModule(entrepriseId, module))) {
            throw new common_1.ForbiddenException((0, i18n_1.translate)(locale, "moduleNonInclus", { module }));
        }
    }
    async assertCanAddSite(entrepriseId, locale) {
        const [{ limites }, sites] = await Promise.all([
            this.getForEntreprise(entrepriseId, locale),
            this.prisma.site.count({ where: { entrepriseId, actif: true } }),
        ]);
        if (!(0, entitlements_util_1.withinLimit)(limites.maxSites, sites)) {
            throw this.limitReached("limiteSitesAtteinte", limites.maxSites, locale);
        }
    }
    async assertCanAddEmploye(entrepriseId, locale, ajout = 1) {
        const [{ limites }, employes] = await Promise.all([
            this.getForEntreprise(entrepriseId, locale),
            this.countEmployes(entrepriseId),
        ]);
        if (!(0, entitlements_util_1.withinLimit)(limites.maxEmployes, employes, ajout)) {
            throw this.limitReached("limiteEmployesAtteinte", limites.maxEmployes, locale);
        }
    }
    countEmployes(entrepriseId) {
        return this.prisma.utilisateur.count({
            where: {
                entrepriseId,
                role: { in: [...entitlements_util_1.ROLES_DECOMPTES_EMPLOYES] },
                statut: { not: client_1.StatutCompte.DESACTIVE },
            },
        });
    }
    limitReached(key, limit, locale) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key, { limit: limit ?? 0 })], undefined, locale));
    }
};
exports.EntitlementsService = EntitlementsService;
exports.EntitlementsService = EntitlementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EntitlementsService);
//# sourceMappingURL=entitlements.service.js.map