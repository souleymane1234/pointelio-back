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
exports.SitesService = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../../common/i18n");
const pagination_util_1 = require("../../common/utils/pagination.util");
const response_util_1 = require("../../common/utils/response.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const audit_actions_constants_1 = require("../audit/shared/audit-actions.constants");
const entitlements_service_1 = require("../entitlements/entitlements.service");
const qr_service_1 = require("./qr.service");
const site_horaires_util_1 = require("./site-horaires.util");
const SITE_SELECT = {
    id: true,
    entrepriseId: true,
    nom: true,
    adresse: true,
    latitude: true,
    longitude: true,
    rayonM: true,
    precisionMaxM: true,
    toleranceMin: true,
    horairesJours: true,
    qrToken: true,
    actif: true,
    createdAt: true,
    updatedAt: true,
    _count: { select: { employes: true } },
};
function normalizeSite(row) {
    const { _count, ...site } = row;
    const horairesJours = (0, site_horaires_util_1.parseHorairesJours)(site.horairesJours);
    return {
        ...site,
        latitude: Number(site.latitude),
        longitude: Number(site.longitude),
        horairesJours,
        joursTravail: horairesJours.map((j) => j.jour),
        employesCount: _count.employes,
    };
}
let SitesService = class SitesService {
    prisma;
    entitlements;
    qr;
    auditActions;
    constructor(prisma, entitlements, qr, auditActions) {
        this.prisma = prisma;
        this.entitlements = entitlements;
        this.qr = qr;
        this.auditActions = auditActions;
    }
    async findAll(entrepriseId, query) {
        const where = { entrepriseId };
        if (query.actif !== undefined)
            where.actif = query.actif;
        if (query.search) {
            where.OR = [
                { nom: { contains: query.search } },
                { adresse: { contains: query.search } },
            ];
        }
        const totalItems = await this.prisma.tenant.site.count({ where });
        const { skip, perPage, pagination } = (0, pagination_util_1.buildPaginationQuery)(totalItems, query.page, query.per_page);
        const rows = await this.prisma.tenant.site.findMany({
            where,
            select: SITE_SELECT,
            orderBy: [{ actif: "desc" }, { nom: "asc" }],
            skip,
            take: perPage,
        });
        return { data: rows.map(normalizeSite), pagination };
    }
    async findOne(entrepriseId, id, locale) {
        const site = await this.prisma.tenant.site.findFirst({
            where: { id, entrepriseId },
            select: SITE_SELECT,
        });
        if (!site) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "siteNotFound"));
        }
        return normalizeSite(site);
    }
    async create(acteurId, entrepriseId, dto, locale) {
        await this.entitlements.assertCanAddSite(entrepriseId, locale);
        const { horairesJours: rawHoraires, ...rest } = dto;
        const horairesJours = this.requireHoraires(rawHoraires, locale);
        const site = await this.prisma.tenant.site.create({
            data: {
                ...rest,
                horairesJours,
                entrepriseId,
                qrToken: this.qr.generateToken(),
            },
            select: SITE_SELECT,
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.SITE_CREE, site, {
            nom: site.nom,
        });
        return normalizeSite(site);
    }
    async update(acteurId, entrepriseId, id, dto, locale) {
        if (Object.values(dto).every((value) => value === undefined)) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "siteUpdateEmpty")], undefined, locale));
        }
        const current = await this.findOne(entrepriseId, id, locale);
        if (dto.actif === true && !current.actif) {
            await this.entitlements.assertCanAddSite(entrepriseId, locale);
        }
        const { horairesJours: rawHoraires, ...rest } = dto;
        const data = { ...rest };
        if (rawHoraires !== undefined) {
            data.horairesJours = this.requireHoraires(rawHoraires, locale);
        }
        const site = await this.prisma.tenant.site.update({
            where: { id, entrepriseId },
            data,
            select: SITE_SELECT,
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.SITE_MODIFIE, site, {
            updatedFields: Object.keys(dto),
        });
        return normalizeSite(site);
    }
    async deactivate(acteurId, entrepriseId, id, locale) {
        await this.findOne(entrepriseId, id, locale);
        const site = await this.prisma.tenant.site.update({
            where: { id, entrepriseId },
            data: { actif: false },
            select: SITE_SELECT,
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.SITE_DESACTIVE, site);
        return normalizeSite(site);
    }
    async regenerateQr(acteurId, entrepriseId, id, locale) {
        await this.findOne(entrepriseId, id, locale);
        const site = await this.prisma.tenant.site.update({
            where: { id, entrepriseId },
            data: { qrToken: this.qr.generateToken() },
            select: SITE_SELECT,
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.QR_REGENERE, site);
        return normalizeSite(site);
    }
    requireHoraires(raw, locale) {
        const horairesJours = (0, site_horaires_util_1.parseHorairesJours)(raw);
        if (horairesJours.length === 0) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "siteHorairesRequis")], undefined, locale));
        }
        return horairesJours;
    }
    audit(acteurId, action, site, details) {
        return this.auditActions.domainAction({
            acteurId,
            action,
            objet: audit_actions_constants_1.AUDIT_OBJETS.SITE,
            objetId: site.id,
            entrepriseId: site.entrepriseId,
            details,
        });
    }
};
exports.SitesService = SitesService;
exports.SitesService = SitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        entitlements_service_1.EntitlementsService,
        qr_service_1.QrService,
        audit_actions_service_1.AuditActionsService])
], SitesService);
//# sourceMappingURL=sites.service.js.map