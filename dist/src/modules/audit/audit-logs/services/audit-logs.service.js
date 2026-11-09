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
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const role_groups_1 = require("../../../../common/rbac/role-groups");
const prisma_service_1 = require("../../../../infra/prisma/prisma.service");
const acteurSelect = {
    id: true,
    nom: true,
    prenom: true,
    email: true,
};
const auditLogSelect = {
    id: true,
    entrepriseId: true,
    acteurId: true,
    action: true,
    objet: true,
    objetId: true,
    details: true,
    ip: true,
    resultat: true,
    createdAt: true,
    acteur: { select: acteurSelect },
};
const AUDIT_EXPORT_MAX_ROWS = 5000;
function startOfDayUtc(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new common_1.BadRequestException(`Invalid startDate: ${value}`);
    }
    if (value.length <= 10) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
    }
    return date;
}
function endOfDayUtc(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new common_1.BadRequestException(`Invalid endDate: ${value}`);
    }
    if (value.length <= 10) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
    }
    return date;
}
function escapeCsv(value) {
    if (value === null || value === undefined)
        return "";
    const text = typeof value === "string"
        ? value
        : value instanceof Date
            ? value.toISOString()
            : JSON.stringify(value);
    return `"${text.replace(/"/g, '""')}"`;
}
function formatActeurLabel(acteur) {
    if (!acteur)
        return "";
    const name = `${acteur.prenom} ${acteur.nom}`.trim();
    return acteur.email ? `${name} <${acteur.email}>` : name;
}
let AuditLogsService = class AuditLogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    buildWhere(actor, query) {
        const filters = [];
        if (!(0, role_groups_1.isPlatformRole)(actor.role)) {
            filters.push({ entrepriseId: actor.entrepriseId ?? -1 });
        }
        else if (query.entrepriseId) {
            filters.push({ entrepriseId: query.entrepriseId });
        }
        if (query.action)
            filters.push({ action: query.action });
        if (query.objet)
            filters.push({ objet: query.objet });
        if (query.objetId)
            filters.push({ objetId: query.objetId });
        if (query.acteurId)
            filters.push({ acteurId: query.acteurId });
        if (query.search) {
            filters.push({
                acteur: {
                    is: {
                        OR: [
                            { email: { contains: query.search } },
                            { nom: { contains: query.search } },
                            { prenom: { contains: query.search } },
                        ],
                    },
                },
            });
        }
        const createdAt = {};
        if (query.startDate) {
            createdAt.gte = startOfDayUtc(query.startDate);
        }
        if (query.endDate) {
            createdAt.lte = endOfDayUtc(query.endDate);
        }
        if (createdAt.gte && createdAt.lte && createdAt.gte > createdAt.lte) {
            throw new common_1.BadRequestException("La date de début ne peut pas être postérieure à la date de fin.");
        }
        if (createdAt.gte || createdAt.lte) {
            filters.push({ createdAt });
        }
        return filters.length > 0 ? { AND: filters } : {};
    }
    mapRow(row) {
        return {
            ...row,
            id: row.id.toString(),
            details: row.details && typeof row.details === "object"
                ? row.details
                : null,
        };
    }
    async list(actor, query) {
        const page = query.page ?? 1;
        const perPage = query.per_page ?? 10;
        const where = this.buildWhere(actor, query);
        const totalItems = await this.prisma.auditLog.count({ where });
        const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / perPage);
        const safePage = Math.min(Math.max(1, page), totalPages);
        const offset = (safePage - 1) * perPage;
        const rows = await this.prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: offset,
            take: perPage,
            select: auditLogSelect,
        });
        return {
            data: rows.map((row) => this.mapRow(row)),
            pagination: {
                current_page: safePage,
                total_pages: totalPages,
                per_page: perPage,
                total_items: totalItems,
            },
        };
    }
    async exportCsv(actor, query) {
        const rows = await this.prisma.auditLog.findMany({
            where: this.buildWhere(actor, query),
            orderBy: { createdAt: "desc" },
            take: AUDIT_EXPORT_MAX_ROWS,
            select: auditLogSelect,
        });
        const header = [
            "date",
            "entrepriseId",
            "action",
            "objet",
            "objetId",
            "acteur",
            "acteurId",
            "ip",
            "resultat",
            "details",
        ];
        const lines = rows.map((row) => {
            const mapped = this.mapRow(row);
            return [
                escapeCsv(mapped.createdAt),
                escapeCsv(mapped.entrepriseId),
                escapeCsv(mapped.action),
                escapeCsv(mapped.objet),
                escapeCsv(mapped.objetId),
                escapeCsv(formatActeurLabel(mapped.acteur)),
                escapeCsv(mapped.acteurId),
                escapeCsv(mapped.ip),
                escapeCsv(mapped.resultat),
                escapeCsv(this.sanitizeDetailsForExport(mapped.details)),
            ].join(",");
        });
        return `\uFEFF${[header.join(","), ...lines].join("\n")}`;
    }
    sanitizeDetailsForExport(details) {
        if (!details)
            return null;
        const sensitive = /password|passwd|pin|secret|token|hash|otp|credential/i;
        const out = {};
        for (const [key, value] of Object.entries(details)) {
            if (sensitive.test(key))
                continue;
            out[key] = value;
        }
        return out;
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map