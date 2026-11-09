import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { translate, type Locale } from "../../common/i18n";
import { buildPaginationQuery } from "../../common/utils/pagination.util";
import { validationErrorResponse } from "../../common/utils/response.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
  type AuditActionCode,
} from "../audit/shared/audit-actions.constants";
import { EntitlementsService } from "../entitlements/entitlements.service";
import type {
  CreateSiteDto,
  SitesQueryDto,
  UpdateSiteDto,
} from "./dto/site.dto";
import { QrService } from "./qr.service";
import { parseHorairesJours } from "./site-horaires.util";

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
} satisfies Prisma.SiteSelect;

type SiteRow = Prisma.SiteGetPayload<{ select: typeof SITE_SELECT }>;

function normalizeSite(row: SiteRow) {
  const { _count, ...site } = row;
  const horairesJours = parseHorairesJours(site.horairesJours);
  return {
    ...site,
    latitude: Number(site.latitude),
    longitude: Number(site.longitude),
    horairesJours,
    joursTravail: horairesJours.map((j) => j.jour),
    employesCount: _count.employes,
  };
}

/** Sites de pointage d'une entreprise (requêtes restreintes par `prisma.tenant`). */
@Injectable()
export class SitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService,
    private readonly qr: QrService,
    private readonly auditActions: AuditActionsService,
  ) {}

  async findAll(entrepriseId: number, query: SitesQueryDto) {
    const where: Prisma.SiteWhereInput = { entrepriseId };
    if (query.actif !== undefined) where.actif = query.actif;
    if (query.search) {
      where.OR = [
        { nom: { contains: query.search } },
        { adresse: { contains: query.search } },
      ];
    }

    const totalItems = await this.prisma.tenant.site.count({ where });
    const { skip, perPage, pagination } = buildPaginationQuery(
      totalItems,
      query.page,
      query.per_page,
    );
    const rows = await this.prisma.tenant.site.findMany({
      where,
      select: SITE_SELECT,
      orderBy: [{ actif: "desc" }, { nom: "asc" }],
      skip,
      take: perPage,
    });
    return { data: rows.map(normalizeSite), pagination };
  }

  async findOne(entrepriseId: number, id: number, locale: Locale) {
    const site = await this.prisma.tenant.site.findFirst({
      where: { id, entrepriseId },
      select: SITE_SELECT,
    });
    if (!site) {
      throw new NotFoundException(translate(locale, "siteNotFound"));
    }
    return normalizeSite(site);
  }

  async create(
    acteurId: number,
    entrepriseId: number,
    dto: CreateSiteDto,
    locale: Locale,
  ) {
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
    await this.audit(acteurId, AUDIT_ACTIONS.SITE_CREE, site, {
      nom: site.nom,
    });
    return normalizeSite(site);
  }

  async update(
    acteurId: number,
    entrepriseId: number,
    id: number,
    dto: UpdateSiteDto,
    locale: Locale,
  ) {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "siteUpdateEmpty")],
          undefined,
          locale,
        ),
      );
    }
    const current = await this.findOne(entrepriseId, id, locale);
    if (dto.actif === true && !current.actif) {
      await this.entitlements.assertCanAddSite(entrepriseId, locale);
    }

    const { horairesJours: rawHoraires, ...rest } = dto;
    const data: Prisma.SiteUncheckedUpdateInput = { ...rest };
    if (rawHoraires !== undefined) {
      data.horairesJours = this.requireHoraires(rawHoraires, locale);
    }
    const site = await this.prisma.tenant.site.update({
      where: { id, entrepriseId },
      data,
      select: SITE_SELECT,
    });
    await this.audit(acteurId, AUDIT_ACTIONS.SITE_MODIFIE, site, {
      updatedFields: Object.keys(dto),
    });
    return normalizeSite(site);
  }

  /** Désactivation : l'historique des pointages du site est conservé. */
  async deactivate(
    acteurId: number,
    entrepriseId: number,
    id: number,
    locale: Locale,
  ) {
    await this.findOne(entrepriseId, id, locale);
    const site = await this.prisma.tenant.site.update({
      where: { id, entrepriseId },
      data: { actif: false },
      select: SITE_SELECT,
    });
    await this.audit(acteurId, AUDIT_ACTIONS.SITE_DESACTIVE, site);
    return normalizeSite(site);
  }

  async regenerateQr(
    acteurId: number,
    entrepriseId: number,
    id: number,
    locale: Locale,
  ) {
    await this.findOne(entrepriseId, id, locale);
    const site = await this.prisma.tenant.site.update({
      where: { id, entrepriseId },
      data: { qrToken: this.qr.generateToken() },
      select: SITE_SELECT,
    });
    await this.audit(acteurId, AUDIT_ACTIONS.QR_REGENERE, site);
    return normalizeSite(site);
  }

  private requireHoraires(
    raw: CreateSiteDto["horairesJours"] | undefined,
    locale: Locale,
  ) {
    const horairesJours = parseHorairesJours(raw);
    if (horairesJours.length === 0) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "siteHorairesRequis")],
          undefined,
          locale,
        ),
      );
    }
    return horairesJours;
  }

  private audit(
    acteurId: number,
    action: AuditActionCode,
    site: { id: number; entrepriseId: number },
    details?: Prisma.InputJsonValue,
  ) {
    return this.auditActions.domainAction({
      acteurId,
      action,
      objet: AUDIT_OBJETS.SITE,
      objetId: site.id,
      entrepriseId: site.entrepriseId,
      details,
    });
  }
}
