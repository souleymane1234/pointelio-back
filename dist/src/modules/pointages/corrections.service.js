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
exports.CorrectionsService = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../../common/i18n");
const response_util_1 = require("../../common/utils/response.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const audit_actions_constants_1 = require("../audit/shared/audit-actions.constants");
const pointage_select_1 = require("./pointage.select");
const pointages_service_1 = require("./pointages.service");
let CorrectionsService = class CorrectionsService {
    prisma;
    pointages;
    auditActions;
    constructor(prisma, pointages, auditActions) {
        this.prisma = prisma;
        this.pointages = pointages;
        this.auditActions = auditActions;
    }
    async list(user, entrepriseId, pointageId, locale) {
        await this.pointages.findOne(user, entrepriseId, pointageId, locale);
        const rows = await this.prisma.pointageCorrection.findMany({
            where: { pointageId },
            select: pointage_select_1.CORRECTION_SELECT,
            orderBy: { createdAt: "asc" },
        });
        return rows.map(pointage_select_1.normalizeCorrection);
    }
    async corriger(user, entrepriseId, pointageId, dto, locale) {
        const { motif, ...patch } = dto;
        if (patch.type === undefined &&
            patch.siteId === undefined &&
            patch.heureServeur === undefined &&
            patch.statutValidation === undefined &&
            patch.motifStatut === undefined) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "pointageCorrectionEmpty")], undefined, locale));
        }
        const current = await this.prisma.tenant.pointage.findFirst({
            where: { id: pointageId, entrepriseId },
            select: pointage_select_1.POINTAGE_SELECT,
        });
        if (!current) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "pointageNotFound"));
        }
        this.pointages.assertCanRead(user, current);
        await this.pointages.assertCanReadSite(user, entrepriseId, current.siteId);
        if (patch.siteId !== undefined) {
            const site = await this.prisma.tenant.site.findFirst({
                where: { id: patch.siteId, entrepriseId },
                select: { id: true },
            });
            if (!site) {
                throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "siteNotFound")], undefined, locale));
            }
        }
        const avant = (0, pointage_select_1.snapshotPointage)(current);
        const data = {};
        if (patch.type !== undefined)
            data.type = patch.type;
        if (patch.siteId !== undefined)
            data.siteId = patch.siteId;
        if (patch.heureServeur !== undefined) {
            data.heureServeur = new Date(patch.heureServeur);
        }
        if (patch.statutValidation !== undefined) {
            data.statutValidation = patch.statutValidation;
        }
        if (patch.motifStatut !== undefined)
            data.motifStatut = patch.motifStatut;
        const [updated, correction] = await this.prisma.$transaction([
            this.prisma.pointage.update({
                where: { id: pointageId, entrepriseId },
                data,
                select: pointage_select_1.POINTAGE_SELECT,
            }),
            this.prisma.pointageCorrection.create({
                data: {
                    pointageId,
                    auteurId: user.id,
                    motif,
                    avant,
                    apres: {
                        ...avant,
                        ...(patch.type !== undefined ? { type: patch.type } : {}),
                        ...(patch.siteId !== undefined ? { siteId: patch.siteId } : {}),
                        ...(patch.heureServeur !== undefined
                            ? { heureServeur: new Date(patch.heureServeur).toISOString() }
                            : {}),
                        ...(patch.statutValidation !== undefined
                            ? { statutValidation: patch.statutValidation }
                            : {}),
                        ...(patch.motifStatut !== undefined
                            ? { motifStatut: patch.motifStatut }
                            : {}),
                    },
                },
                select: pointage_select_1.CORRECTION_SELECT,
            }),
        ]);
        await this.auditActions.domainAction({
            acteurId: user.id,
            action: audit_actions_constants_1.AUDIT_ACTIONS.POINTAGE_CORRIGE,
            objet: audit_actions_constants_1.AUDIT_OBJETS.POINTAGE,
            objetId: String(updated.id),
            entrepriseId,
            details: { motif, correctionId: correction.id },
        });
        return (0, pointage_select_1.normalizeCorrection)(correction);
    }
};
exports.CorrectionsService = CorrectionsService;
exports.CorrectionsService = CorrectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pointages_service_1.PointagesService,
        audit_actions_service_1.AuditActionsService])
], CorrectionsService);
//# sourceMappingURL=corrections.service.js.map