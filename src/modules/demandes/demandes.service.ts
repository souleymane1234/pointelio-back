import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import {
  Prisma,
  Role,
  StatutCompte,
  StatutDemande,
  TypeDemande,
} from "@prisma/client";
import { translate, type Locale } from "../../common/i18n";
import { TENANT_ADMIN_ROLES } from "../../common/rbac/role-groups";
import type { AuthUser } from "../../common/types/request-context";
import { buildPaginationQuery } from "../../common/utils/pagination.util";
import { validationErrorResponse } from "../../common/utils/response.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
  type AuditActionCode,
} from "../audit/shared/audit-actions.constants";
import { NOTIFICATION_TYPES } from "../notifications/shared/notification-types.constants";
import { NotificationsService } from "../notifications/notifications.service";
import {
  civilToDate,
  countWorkingDays,
  dateToCivil,
  DEMANDE_MAX_SPAN_DAYS,
  parseCivilDate,
  spanDays,
} from "./demande-jours.util";
import type {
  CreateDemandeDto,
  DeciderDemandeDto,
  DemandesQueryDto,
  UpdateDemandeDto,
} from "./dto/demande.dto";

const PERSONNE_SELECT = {
  id: true,
  nom: true,
  prenom: true,
  matricule: true,
} satisfies Prisma.UtilisateurSelect;

const DEMANDE_SELECT = {
  id: true,
  entrepriseId: true,
  employeId: true,
  type: true,
  dateDebut: true,
  dateFin: true,
  nbJours: true,
  commentaire: true,
  justificatifUrl: true,
  statut: true,
  decideurId: true,
  decisionMotif: true,
  decideAt: true,
  createdAt: true,
  employe: { select: PERSONNE_SELECT },
  decideur: { select: PERSONNE_SELECT },
} satisfies Prisma.DemandeSelect;

type DemandeRow = Prisma.DemandeGetPayload<{ select: typeof DEMANDE_SELECT }>;

const DECIDEURS: readonly Role[] = [...TENANT_ADMIN_ROLES, Role.MANAGER];

function normalize(row: DemandeRow) {
  return {
    ...row,
    dateDebut: dateToCivil(row.dateDebut),
    dateFin: dateToCivil(row.dateFin),
  };
}

function joursTravailOf(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((j): j is number => typeof j === "number")
    : [];
}

function canDecide(role: Role): boolean {
  return DECIDEURS.includes(role);
}

/** Absences et congés d'une entreprise (requêtes restreintes par `prisma.tenant`). */
@Injectable()
export class DemandesService {
  private readonly logger = new Logger(DemandesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditActions: AuditActionsService,
    private readonly notifications: NotificationsService,
  ) {}

  async findAll(user: AuthUser, entrepriseId: number, query: DemandesQueryDto) {
    const where = await this.scopeWhere(user, entrepriseId, query);
    const totalItems = await this.prisma.tenant.demande.count({ where });
    const { skip, perPage, pagination } = buildPaginationQuery(
      totalItems,
      query.page,
      query.per_page,
    );
    const rows = await this.prisma.tenant.demande.findMany({
      where,
      select: DEMANDE_SELECT,
      orderBy: [{ createdAt: "desc" }],
      skip,
      take: perPage,
    });
    return { data: rows.map(normalize), pagination };
  }

  async findOne(
    user: AuthUser,
    entrepriseId: number,
    id: number,
    locale: Locale,
  ) {
    const row = await this.prisma.tenant.demande.findFirst({
      where: { id, entrepriseId },
      select: DEMANDE_SELECT,
    });
    if (!row) {
      throw new NotFoundException(translate(locale, "demandeNotFound"));
    }
    await this.assertCanRead(user, entrepriseId, row);
    return normalize(row);
  }

  async create(
    user: AuthUser,
    entrepriseId: number,
    dto: CreateDemandeDto,
    locale: Locale,
  ) {
    const employeId = await this.resolveEmployeId(
      user,
      entrepriseId,
      dto.employeId,
      locale,
    );
    const { dateDebut, dateFin } = this.assertPeriode(
      dto.dateDebut,
      dto.dateFin,
      locale,
    );
    this.assertJustificatif(dto.type, dto.justificatifUrl, locale);
    await this.assertPasDeChevauchement(
      entrepriseId,
      employeId,
      dateDebut,
      dateFin,
      locale,
    );
    const nbJours = await this.nbJoursOuvres(
      employeId,
      entrepriseId,
      dateDebut,
      dateFin,
      locale,
    );

    const created = await this.prisma.tenant.demande.create({
      data: {
        entrepriseId,
        employeId,
        type: dto.type,
        dateDebut: civilToDate(dateDebut),
        dateFin: civilToDate(dateFin),
        nbJours,
        commentaire: dto.commentaire?.trim() || null,
        justificatifUrl: dto.justificatifUrl?.trim() || null,
      },
      select: DEMANDE_SELECT,
    });

    await this.audit(user.id, AUDIT_ACTIONS.DEMANDE_CREEE, created, {
      type: created.type,
      dateDebut,
      dateFin,
    });
    await this.notifyDecideurs(entrepriseId, created, locale);
    return normalize(created);
  }

  async update(
    user: AuthUser,
    entrepriseId: number,
    id: number,
    dto: UpdateDemandeDto,
    locale: Locale,
  ) {
    if (
      dto.type === undefined &&
      dto.dateDebut === undefined &&
      dto.dateFin === undefined &&
      dto.commentaire === undefined &&
      dto.justificatifUrl === undefined
    ) {
      throw this.invalid("demandeUpdateEmpty", locale);
    }

    const current = await this.requireEnAttente(user, entrepriseId, id, locale);
    this.assertOwnerOrAdmin(user, current);

    const type = dto.type ?? current.type;
    const dateDebut = dto.dateDebut ?? dateToCivil(current.dateDebut);
    const dateFin = dto.dateFin ?? dateToCivil(current.dateFin);
    this.assertPeriode(dateDebut, dateFin, locale);
    const justificatif =
      dto.justificatifUrl !== undefined
        ? dto.justificatifUrl
        : current.justificatifUrl;
    this.assertJustificatif(type, justificatif, locale);
    await this.assertPasDeChevauchement(
      entrepriseId,
      current.employeId,
      dateDebut,
      dateFin,
      locale,
      current.id,
    );
    const nbJours = await this.nbJoursOuvres(
      current.employeId,
      entrepriseId,
      dateDebut,
      dateFin,
      locale,
    );

    const updated = await this.prisma.tenant.demande.update({
      where: { id, entrepriseId },
      data: {
        type,
        dateDebut: civilToDate(dateDebut),
        dateFin: civilToDate(dateFin),
        nbJours,
        ...(dto.commentaire !== undefined
          ? { commentaire: dto.commentaire?.trim() || null }
          : {}),
        ...(dto.justificatifUrl !== undefined
          ? { justificatifUrl: dto.justificatifUrl?.trim() || null }
          : {}),
      },
      select: DEMANDE_SELECT,
    });
    await this.audit(user.id, AUDIT_ACTIONS.DEMANDE_MODIFIEE, updated);
    return normalize(updated);
  }

  async decider(
    user: AuthUser,
    entrepriseId: number,
    id: number,
    dto: DeciderDemandeDto,
    locale: Locale,
  ) {
    if (!canDecide(user.role)) {
      throw new ForbiddenException();
    }
    const current = await this.requireEnAttente(user, entrepriseId, id, locale);
    if (current.employeId === user.id) {
      throw this.invalid("demandeAutoDecisionInterdite", locale);
    }
    if (dto.statut === StatutDemande.REFUSEE && !dto.decisionMotif?.trim()) {
      throw this.invalid("demandeMotifRequis", locale);
    }

    const updated = await this.prisma.tenant.demande.update({
      where: { id, entrepriseId },
      data: {
        statut: dto.statut,
        decideurId: user.id,
        decisionMotif: dto.decisionMotif?.trim() || null,
        decideAt: new Date(),
      },
      select: DEMANDE_SELECT,
    });
    await this.audit(user.id, AUDIT_ACTIONS.DEMANDE_DECIDEE, updated, {
      statut: dto.statut,
    });
    await this.notifyEmploye(updated, locale);
    return normalize(updated);
  }

  async annuler(
    user: AuthUser,
    entrepriseId: number,
    id: number,
    locale: Locale,
  ) {
    const current = await this.prisma.tenant.demande.findFirst({
      where: { id, entrepriseId },
      select: DEMANDE_SELECT,
    });
    if (!current) {
      throw new NotFoundException(translate(locale, "demandeNotFound"));
    }
    await this.assertCanRead(user, entrepriseId, current);

    const isAdmin = canDecide(user.role);
    const isOwner = current.employeId === user.id;
    if (current.statut === StatutDemande.EN_ATTENTE) {
      if (!isOwner && !isAdmin) throw new ForbiddenException();
    } else if (current.statut === StatutDemande.APPROUVEE) {
      if (!isAdmin) throw new ForbiddenException();
      if (dateToCivil(current.dateDebut) <= dateToCivil(new Date())) {
        throw this.invalid("demandeDejaCommencee", locale);
      }
    } else {
      throw this.invalid("demandeNonModifiable", locale);
    }

    const updated = await this.prisma.tenant.demande.update({
      where: { id, entrepriseId },
      data: {
        statut: StatutDemande.ANNULEE,
        decideurId: user.id,
        decideAt: new Date(),
        decisionMotif: isOwner ? null : current.decisionMotif,
      },
      select: DEMANDE_SELECT,
    });
    await this.audit(user.id, AUDIT_ACTIONS.DEMANDE_ANNULEE, updated);
    if (isAdmin && !isOwner) {
      await this.notifyEmploye(updated, locale);
    } else {
      await this.notifyDecideurs(entrepriseId, updated, locale);
    }
    return normalize(updated);
  }

  private async requireEnAttente(
    user: AuthUser,
    entrepriseId: number,
    id: number,
    locale: Locale,
  ) {
    const row = await this.prisma.tenant.demande.findFirst({
      where: { id, entrepriseId },
      select: DEMANDE_SELECT,
    });
    if (!row) {
      throw new NotFoundException(translate(locale, "demandeNotFound"));
    }
    await this.assertCanRead(user, entrepriseId, row);
    if (row.statut !== StatutDemande.EN_ATTENTE) {
      throw this.invalid("demandeNonModifiable", locale);
    }
    return row;
  }

  private assertOwnerOrAdmin(user: AuthUser, row: DemandeRow) {
    if (row.employeId === user.id || canDecide(user.role)) return;
    throw new ForbiddenException();
  }

  private async assertCanRead(
    user: AuthUser,
    entrepriseId: number,
    row: { employeId: number },
  ) {
    if (row.employeId === user.id || canDecide(user.role)) return;
    if (user.role === Role.SURVEILLANT) {
      const ok = await this.sameSite(user.id, row.employeId, entrepriseId);
      if (ok) return;
    }
    throw new ForbiddenException();
  }

  private async sameSite(
    actorId: number,
    employeId: number,
    entrepriseId: number,
  ) {
    const [actor, employe] = await Promise.all([
      this.prisma.tenant.utilisateur.findFirst({
        where: { id: actorId, entrepriseId },
        select: { siteId: true },
      }),
      this.prisma.tenant.utilisateur.findFirst({
        where: { id: employeId, entrepriseId },
        select: { siteId: true },
      }),
    ]);
    return Boolean(actor?.siteId && actor.siteId === employe?.siteId);
  }

  private async resolveEmployeId(
    user: AuthUser,
    entrepriseId: number,
    requested: number | undefined,
    locale: Locale,
  ) {
    if (!requested || requested === user.id) return user.id;
    if (!canDecide(user.role)) {
      throw new ForbiddenException();
    }
    const employe = await this.prisma.tenant.utilisateur.findFirst({
      where: { id: requested, entrepriseId },
      select: { id: true, statut: true, role: true },
    });
    if (
      !employe ||
      employe.statut !== StatutCompte.ACTIF ||
      employe.role === Role.SUPER_ADMIN ||
      employe.role === Role.SUPPORT
    ) {
      throw this.invalid("demandeEmployeInvalide", locale);
    }
    return employe.id;
  }

  private assertPeriode(
    dateDebut: string,
    dateFin: string,
    locale: Locale,
  ): { dateDebut: string; dateFin: string } {
    if (!parseCivilDate(dateDebut) || !parseCivilDate(dateFin)) {
      throw this.invalid("demandeDateInvalide", locale);
    }
    if (
      dateDebut > dateFin ||
      spanDays(dateDebut, dateFin) > DEMANDE_MAX_SPAN_DAYS
    ) {
      throw this.invalid("demandePeriodeInvalide", locale);
    }
    return { dateDebut, dateFin };
  }

  private assertJustificatif(
    type: TypeDemande,
    justificatifUrl: string | null | undefined,
    locale: Locale,
  ) {
    if (type === TypeDemande.MALADIE && !justificatifUrl?.trim()) {
      throw this.invalid("demandeJustificatifRequis", locale);
    }
  }

  private async assertPasDeChevauchement(
    entrepriseId: number,
    employeId: number,
    dateDebut: string,
    dateFin: string,
    locale: Locale,
    excludeId?: number,
  ) {
    const overlap = await this.prisma.tenant.demande.findFirst({
      where: {
        entrepriseId,
        employeId,
        statut: { in: [StatutDemande.EN_ATTENTE, StatutDemande.APPROUVEE] },
        ...(excludeId ? { id: { not: excludeId } } : {}),
        dateDebut: { lte: civilToDate(dateFin) },
        dateFin: { gte: civilToDate(dateDebut) },
      },
      select: { id: true },
    });
    if (overlap) {
      throw this.invalid("demandeChevauchement", locale);
    }
  }

  private async nbJoursOuvres(
    employeId: number,
    entrepriseId: number,
    dateDebut: string,
    dateFin: string,
    locale: Locale,
  ) {
    const employe = await this.prisma.tenant.utilisateur.findFirst({
      where: { id: employeId, entrepriseId },
      select: { horaire: { select: { joursTravail: true } } },
    });
    const nbJours = countWorkingDays(
      dateDebut,
      dateFin,
      joursTravailOf(employe?.horaire?.joursTravail),
    );
    if (nbJours <= 0) {
      throw this.invalid("demandeAucunJourOuvre", locale);
    }
    return nbJours;
  }

  private async scopeWhere(
    user: AuthUser,
    entrepriseId: number,
    query: DemandesQueryDto,
  ): Promise<Prisma.DemandeWhereInput> {
    const where: Prisma.DemandeWhereInput = { entrepriseId };
    if (user.role === Role.EMPLOYE) {
      where.employeId = user.id;
    } else if (user.role === Role.SURVEILLANT) {
      const actor = await this.prisma.tenant.utilisateur.findFirst({
        where: { id: user.id, entrepriseId },
        select: { siteId: true },
      });
      where.OR = [
        { employeId: user.id },
        { employe: { siteId: actor?.siteId ?? -1 } },
      ];
    } else if (query.employeId) {
      where.employeId = query.employeId;
    }

    if (query.statut) where.statut = query.statut;
    if (query.type) where.type = query.type;
    if (query.dateDebut || query.dateFin) {
      const debut = query.dateDebut
        ? dateToCivil(query.dateDebut)
        : "0001-01-01";
      const fin = query.dateFin ? dateToCivil(query.dateFin) : "9999-12-31";
      if (parseCivilDate(debut) && parseCivilDate(fin)) {
        where.AND = [
          { dateDebut: { lte: civilToDate(fin) } },
          { dateFin: { gte: civilToDate(debut) } },
        ];
      }
    }
    return where;
  }

  private async notifyDecideurs(
    entrepriseId: number,
    demande: DemandeRow,
    locale: Locale,
  ) {
    const decideurs = await this.prisma.tenant.utilisateur.findMany({
      where: {
        entrepriseId,
        statut: StatutCompte.ACTIF,
        role: { in: [...DECIDEURS] },
        id: { not: demande.employeId },
      },
      select: { id: true },
    });
    await this.notifySafe(
      decideurs.map((d) => d.id),
      {
        titre: translate(locale, "demandeNotifCreatedTitle"),
        message: translate(locale, "demandeNotifCreatedMessage", {
          employe: `${demande.employe.prenom} ${demande.employe.nom}`.trim(),
          type: demande.type,
          debut: dateToCivil(demande.dateDebut),
          fin: dateToCivil(demande.dateFin),
        }),
        type: NOTIFICATION_TYPES.DEMANDE,
      },
    );
  }

  private async notifyEmploye(demande: DemandeRow, locale: Locale) {
    const key =
      demande.statut === StatutDemande.APPROUVEE
        ? "demandeNotifApprouveeMessage"
        : demande.statut === StatutDemande.REFUSEE
          ? "demandeNotifRefuseeMessage"
          : "demandeNotifAnnuleeMessage";
    await this.notifySafe([demande.employeId], {
      titre: translate(locale, "demandeNotifDecidedTitle"),
      message: translate(locale, key, {
        type: demande.type,
        debut: dateToCivil(demande.dateDebut),
        fin: dateToCivil(demande.dateFin),
      }),
      type: NOTIFICATION_TYPES.DEMANDE,
    });
  }

  private async notifySafe(
    userIds: number[],
    notification: { titre: string; message: string; type: string },
  ) {
    if (userIds.length === 0) return;
    try {
      await this.notifications.notifyUsers(userIds, notification);
    } catch (error) {
      this.logger.warn(
        `Notification demande impossible: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private audit(
    acteurId: number,
    action: AuditActionCode,
    demande: { id: number; entrepriseId: number },
    details?: Prisma.InputJsonValue,
  ) {
    return this.auditActions.domainAction({
      acteurId,
      action,
      objet: AUDIT_OBJETS.DEMANDE,
      objetId: demande.id,
      entrepriseId: demande.entrepriseId,
      details,
    });
  }

  private invalid(
    key:
      | "demandeUpdateEmpty"
      | "demandeDateInvalide"
      | "demandePeriodeInvalide"
      | "demandeChevauchement"
      | "demandeAucunJourOuvre"
      | "demandeJustificatifRequis"
      | "demandeNonModifiable"
      | "demandeMotifRequis"
      | "demandeAutoDecisionInterdite"
      | "demandeEmployeInvalide"
      | "demandeDejaCommencee",
    locale: Locale,
  ) {
    return new UnprocessableEntityException(
      validationErrorResponse([translate(locale, key)], undefined, locale),
    );
  }
}
