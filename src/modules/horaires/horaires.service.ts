import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PACK_MODULES } from "../../common/constants/pack-modules.constants";
import { translate, type Locale } from "../../common/i18n";
import type { MessageKey } from "../../common/i18n/translate";
import { validationErrorResponse } from "../../common/utils/response.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
  type AuditActionCode,
} from "../audit/shared/audit-actions.constants";
import { EntitlementsService } from "../entitlements/entitlements.service";
import type { CreateHoraireDto, UpdateHoraireDto } from "./dto/horaire.dto";

const HORAIRE_SELECT = {
  id: true,
  entrepriseId: true,
  nom: true,
  heureDebut: true,
  heureFin: true,
  toleranceMin: true,
  joursTravail: true,
  createdAt: true,
  _count: { select: { utilisateurs: true } },
} satisfies Prisma.HoraireSelect;

type HoraireRow = Prisma.HoraireGetPayload<{ select: typeof HORAIRE_SELECT }>;

function normalizeHoraire(row: HoraireRow) {
  const { _count, ...horaire } = row;
  return {
    ...horaire,
    joursTravail: Array.isArray(horaire.joursTravail)
      ? horaire.joursTravail.filter((j): j is number => typeof j === "number")
      : [],
    utilisateursCount: _count.utilisateurs,
  };
}

/** Horaires de travail d'une entreprise (requêtes restreintes par `prisma.tenant`). */
@Injectable()
export class HorairesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService,
    private readonly auditActions: AuditActionsService,
  ) {}

  async findAll(entrepriseId: number) {
    const rows = await this.prisma.tenant.horaire.findMany({
      where: { entrepriseId },
      select: HORAIRE_SELECT,
      orderBy: { nom: "asc" },
    });
    return rows.map(normalizeHoraire);
  }

  async findOne(entrepriseId: number, id: number, locale: Locale) {
    const horaire = await this.prisma.tenant.horaire.findFirst({
      where: { id, entrepriseId },
      select: HORAIRE_SELECT,
    });
    if (!horaire) {
      throw new NotFoundException(translate(locale, "horaireNotFound"));
    }
    return normalizeHoraire(horaire);
  }

  /** Sans le module HORAIRES_MULTIPLES, une entreprise n'a qu'un seul horaire. */
  async create(
    acteurId: number,
    entrepriseId: number,
    dto: CreateHoraireDto,
    locale: Locale,
  ) {
    const existing = await this.prisma.tenant.horaire.count({
      where: { entrepriseId },
    });
    if (existing >= 1) {
      await this.entitlements.assertModule(
        entrepriseId,
        PACK_MODULES.HORAIRES_MULTIPLES,
        locale,
      );
    }

    const horaire = await this.prisma.tenant.horaire.create({
      data: { ...dto, entrepriseId },
      select: HORAIRE_SELECT,
    });
    await this.audit(acteurId, AUDIT_ACTIONS.HORAIRE_CREE, horaire, {
      nom: horaire.nom,
    });
    return normalizeHoraire(horaire);
  }

  async update(
    acteurId: number,
    entrepriseId: number,
    id: number,
    dto: UpdateHoraireDto,
    locale: Locale,
  ) {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw this.invalid("horaireUpdateEmpty", locale);
    }
    await this.findOne(entrepriseId, id, locale);
    const horaire = await this.prisma.tenant.horaire.update({
      where: { id, entrepriseId },
      data: dto,
      select: HORAIRE_SELECT,
    });
    await this.audit(acteurId, AUDIT_ACTIONS.HORAIRE_MODIFIE, horaire, {
      updatedFields: Object.keys(dto),
    });
    return normalizeHoraire(horaire);
  }

  /** Refusé tant que l'horaire est attribué à des utilisateurs. */
  async remove(
    acteurId: number,
    entrepriseId: number,
    id: number,
    locale: Locale,
  ) {
    const horaire = await this.findOne(entrepriseId, id, locale);
    if (horaire.utilisateursCount > 0) {
      throw this.invalid("horaireEnUtilisation", locale, {
        count: horaire.utilisateursCount,
      });
    }
    await this.prisma.tenant.horaire.delete({ where: { id, entrepriseId } });
    await this.audit(acteurId, AUDIT_ACTIONS.HORAIRE_SUPPRIME, horaire, {
      nom: horaire.nom,
    });
  }

  private audit(
    acteurId: number,
    action: AuditActionCode,
    horaire: { id: number; entrepriseId: number },
    details?: Prisma.InputJsonValue,
  ) {
    return this.auditActions.domainAction({
      acteurId,
      action,
      objet: AUDIT_OBJETS.HORAIRE,
      objetId: horaire.id,
      entrepriseId: horaire.entrepriseId,
      details,
    });
  }

  private invalid(
    key: MessageKey,
    locale: Locale,
    params?: Record<string, string | number>,
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
