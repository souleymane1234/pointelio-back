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
exports.AbonnementsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../common/i18n");
const abonnement_util_1 = require("../../common/utils/abonnement.util");
const response_util_1 = require("../../common/utils/response.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const audit_actions_constants_1 = require("../audit/shared/audit-actions.constants");
const entitlements_service_1 = require("../entitlements/entitlements.service");
const entitlements_util_1 = require("../entitlements/entitlements.util");
const PACK_LIMITS_SELECT = {
    id: true,
    code: true,
    nom: true,
    actif: true,
    prixMensuel: true,
    maxEmployes: true,
    maxSites: true,
    modules: true,
};
let AbonnementsService = class AbonnementsService {
    prisma;
    entitlements;
    auditActions;
    constructor(prisma, entitlements, auditActions) {
        this.prisma = prisma;
        this.entitlements = entitlements;
        this.auditActions = auditActions;
    }
    async get(entrepriseId, locale) {
        const [droits, usage, entreprise] = await Promise.all([
            this.entitlements.getForEntreprise(entrepriseId, locale),
            this.entitlements.getUsage(entrepriseId),
            this.prisma.entreprise.findUnique({
                where: { id: entrepriseId },
                select: {
                    dateDemarrage: true,
                    pack: { select: { prixMensuel: true } },
                },
            }),
        ]);
        return {
            ...droits,
            dateDemarrage: entreprise?.dateDemarrage ?? null,
            prixMensuel: entreprise?.pack.prixMensuel ?? 0,
            bloque: (0, abonnement_util_1.isAbonnementBloque)(droits.statut, droits.dateEcheance),
            usage,
        };
    }
    async modifier(acteurId, entrepriseId, dto, locale) {
        if (Object.values(dto).every((value) => value === undefined)) {
            throw this.invalid("entrepriseUpdateEmpty", locale);
        }
        const current = await this.prisma.entreprise.findUnique({
            where: { id: entrepriseId },
            select: {
                id: true,
                statut: true,
                dateEcheance: true,
                maxSitesOverride: true,
                maxEmployesOverride: true,
                modulesOverride: true,
                pack: { select: PACK_LIMITS_SELECT },
            },
        });
        if (!current) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "entrepriseNotFound"));
        }
        const pack = dto.packId !== undefined && dto.packId !== current.pack.id
            ? await this.findActivePack(dto.packId, locale)
            : current.pack;
        const next = (0, entitlements_util_1.computeEntitlements)({
            ...current,
            pack,
            maxEmployesOverride: dto.maxEmployesOverride !== undefined
                ? dto.maxEmployesOverride
                : current.maxEmployesOverride,
            maxSitesOverride: dto.maxSitesOverride !== undefined
                ? dto.maxSitesOverride
                : current.maxSitesOverride,
            modulesOverride: dto.modulesOverride !== undefined
                ? dto.modulesOverride
                : current.modulesOverride,
        });
        const usage = await this.entitlements.getUsage(entrepriseId);
        if (!(0, entitlements_util_1.withinLimit)(next.limites.maxEmployes, usage.employes, 0) ||
            !(0, entitlements_util_1.withinLimit)(next.limites.maxSites, usage.sites, 0)) {
            throw this.invalid("abonnementLimitesInsuffisantes", locale, {
                employes: usage.employes,
                sites: usage.sites,
            });
        }
        await this.prisma.entreprise.update({
            where: { id: entrepriseId },
            data: {
                ...(dto.packId !== undefined ? { packId: pack.id } : {}),
                ...(dto.statut !== undefined ? { statut: dto.statut } : {}),
                ...(dto.dateEcheance !== undefined
                    ? {
                        dateEcheance: dto.dateEcheance
                            ? new Date(dto.dateEcheance)
                            : null,
                    }
                    : {}),
                ...(dto.maxEmployesOverride !== undefined
                    ? { maxEmployesOverride: dto.maxEmployesOverride }
                    : {}),
                ...(dto.maxSitesOverride !== undefined
                    ? { maxSitesOverride: dto.maxSitesOverride }
                    : {}),
                ...(dto.modulesOverride !== undefined
                    ? { modulesOverride: dto.modulesOverride ?? client_1.Prisma.DbNull }
                    : {}),
            },
        });
        await this.auditActions.domainAction({
            acteurId,
            action: audit_actions_constants_1.AUDIT_ACTIONS.ABONNEMENT_MODIFIE,
            objet: audit_actions_constants_1.AUDIT_OBJETS.ENTREPRISE,
            objetId: entrepriseId,
            entrepriseId,
            details: {
                updatedFields: Object.keys(dto),
                fromPack: current.pack.code,
                toPack: pack.code,
            },
        });
        return this.get(entrepriseId, locale);
    }
    async findActivePack(packId, locale) {
        const pack = await this.prisma.pack.findUnique({
            where: { id: packId },
            select: PACK_LIMITS_SELECT,
        });
        if (!pack)
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "packNotFound"));
        if (!pack.actif)
            throw this.invalid("packInactif", locale);
        return pack;
    }
    invalid(key, locale, params) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key, params)], undefined, locale));
    }
};
exports.AbonnementsService = AbonnementsService;
exports.AbonnementsService = AbonnementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        entitlements_service_1.EntitlementsService,
        audit_actions_service_1.AuditActionsService])
], AbonnementsService);
//# sourceMappingURL=abonnements.service.js.map