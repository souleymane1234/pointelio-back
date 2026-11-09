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
exports.HorairesService = void 0;
const common_1 = require("@nestjs/common");
const pack_modules_constants_1 = require("../../common/constants/pack-modules.constants");
const i18n_1 = require("../../common/i18n");
const response_util_1 = require("../../common/utils/response.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const audit_actions_constants_1 = require("../audit/shared/audit-actions.constants");
const entitlements_service_1 = require("../entitlements/entitlements.service");
const HORAIRE_SELECT = {
    id: true,
    entrepriseId: true,
    nom: true,
    heureDebut: true,
    heureFin: true,
    toleranceMin: true,
    joursTravail: true,
    createdAt: true,
    _count: { select: { utilisateurs: true } },
};
function normalizeHoraire(row) {
    const { _count, ...horaire } = row;
    return {
        ...horaire,
        joursTravail: Array.isArray(horaire.joursTravail)
            ? horaire.joursTravail.filter((j) => typeof j === "number")
            : [],
        utilisateursCount: _count.utilisateurs,
    };
}
let HorairesService = class HorairesService {
    prisma;
    entitlements;
    auditActions;
    constructor(prisma, entitlements, auditActions) {
        this.prisma = prisma;
        this.entitlements = entitlements;
        this.auditActions = auditActions;
    }
    async findAll(entrepriseId) {
        const rows = await this.prisma.tenant.horaire.findMany({
            where: { entrepriseId },
            select: HORAIRE_SELECT,
            orderBy: { nom: "asc" },
        });
        return rows.map(normalizeHoraire);
    }
    async findOne(entrepriseId, id, locale) {
        const horaire = await this.prisma.tenant.horaire.findFirst({
            where: { id, entrepriseId },
            select: HORAIRE_SELECT,
        });
        if (!horaire) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "horaireNotFound"));
        }
        return normalizeHoraire(horaire);
    }
    async create(acteurId, entrepriseId, dto, locale) {
        const existing = await this.prisma.tenant.horaire.count({
            where: { entrepriseId },
        });
        if (existing >= 1) {
            await this.entitlements.assertModule(entrepriseId, pack_modules_constants_1.PACK_MODULES.HORAIRES_MULTIPLES, locale);
        }
        const horaire = await this.prisma.tenant.horaire.create({
            data: { ...dto, entrepriseId },
            select: HORAIRE_SELECT,
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.HORAIRE_CREE, horaire, {
            nom: horaire.nom,
        });
        return normalizeHoraire(horaire);
    }
    async update(acteurId, entrepriseId, id, dto, locale) {
        if (Object.values(dto).every((value) => value === undefined)) {
            throw this.invalid("horaireUpdateEmpty", locale);
        }
        await this.findOne(entrepriseId, id, locale);
        const horaire = await this.prisma.tenant.horaire.update({
            where: { id, entrepriseId },
            data: dto,
            select: HORAIRE_SELECT,
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.HORAIRE_MODIFIE, horaire, {
            updatedFields: Object.keys(dto),
        });
        return normalizeHoraire(horaire);
    }
    async remove(acteurId, entrepriseId, id, locale) {
        const horaire = await this.findOne(entrepriseId, id, locale);
        if (horaire.utilisateursCount > 0) {
            throw this.invalid("horaireEnUtilisation", locale, {
                count: horaire.utilisateursCount,
            });
        }
        await this.prisma.tenant.horaire.delete({ where: { id, entrepriseId } });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.HORAIRE_SUPPRIME, horaire, {
            nom: horaire.nom,
        });
    }
    audit(acteurId, action, horaire, details) {
        return this.auditActions.domainAction({
            acteurId,
            action,
            objet: audit_actions_constants_1.AUDIT_OBJETS.HORAIRE,
            objetId: horaire.id,
            entrepriseId: horaire.entrepriseId,
            details,
        });
    }
    invalid(key, locale, params) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key, params)], undefined, locale));
    }
};
exports.HorairesService = HorairesService;
exports.HorairesService = HorairesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        entitlements_service_1.EntitlementsService,
        audit_actions_service_1.AuditActionsService])
], HorairesService);
//# sourceMappingURL=horaires.service.js.map