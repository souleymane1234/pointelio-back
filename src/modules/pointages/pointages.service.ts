import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import {
  MethodePointage,
  Prisma,
  Role,
  StatutCompte,
  StatutValidation,
  TypePointage,
} from "@prisma/client";
import { translate, type Locale } from "../../common/i18n";
import type { AuthUser } from "../../common/types/request-context";
import { buildPaginationQuery } from "../../common/utils/pagination.util";
import { validationErrorResponse } from "../../common/utils/response.util";
import {
  safeTimeZone,
  zonedDayBounds,
} from "../../common/utils/zoned-time.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
} from "../audit/shared/audit-actions.constants";
import { ANOMALIE, type AnomalieType } from "./anomalies.constants";
import type {
  AnomaliesQueryDto,
  PointagesQueryDto,
  PointerQrDto,
} from "./dto/pointage.dto";
import {
  normalizePointage,
  POINTAGE_SELECT,
  type PointageRow,
} from "./pointage.select";
import { nextTypeAttendu } from "./pointage-sequence.util";
import { ValidationGpsService } from "./validation-gps.service";

export type CreatePointageInput = {
  entrepriseId: number;
  acteurId: number;
  employeId: number;
  siteId: number;
  pointeParId: number | null;
  type: TypePointage;
  methode: MethodePointage;
  latitude: number | null;
  longitude: number | null;
  precisionM: number | null;
  distanceM: number | null;
  statutValidation: StatutValidation;
  motifStatut: string | null;
  mockDetecte: boolean;
  requestId: string;
};

/** Pointages d'une entreprise (requêtes restreintes par `prisma.tenant`). */
@Injectable()
export class PointagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gps: ValidationGpsService,
    private readonly auditActions: AuditActionsService,
  ) {}

  async timeZone(entrepriseId: number): Promise<string> {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { fuseauHoraire: true },
    });
    return safeTimeZone(entreprise?.fuseauHoraire);
  }

  async pointerQr(
    user: AuthUser,
    entrepriseId: number,
    dto: PointerQrDto,
    locale: Locale,
  ) {
    const existing = await this.findByRequestId(entrepriseId, dto.requestId);
    if (existing) {
      const tz = await this.timeZone(entrepriseId);
      return {
        replay: true as const,
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
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "pointageQrInvalide")],
          undefined,
          locale,
        ),
      );
    }
    if (!site.actif) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "pointageSiteInactif")],
          undefined,
          locale,
        ),
      );
    }

    await this.assertSequence(entrepriseId, user.id, dto.type, locale);

    const gps = this.gps.evaluate(
      {
        latitude: dto.latitude,
        longitude: dto.longitude,
        precisionM: dto.precisionM,
        mockDetecte: dto.mockDetecte === true,
      },
      {
        latitude: Number(site.latitude),
        longitude: Number(site.longitude),
        rayonM: site.rayonM,
        precisionMaxM: site.precisionMaxM,
      },
    );

    const pointage = await this.createOrReplay({
      entrepriseId,
      acteurId: user.id,
      employeId: user.id,
      siteId: site.id,
      pointeParId: null,
      type: dto.type,
      methode: MethodePointage.QR_GPS,
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

  async findAll(
    user: AuthUser,
    entrepriseId: number,
    query: PointagesQueryDto,
  ) {
    const tz = await this.timeZone(entrepriseId);
    const scope = await this.scopeWhere(user, entrepriseId, query);
    const totalItems = await this.prisma.tenant.pointage.count({
      where: scope,
    });
    const { skip, perPage, pagination } = buildPaginationQuery(
      totalItems,
      query.page,
      query.per_page,
    );
    const rows = await this.prisma.tenant.pointage.findMany({
      where: scope,
      select: POINTAGE_SELECT,
      orderBy: { heureServeur: "desc" },
      skip,
      take: perPage,
    });
    const data = await this.normalizeMany(rows, tz);
    return { data, pagination };
  }

  async findAnomalies(
    user: AuthUser,
    entrepriseId: number,
    query: AnomaliesQueryDto,
  ) {
    const tz = await this.timeZone(entrepriseId);
    const anomalie = query.anomalie;
    const base = await this.scopeWhere(user, entrepriseId, query);

    if (anomalie === ANOMALIE.RETARD || anomalie === ANOMALIE.OUBLI_DEPART) {
      return this.findComputedAnomalies(
        base,
        tz,
        anomalie,
        query.page,
        query.per_page,
      );
    }

    const where: Prisma.PointageWhereInput = { ...base };
    if (anomalie === ANOMALIE.HORS_ZONE) {
      where.statutValidation = StatutValidation.HORS_ZONE;
    } else if (anomalie === ANOMALIE.A_VERIFIER) {
      where.statutValidation = StatutValidation.A_VERIFIER;
    } else {
      where.statutValidation = {
        in: [StatutValidation.A_VERIFIER, StatutValidation.HORS_ZONE],
      };
    }

    const totalItems = await this.prisma.tenant.pointage.count({ where });
    const { skip, perPage, pagination } = buildPaginationQuery(
      totalItems,
      query.page,
      query.per_page,
    );
    const rows = await this.prisma.tenant.pointage.findMany({
      where,
      select: POINTAGE_SELECT,
      orderBy: { heureServeur: "desc" },
      skip,
      take: perPage,
    });
    return { data: await this.normalizeMany(rows, tz), pagination };
  }

  async findOne(
    user: AuthUser,
    entrepriseId: number,
    id: bigint,
    locale: Locale,
  ) {
    const row = await this.prisma.tenant.pointage.findFirst({
      where: { id, entrepriseId },
      select: POINTAGE_SELECT,
    });
    if (!row) {
      throw new NotFoundException(translate(locale, "pointageNotFound"));
    }
    this.assertCanRead(user, row);
    await this.assertCanReadSite(user, entrepriseId, row.siteId);
    const tz = await this.timeZone(entrepriseId);
    return this.normalizeOne(row, tz);
  }

  async findByRequestId(entrepriseId: number, requestId: string) {
    return this.prisma.tenant.pointage.findFirst({
      where: { entrepriseId, requestId },
      select: POINTAGE_SELECT,
    });
  }

  async assertSequence(
    entrepriseId: number,
    employeId: number,
    type: TypePointage,
    locale: Locale,
  ) {
    const tz = await this.timeZone(entrepriseId);
    const { start, end } = zonedDayBounds(new Date(), tz);
    const last = await this.prisma.tenant.pointage.findFirst({
      where: {
        entrepriseId,
        employeId,
        heureServeur: { gte: start, lt: end },
      },
      orderBy: { heureServeur: "desc" },
      select: { type: true },
    });
    const attendu = nextTypeAttendu(last?.type);
    if (type !== attendu) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [
            translate(locale, "pointageSequenceInvalide", {
              attendu,
              dernier: last?.type ?? "aucun",
            }),
          ],
          undefined,
          locale,
        ),
      );
    }
  }

  async createOrReplay(input: CreatePointageInput) {
    const existing = await this.findByRequestId(
      input.entrepriseId,
      input.requestId,
    );
    if (existing) {
      const tz = await this.timeZone(input.entrepriseId);
      return {
        replay: true as const,
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
        select: POINTAGE_SELECT,
      });
      await this.auditActions.domainAction({
        acteurId: input.acteurId,
        action: AUDIT_ACTIONS.POINTAGE_CREE,
        objet: AUDIT_OBJETS.POINTAGE,
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
        replay: false as const,
        pointage: await this.normalizeOne(created, tz),
      };
    } catch (error) {
      if (isUniqueConstraint(error)) {
        const replayed = await this.findByRequestId(
          input.entrepriseId,
          input.requestId,
        );
        if (replayed) {
          const tz = await this.timeZone(input.entrepriseId);
          return {
            replay: true as const,
            pointage: await this.normalizeOne(replayed, tz),
          };
        }
      }
      throw error;
    }
  }

  async requireActifEmploye(
    entrepriseId: number,
    employeId: number,
    siteId: number,
    locale: Locale,
  ) {
    const employe = await this.prisma.tenant.utilisateur.findFirst({
      where: { id: employeId, entrepriseId },
      select: { id: true, role: true, statut: true, siteId: true },
    });
    if (
      !employe ||
      employe.role !== Role.EMPLOYE ||
      employe.statut !== StatutCompte.ACTIF ||
      employe.siteId !== siteId
    ) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "pointageEmployeInvalide")],
          undefined,
          locale,
        ),
      );
    }
    return employe;
  }

  async actorSiteId(userId: number, entrepriseId: number, locale: Locale) {
    const actor = await this.prisma.tenant.utilisateur.findFirst({
      where: { id: userId, entrepriseId },
      select: { siteId: true },
    });
    if (!actor?.siteId) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "pointageSurveillantSansSite")],
          undefined,
          locale,
        ),
      );
    }
    return actor.siteId;
  }

  assertCanRead(user: AuthUser, row: { employeId: number; siteId: number }) {
    if (user.role === Role.EMPLOYE && row.employeId !== user.id) {
      throw new ForbiddenException();
    }
  }

  async assertCanReadSite(
    user: AuthUser,
    entrepriseId: number,
    siteId: number,
  ) {
    if (user.role !== Role.SURVEILLANT) return;
    const actor = await this.prisma.tenant.utilisateur.findFirst({
      where: { id: user.id, entrepriseId },
      select: { siteId: true },
    });
    if (actor?.siteId !== siteId) {
      throw new ForbiddenException();
    }
  }

  private async scopeWhere(
    user: AuthUser,
    entrepriseId: number,
    query: PointagesQueryDto,
  ): Promise<Prisma.PointageWhereInput> {
    const where: Prisma.PointageWhereInput = { entrepriseId };
    if (user.role === Role.EMPLOYE) {
      where.employeId = user.id;
    } else if (query.employeId) {
      where.employeId = query.employeId;
    }

    if (user.role === Role.SURVEILLANT) {
      const actor = await this.prisma.tenant.utilisateur.findFirst({
        where: { id: user.id, entrepriseId },
        select: { siteId: true },
      });
      where.siteId = actor?.siteId ?? -1;
    } else if (query.siteId) {
      where.siteId = query.siteId;
    }

    if (query.type) where.type = query.type;
    if (query.methode) where.methode = query.methode;
    if (query.statutValidation) where.statutValidation = query.statutValidation;
    if (query.dateDebut || query.dateFin) {
      where.heureServeur = {
        ...(query.dateDebut ? { gte: new Date(query.dateDebut) } : {}),
        ...(query.dateFin ? { lte: new Date(query.dateFin) } : {}),
      };
    }
    return where;
  }

  private async findComputedAnomalies(
    base: Prisma.PointageWhereInput,
    tz: string,
    anomalie: AnomalieType,
    page?: number,
    perPage?: number,
  ) {
    const now = new Date();
    const where: Prisma.PointageWhereInput = {
      ...base,
      type: TypePointage.ARRIVEE,
    };
    if (anomalie === ANOMALIE.OUBLI_DEPART) {
      const current = where.heureServeur;
      const filter =
        current && typeof current === "object" && !Array.isArray(current)
          ? current
          : {};
      where.heureServeur = {
        ...filter,
        lt: zonedDayBounds(now, tz).start,
      };
    }

    const rows = await this.prisma.tenant.pointage.findMany({
      where,
      select: POINTAGE_SELECT,
      orderBy: { heureServeur: "desc" },
      take: 200,
    });
    const normalized = await this.normalizeMany(rows, tz, now);
    const filtered = normalized.filter((row) =>
      row.anomalies.includes(anomalie),
    );
    const {
      skip,
      perPage: take,
      pagination,
    } = buildPaginationQuery(filtered.length, page, perPage);
    return { data: filtered.slice(skip, skip + take), pagination };
  }

  private async normalizeOne(row: PointageRow, tz: string, now = new Date()) {
    const [normalized] = await this.normalizeMany([row], tz, now);
    return normalized;
  }

  private async normalizeMany(
    rows: PointageRow[],
    tz: string,
    now = new Date(),
  ) {
    const flags = await this.journeeFlags(rows, tz);
    return rows.map((row) =>
      normalizePointage(
        row,
        tz,
        flags.get(String(row.id)) ?? {
          hasArrivee: row.type === TypePointage.ARRIVEE,
          hasDepart: row.type === TypePointage.DEPART,
        },
        now,
      ),
    );
  }

  /** Arrivée / départ du même jour civil, par id de pointage. */
  private async journeeFlags(rows: PointageRow[], tz: string) {
    const result = new Map<
      string,
      { hasArrivee: boolean; hasDepart: boolean }
    >();
    if (rows.length === 0) return result;

    const or: Prisma.PointageWhereInput[] = rows.map((row) => {
      const { start, end } = zonedDayBounds(row.heureServeur, tz);
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
      const { start, end } = zonedDayBounds(row.heureServeur, tz);
      const sameDay = siblings.filter(
        (item) =>
          item.employeId === row.employeId &&
          item.heureServeur >= start &&
          item.heureServeur < end,
      );
      result.set(String(row.id), {
        hasArrivee: sameDay.some((item) => item.type === TypePointage.ARRIVEE),
        hasDepart: sameDay.some((item) => item.type === TypePointage.DEPART),
      });
    }
    return result;
  }
}

function isUniqueConstraint(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}
