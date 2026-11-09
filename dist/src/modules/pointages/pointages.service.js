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
exports.PointagesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../common/i18n");
const pagination_util_1 = require("../../common/utils/pagination.util");
const response_util_1 = require("../../common/utils/response.util");
const zoned_time_util_1 = require("../../common/utils/zoned-time.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const audit_actions_constants_1 = require("../audit/shared/audit-actions.constants");
const anomalies_constants_1 = require("./anomalies.constants");
const pointage_select_1 = require("./pointage.select");
const pointage_sequence_util_1 = require("./pointage-sequence.util");
const validation_gps_service_1 = require("./validation-gps.service");
let PointagesService = class PointagesService {
    prisma;
    gps;
    auditActions;
    constructor(prisma, gps, auditActions) {
        this.prisma = prisma;
        this.gps = gps;
        this.auditActions = auditActions;
    }
    async timeZone(entrepriseId) {
        const entreprise = await this.prisma.entreprise.findUnique({
            where: { id: entrepriseId },
            select: { fuseauHoraire: true },
        });
        return (0, zoned_time_util_1.safeTimeZone)(entreprise?.fuseauHoraire);
    }
    async pointerQr(user, entrepriseId, dto, locale) {
        const existing = await this.findByRequestId(entrepriseId, dto.requestId);
        if (existing) {
            const tz = await this.timeZone(entrepriseId);
            return {
                replay: true,
                pointage: await this.normalizeOne(existing, tz),
            };
        }
        const site = await this.prisma.tenant.site.findFirst({
            where: { qrToken: dto.qrToken, entrepriseId },
            select: {
                id: true,
                actif: true,
                latitude: true,
                longitude: true,
                rayonM: true,
                precisionMaxM: true,
            },
        });
        if (!site) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "pointageQrInvalide")], undefined, locale));
        }
        if (!site.actif) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "pointageSiteInactif")], undefined, locale));
        }
        await this.assertSequence(entrepriseId, user.id, dto.type, locale);
        const gps = this.gps.evaluate({
            latitude: dto.latitude,
            longitude: dto.longitude,
            precisionM: dto.precisionM,
            mockDetecte: dto.mockDetecte === true,
        }, {
            latitude: Number(site.latitude),
            longitude: Number(site.longitude),
            rayonM: site.rayonM,
            precisionMaxM: site.precisionMaxM,
        });
        const pointage = await this.createOrReplay({
            entrepriseId,
            acteurId: user.id,
            employeId: user.id,
            siteId: site.id,
            pointeParId: null,
            type: dto.type,
            methode: client_1.MethodePointage.QR_GPS,
            latitude: dto.latitude,
            longitude: dto.longitude,
            precisionM: dto.precisionM,
            distanceM: gps.distanceM,
            statutValidation: gps.statut,
            motifStatut: gps.motifStatut,
            mockDetecte: dto.mockDetecte === true,
            requestId: dto.requestId,
        });
        return pointage;
    }
    async findAll(user, entrepriseId, query) {
        const tz = await this.timeZone(entrepriseId);
        const scope = await this.scopeWhere(user, entrepriseId, query);
        const totalItems = await this.prisma.tenant.pointage.count({
            where: scope,
        });
        const { skip, perPage, pagination } = (0, pagination_util_1.buildPaginationQuery)(totalItems, query.page, query.per_page);
        const rows = await this.prisma.tenant.pointage.findMany({
            where: scope,
            select: pointage_select_1.POINTAGE_SELECT,
            orderBy: { heureServeur: "desc" },
            skip,
            take: perPage,
        });
        const data = await this.normalizeMany(rows, tz);
        return { data, pagination };
    }
    async findAnomalies(user, entrepriseId, query) {
        const tz = await this.timeZone(entrepriseId);
        const anomalie = query.anomalie;
        const base = await this.scopeWhere(user, entrepriseId, query);
        if (anomalie === anomalies_constants_1.ANOMALIE.RETARD || anomalie === anomalies_constants_1.ANOMALIE.OUBLI_DEPART) {
            return this.findComputedAnomalies(base, tz, anomalie, query.page, query.per_page);
        }
        const where = { ...base };
        if (anomalie === anomalies_constants_1.ANOMALIE.HORS_ZONE) {
            where.statutValidation = client_1.StatutValidation.HORS_ZONE;
        }
        else if (anomalie === anomalies_constants_1.ANOMALIE.A_VERIFIER) {
            where.statutValidation = client_1.StatutValidation.A_VERIFIER;
        }
        else {
            where.statutValidation = {
                in: [client_1.StatutValidation.A_VERIFIER, client_1.StatutValidation.HORS_ZONE],
            };
        }
        const totalItems = await this.prisma.tenant.pointage.count({ where });
        const { skip, perPage, pagination } = (0, pagination_util_1.buildPaginationQuery)(totalItems, query.page, query.per_page);
        const rows = await this.prisma.tenant.pointage.findMany({
            where,
            select: pointage_select_1.POINTAGE_SELECT,
            orderBy: { heureServeur: "desc" },
            skip,
            take: perPage,
        });
        return { data: await this.normalizeMany(rows, tz), pagination };
    }
    async findOne(user, entrepriseId, id, locale) {
        const row = await this.prisma.tenant.pointage.findFirst({
            where: { id, entrepriseId },
            select: pointage_select_1.POINTAGE_SELECT,
        });
        if (!row) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "pointageNotFound"));
        }
        this.assertCanRead(user, row);
        await this.assertCanReadSite(user, entrepriseId, row.siteId);
        const tz = await this.timeZone(entrepriseId);
        return this.normalizeOne(row, tz);
    }
    async findByRequestId(entrepriseId, requestId) {
        return this.prisma.tenant.pointage.findFirst({
            where: { entrepriseId, requestId },
            select: pointage_select_1.POINTAGE_SELECT,
        });
    }
    async assertSequence(entrepriseId, employeId, type, locale) {
        const tz = await this.timeZone(entrepriseId);
        const { start, end } = (0, zoned_time_util_1.zonedDayBounds)(new Date(), tz);
        const last = await this.prisma.tenant.pointage.findFirst({
            where: {
                entrepriseId,
                employeId,
                heureServeur: { gte: start, lt: end },
            },
            orderBy: { heureServeur: "desc" },
            select: { type: true },
        });
        const attendu = (0, pointage_sequence_util_1.nextTypeAttendu)(last?.type);
        if (type !== attendu) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([
                (0, i18n_1.translate)(locale, "pointageSequenceInvalide", {
                    attendu,
                    dernier: last?.type ?? "aucun",
                }),
            ], undefined, locale));
        }
    }
    async createOrReplay(input) {
        const existing = await this.findByRequestId(input.entrepriseId, input.requestId);
        if (existing) {
            const tz = await this.timeZone(input.entrepriseId);
            return {
                replay: true,
                pointage: await this.normalizeOne(existing, tz),
            };
        }
        try {
            const created = await this.prisma.tenant.pointage.create({
                data: {
                    entrepriseId: input.entrepriseId,
                    employeId: input.employeId,
                    siteId: input.siteId,
                    pointeParId: input.pointeParId,
                    type: input.type,
                    methode: input.methode,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    precisionM: input.precisionM,
                    distanceM: input.distanceM,
                    statutValidation: input.statutValidation,
                    motifStatut: input.motifStatut,
                    mockDetecte: input.mockDetecte,
                    requestId: input.requestId,
                },
                select: pointage_select_1.POINTAGE_SELECT,
            });
            await this.auditActions.domainAction({
                acteurId: input.acteurId,
                action: audit_actions_constants_1.AUDIT_ACTIONS.POINTAGE_CREE,
                objet: audit_actions_constants_1.AUDIT_OBJETS.POINTAGE,
                objetId: String(created.id),
                entrepriseId: created.entrepriseId,
                details: {
                    type: created.type,
                    methode: created.methode,
                    statutValidation: created.statutValidation,
                },
            });
            const tz = await this.timeZone(input.entrepriseId);
            return {
                replay: false,
                pointage: await this.normalizeOne(created, tz),
            };
        }
        catch (error) {
            if (isUniqueConstraint(error)) {
                const replayed = await this.findByRequestId(input.entrepriseId, input.requestId);
                if (replayed) {
                    const tz = await this.timeZone(input.entrepriseId);
                    return {
                        replay: true,
                        pointage: await this.normalizeOne(replayed, tz),
                    };
                }
            }
            throw error;
        }
    }
    async requireActifEmploye(entrepriseId, employeId, siteId, locale) {
        const employe = await this.prisma.tenant.utilisateur.findFirst({
            where: { id: employeId, entrepriseId },
            select: { id: true, role: true, statut: true, siteId: true },
        });
        if (!employe ||
            employe.role !== client_1.Role.EMPLOYE ||
            employe.statut !== client_1.StatutCompte.ACTIF ||
            employe.siteId !== siteId) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "pointageEmployeInvalide")], undefined, locale));
        }
        return employe;
    }
    async actorSiteId(userId, entrepriseId, locale) {
        const actor = await this.prisma.tenant.utilisateur.findFirst({
            where: { id: userId, entrepriseId },
            select: { siteId: true },
        });
        if (!actor?.siteId) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "pointageSurveillantSansSite")], undefined, locale));
        }
        return actor.siteId;
    }
    assertCanRead(user, row) {
        if (user.role === client_1.Role.EMPLOYE && row.employeId !== user.id) {
            throw new common_1.ForbiddenException();
        }
    }
    async assertCanReadSite(user, entrepriseId, siteId) {
        if (user.role !== client_1.Role.SURVEILLANT)
            return;
        const actor = await this.prisma.tenant.utilisateur.findFirst({
            where: { id: user.id, entrepriseId },
            select: { siteId: true },
        });
        if (actor?.siteId !== siteId) {
            throw new common_1.ForbiddenException();
        }
    }
    async scopeWhere(user, entrepriseId, query) {
        const where = { entrepriseId };
        if (user.role === client_1.Role.EMPLOYE) {
            where.employeId = user.id;
        }
        else if (query.employeId) {
            where.employeId = query.employeId;
        }
        if (user.role === client_1.Role.SURVEILLANT) {
            const actor = await this.prisma.tenant.utilisateur.findFirst({
                where: { id: user.id, entrepriseId },
                select: { siteId: true },
            });
            where.siteId = actor?.siteId ?? -1;
        }
        else if (query.siteId) {
            where.siteId = query.siteId;
        }
        if (query.type)
            where.type = query.type;
        if (query.methode)
            where.methode = query.methode;
        if (query.statutValidation)
            where.statutValidation = query.statutValidation;
        if (query.dateDebut || query.dateFin) {
            where.heureServeur = {
                ...(query.dateDebut ? { gte: new Date(query.dateDebut) } : {}),
                ...(query.dateFin ? { lte: new Date(query.dateFin) } : {}),
            };
        }
        return where;
    }
    async findComputedAnomalies(base, tz, anomalie, page, perPage) {
        const now = new Date();
        const where = {
            ...base,
            type: client_1.TypePointage.ARRIVEE,
        };
        if (anomalie === anomalies_constants_1.ANOMALIE.OUBLI_DEPART) {
            const current = where.heureServeur;
            const filter = current && typeof current === "object" && !Array.isArray(current)
                ? current
                : {};
            where.heureServeur = {
                ...filter,
                lt: (0, zoned_time_util_1.zonedDayBounds)(now, tz).start,
            };
        }
        const rows = await this.prisma.tenant.pointage.findMany({
            where,
            select: pointage_select_1.POINTAGE_SELECT,
            orderBy: { heureServeur: "desc" },
            take: 200,
        });
        const normalized = await this.normalizeMany(rows, tz, now);
        const filtered = normalized.filter((row) => row.anomalies.includes(anomalie));
        const { skip, perPage: take, pagination, } = (0, pagination_util_1.buildPaginationQuery)(filtered.length, page, perPage);
        return { data: filtered.slice(skip, skip + take), pagination };
    }
    async normalizeOne(row, tz, now = new Date()) {
        const [normalized] = await this.normalizeMany([row], tz, now);
        return normalized;
    }
    async normalizeMany(rows, tz, now = new Date()) {
        const flags = await this.journeeFlags(rows, tz);
        return rows.map((row) => (0, pointage_select_1.normalizePointage)(row, tz, flags.get(String(row.id)) ?? {
            hasArrivee: row.type === client_1.TypePointage.ARRIVEE,
            hasDepart: row.type === client_1.TypePointage.DEPART,
        }, now));
    }
    async journeeFlags(rows, tz) {
        const result = new Map();
        if (rows.length === 0)
            return result;
        const or = rows.map((row) => {
            const { start, end } = (0, zoned_time_util_1.zonedDayBounds)(row.heureServeur, tz);
            return {
                employeId: row.employeId,
                heureServeur: { gte: start, lt: end },
            };
        });
        const siblings = await this.prisma.tenant.pointage.findMany({
            where: { OR: or },
            select: { employeId: true, type: true, heureServeur: true },
        });
        for (const row of rows) {
            const { start, end } = (0, zoned_time_util_1.zonedDayBounds)(row.heureServeur, tz);
            const sameDay = siblings.filter((item) => item.employeId === row.employeId &&
                item.heureServeur >= start &&
                item.heureServeur < end);
            result.set(String(row.id), {
                hasArrivee: sameDay.some((item) => item.type === client_1.TypePointage.ARRIVEE),
                hasDepart: sameDay.some((item) => item.type === client_1.TypePointage.DEPART),
            });
        }
        return result;
    }
};
exports.PointagesService = PointagesService;
exports.PointagesService = PointagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        validation_gps_service_1.ValidationGpsService,
        audit_actions_service_1.AuditActionsService])
], PointagesService);
function isUniqueConstraint(error) {
    return (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002");
}
//# sourceMappingURL=pointages.service.js.map