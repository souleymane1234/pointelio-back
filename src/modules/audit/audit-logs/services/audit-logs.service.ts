import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { AuthUser } from "../../../../common/types/request-context";
import { isPlatformRole } from "../../../../common/rbac/role-groups";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import type { AuditLogsQueryDto } from "../dto/audit-logs-query.dto";

const acteurSelect = {
  id: true,
  nom: true,
  prenom: true,
  email: true,
} as const;

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
} satisfies Prisma.AuditLogSelect;

type AuditLogRow = Prisma.AuditLogGetPayload<{
  select: typeof auditLogSelect;
}>;

const AUDIT_EXPORT_MAX_ROWS = 5000;

function startOfDayUtc(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`Invalid startDate: ${value}`);
  }
  if (value.length <= 10) {
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
  }
  return date;
}

function endOfDayUtc(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`Invalid endDate: ${value}`);
  }
  if (value.length <= 10) {
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
  }
  return date;
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text =
    typeof value === "string"
      ? value
      : value instanceof Date
        ? value.toISOString()
        : JSON.stringify(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function formatActeurLabel(acteur: AuditLogRow["acteur"]): string {
  if (!acteur) return "";
  const name = `${acteur.prenom} ${acteur.nom}`.trim();
  return acteur.email ? `${name} <${acteur.email}>` : name;
}

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    actor: AuthUser,
    query: AuditLogsQueryDto,
  ): Prisma.AuditLogWhereInput {
    const filters: Prisma.AuditLogWhereInput[] = [];

    if (!isPlatformRole(actor.role)) {
      filters.push({ entrepriseId: actor.entrepriseId ?? -1 });
    } else if (query.entrepriseId) {
      filters.push({ entrepriseId: query.entrepriseId });
    }

    if (query.action) filters.push({ action: query.action });
    if (query.objet) filters.push({ objet: query.objet });
    if (query.objetId) filters.push({ objetId: query.objetId });
    if (query.acteurId) filters.push({ acteurId: query.acteurId });

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

    const createdAt: Prisma.DateTimeFilter = {};
    if (query.startDate) {
      createdAt.gte = startOfDayUtc(query.startDate);
    }
    if (query.endDate) {
      createdAt.lte = endOfDayUtc(query.endDate);
    }
    if (createdAt.gte && createdAt.lte && createdAt.gte > createdAt.lte) {
      throw new BadRequestException(
        "La date de début ne peut pas être postérieure à la date de fin.",
      );
    }
    if (createdAt.gte || createdAt.lte) {
      filters.push({ createdAt });
    }

    return filters.length > 0 ? { AND: filters } : {};
  }

  private mapRow(row: AuditLogRow) {
    return {
      ...row,
      id: row.id.toString(),
      details:
        row.details && typeof row.details === "object"
          ? (row.details as Record<string, unknown>)
          : null,
    };
  }

  async list(actor: AuthUser, query: AuditLogsQueryDto) {
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

  async exportCsv(actor: AuthUser, query: AuditLogsQueryDto) {
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

  private sanitizeDetailsForExport(
    details: Record<string, unknown> | null,
  ): Record<string, unknown> | null {
    if (!details) return null;
    const sensitive = /password|passwd|pin|secret|token|hash|otp|credential/i;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(details)) {
      if (sensitive.test(key)) continue;
      out[key] = value;
    }
    return out;
  }
}
