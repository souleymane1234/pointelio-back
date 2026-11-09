import * as bcrypt from "bcrypt";
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma, Role, StatutCompte, StatutEntreprise } from "@prisma/client";
import { translate, type Locale } from "../../common/i18n";
import type { MessageKey } from "../../common/i18n/translate";
import { buildPaginationQuery } from "../../common/utils/pagination.util";
import { validationErrorResponse } from "../../common/utils/response.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
  type AuditActionCode,
} from "../audit/shared/audit-actions.constants";
import { USERS_BCRYPT_ROUNDS } from "../utilisateurs/services/user-admin.select";
import {
  ENTREPRISE_ADMIN_SELECT,
  isProfilComplete,
  normalizeEntrepriseAdmin,
} from "./constants/entreprise-select";
import type { CreateEntrepriseDto } from "./dto/create-entreprise.dto";
import type { EntreprisesQueryDto } from "./dto/entreprises-query.dto";
import type { UpdateEntrepriseDto } from "./dto/update-entreprise.dto";
import { type CycleAction, nextStatut } from "./entreprise-cycle.util";

const CYCLE_AUDIT: Record<CycleAction, AuditActionCode> = {
  suspendre: AUDIT_ACTIONS.ENTREPRISE_SUSPENDUE,
  reactiver: AUDIT_ACTIONS.ENTREPRISE_REACTIVEE,
  cloturer: AUDIT_ACTIONS.ENTREPRISE_CLOTUREE,
};

const DAY_MS = 86_400_000;

/** Espace Super admin : création, suivi et cycle de vie des entreprises clientes. */
@Injectable()
export class EntreprisesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditActions: AuditActionsService,
  ) {}

  async findAll(query: EntreprisesQueryDto) {
    const where: Prisma.EntrepriseWhereInput = {};
    if (query.statut) where.statut = query.statut;
    if (query.packId) where.packId = query.packId;
    if (query.search) {
      where.OR = [
        { raisonSociale: { contains: query.search } },
        { nomCommercial: { contains: query.search } },
        { contactEmail: { contains: query.search } },
      ];
    }

    const totalItems = await this.prisma.entreprise.count({ where });
    const { skip, perPage, pagination } = buildPaginationQuery(
      totalItems,
      query.page,
      query.per_page,
    );
    const rows = await this.prisma.entreprise.findMany({
      where,
      select: ENTREPRISE_ADMIN_SELECT,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take: perPage,
    });
    return { data: rows.map(normalizeEntrepriseAdmin), pagination };
  }

  async findOne(id: number, locale: Locale) {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id },
      select: ENTREPRISE_ADMIN_SELECT,
    });
    if (!entreprise) {
      throw new NotFoundException(translate(locale, "entrepriseNotFound"));
    }
    return normalizeEntrepriseAdmin(entreprise);
  }

  /**
   * Crée l'entreprise et, si fourni, son premier ADMIN_CLIENT, actif immédiatement
   * avec le mot de passe choisi par Pointelio.
   */
  async create(acteurId: number, dto: CreateEntrepriseDto, locale: Locale) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: dto.packId },
      select: { id: true, actif: true, essaiJours: true },
    });
    if (!pack) throw new NotFoundException(translate(locale, "packNotFound"));
    if (!pack.actif) throw this.invalid("packInactif", locale);

    const { admin, dateEcheance, ...fields } = dto;
    if (admin) {
      const taken = await this.prisma.utilisateur.findUnique({
        where: { email: admin.email },
        select: { id: true },
      });
      if (taken) throw this.invalid("emailAlreadyUsed", locale);
    }

    const statut = dto.statut ?? StatutEntreprise.ESSAI;
    const now = new Date();
    const echeance = dateEcheance
      ? new Date(dateEcheance)
      : statut === StatutEntreprise.ESSAI && pack.essaiJours > 0
        ? new Date(now.getTime() + pack.essaiJours * DAY_MS)
        : null;

    const adminPasswordHash = admin
      ? await bcrypt.hash(admin.password, USERS_BCRYPT_ROUNDS)
      : null;

    const { entreprise, adminUser } = await this.prisma.$transaction(
      async (tx) => {
        const created = await tx.entreprise.create({
          data: {
            ...fields,
            statut,
            dateDemarrage: now,
            dateEcheance: echeance,
            profilComplete: isProfilComplete({
              secteur: fields.secteur ?? null,
              ville: fields.ville ?? null,
              adresse: fields.adresse ?? null,
              contactNom: fields.contactNom ?? null,
              contactEmail: fields.contactEmail ?? null,
              contactTel: fields.contactTel ?? null,
            }),
          },
          select: { id: true },
        });
        const user = admin
          ? await tx.utilisateur.create({
              data: {
                nom: admin.nom,
                prenom: admin.prenom,
                email: admin.email,
                passwordHash: adminPasswordHash,
                entrepriseId: created.id,
                role: Role.ADMIN_CLIENT,
                statut: StatutCompte.ACTIF,
              },
              select: { id: true },
            })
          : null;
        return { entreprise: created, adminUser: user };
      },
    );

    await this.audit(acteurId, AUDIT_ACTIONS.ENTREPRISE_CREEE, entreprise.id, {
      packId: pack.id,
      statut,
      adminCree: Boolean(adminUser),
    });

    return this.findOne(entreprise.id, locale);
  }

  async update(
    acteurId: number,
    id: number,
    dto: UpdateEntrepriseDto,
    locale: Locale,
  ) {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw this.invalid("entrepriseUpdateEmpty", locale);
    }
    const current = await this.findOne(id, locale);
    const merged = { ...current, ...dto };

    await this.prisma.entreprise.update({
      where: { id },
      data: { ...dto, profilComplete: isProfilComplete(merged) },
    });
    await this.audit(acteurId, AUDIT_ACTIONS.ENTREPRISE_MODIFIEE, id, {
      updatedFields: Object.keys(dto),
    });
    return this.findOne(id, locale);
  }

  /**
   * Suspension, réactivation ou clôture. Effet immédiat : le guard d'abonnement
   * relit le statut à chaque requête.
   */
  async changerStatut(
    acteurId: number,
    id: number,
    action: CycleAction,
    motif: string | undefined,
    locale: Locale,
  ) {
    const current = await this.findOne(id, locale);
    const statut = nextStatut(action, current.statut);
    if (!statut) {
      throw this.invalid("entrepriseTransitionInvalide", locale, {
        statut: current.statut,
      });
    }

    await this.prisma.entreprise.update({ where: { id }, data: { statut } });
    await this.audit(acteurId, CYCLE_AUDIT[action], id, {
      from: current.statut,
      to: statut,
      ...(motif ? { motif } : {}),
    });
    return this.findOne(id, locale);
  }

  private audit(
    acteurId: number,
    action: AuditActionCode,
    entrepriseId: number,
    details?: Prisma.InputJsonValue,
  ) {
    return this.auditActions.domainAction({
      acteurId,
      action,
      objet: AUDIT_OBJETS.ENTREPRISE,
      objetId: entrepriseId,
      entrepriseId,
      details,
    });
  }

  private invalid(
    key: MessageKey,
    locale: Locale,
    params?: Record<string, string>,
  ) {
    return new UnprocessableEntityException(
      validationErrorResponse(
        [translate(locale, key, params)],
        undefined,
        locale,
      ),
    );
  }
}
