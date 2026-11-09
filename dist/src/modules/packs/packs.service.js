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
exports.PacksService = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../../common/i18n");
const pagination_util_1 = require("../../common/utils/pagination.util");
const response_util_1 = require("../../common/utils/response.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const audit_actions_constants_1 = require("../audit/shared/audit-actions.constants");
const pack_select_1 = require("./constants/pack-select");
let PacksService = class PacksService {
    prisma;
    auditActions;
    constructor(prisma, auditActions) {
        this.prisma = prisma;
        this.auditActions = auditActions;
    }
    async findAll(query) {
        const where = {};
        if (query.actif !== undefined)
            where.actif = query.actif;
        if (query.search) {
            where.OR = [
                { code: { contains: query.search } },
                { nom: { contains: query.search } },
            ];
        }
        const totalItems = await this.prisma.pack.count({ where });
        const { skip, perPage, pagination } = (0, pagination_util_1.buildPaginationQuery)(totalItems, query.page, query.per_page);
        const rows = await this.prisma.pack.findMany({
            where,
            select: pack_select_1.PACK_SELECT,
            orderBy: [{ ordre: "asc" }, { id: "asc" }],
            skip,
            take: perPage,
        });
        return { data: rows.map(pack_select_1.normalizePack), pagination };
    }
    async findOne(id, locale) {
        const pack = await this.prisma.pack.findUnique({
            where: { id },
            select: pack_select_1.PACK_SELECT,
        });
        if (!pack) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "packNotFound"));
        }
        return (0, pack_select_1.normalizePack)(pack);
    }
    async create(acteurId, dto, locale) {
        await this.assertCodeAvailable(dto.code, locale);
        const pack = await this.prisma.pack.create({
            data: { ...dto, modules: dto.modules },
            select: pack_select_1.PACK_SELECT,
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.PACK_CREE, pack.id, {
            code: pack.code,
        });
        return (0, pack_select_1.normalizePack)(pack);
    }
    async update(acteurId, id, dto, locale) {
        if (Object.values(dto).every((value) => value === undefined)) {
            throw this.invalid("packUpdateEmpty", locale);
        }
        await this.findOne(id, locale);
        if (dto.code !== undefined) {
            await this.assertCodeAvailable(dto.code, locale, id);
        }
        const pack = await this.prisma.pack.update({
            where: { id },
            data: dto,
            select: pack_select_1.PACK_SELECT,
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.PACK_MODIFIE, id, {
            updatedFields: Object.keys(dto),
        });
        return (0, pack_select_1.normalizePack)(pack);
    }
    async deactivate(acteurId, id, locale) {
        await this.findOne(id, locale);
        const pack = await this.prisma.pack.update({
            where: { id },
            data: { actif: false },
            select: pack_select_1.PACK_SELECT,
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.PACK_DESACTIVE, id);
        return (0, pack_select_1.normalizePack)(pack);
    }
    async assertCodeAvailable(code, locale, excludeId) {
        const existing = await this.prisma.pack.findFirst({
            where: { code, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
            select: { id: true },
        });
        if (existing) {
            throw this.invalid("packCodeAlreadyUsed", locale);
        }
    }
    audit(acteurId, action, packId, details) {
        return this.auditActions.domainAction({
            acteurId,
            action,
            objet: audit_actions_constants_1.AUDIT_OBJETS.PACK,
            objetId: packId,
            entrepriseId: null,
            details,
        });
    }
    invalid(key, locale) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key)], undefined, locale));
    }
};
exports.PacksService = PacksService;
exports.PacksService = PacksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_actions_service_1.AuditActionsService])
], PacksService);
//# sourceMappingURL=packs.service.js.map