import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { translate, type Locale } from "../../common/i18n";
import type { MessageKey } from "../../common/i18n/translate";
import { isAbonnementBloque } from "../../common/utils/abonnement.util";
import { validationErrorResponse } from "../../common/utils/response.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
} from "../audit/shared/audit-actions.constants";
import { EntitlementsService } from "../entitlements/entitlements.service";
import {
  computeEntitlements,
  withinLimit,
} from "../entitlements/entitlements.util";
import type { UpdateAbonnementDto } from "./dto/update-abonnement.dto";

const PACK_LIMITS_SELECT = {
  id: true,
  code: true,
  nom: true,
  actif: true,
  prixMensuel: true,
  maxEmployes: true,
  maxSites: true,
  modules: true,
} satisfies Prisma.PackSelect;

@Injectable()
export class AbonnementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService,
    private readonly auditActions: AuditActionsService,
  ) {}

  /** Statut, offre effective, usage et prix de l'abonnement d'une entreprise. */
  async get(entrepriseId: number, locale: Locale) {
    const [droits, usage, entreprise] = await Promise.all([
      this.entitlements.getForEntreprise(entrepriseId, locale),
      this.entitlements.getUsage(entrepriseId),
      this.prisma.entreprise.findUnique({
        where: { id: entrepriseId },
        select: {
          dateDemarrage: true,
          pack: { select: { prixMensuel: true } },
        },
      }),
    ]);
    return {
      ...droits,
      dateDemarrage: entreprise?.dateDemarrage ?? null,
      prixMensuel: entreprise?.pack.prixMensuel ?? 0,
      bloque: isAbonnementBloque(droits.statut, droits.dateEcheance),
      usage,
    };
  }

  async modifier(
    acteurId: number,
    entrepriseId: number,
    dto: UpdateAbonnementDto,
    locale: Locale,
  ) {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw this.invalid("entrepriseUpdateEmpty", locale);
    }

    const current = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: {
        id: true,
        statut: true,
        dateEcheance: true,
        maxSitesOverride: true,
        maxEmployesOverride: true,
        modulesOverride: true,
        pack: { select: PACK_LIMITS_SELECT },
      },
    });
    if (!current) {
      throw new NotFoundException(translate(locale, "entrepriseNotFound"));
    }

    const pack =
      dto.packId !== undefined && dto.packId !== current.pack.id
        ? await this.findActivePack(dto.packId, locale)
        : current.pack;

    const next = computeEntitlements({
      ...current,
      pack,
      maxEmployesOverride:
        dto.maxEmployesOverride !== undefined
          ? dto.maxEmployesOverride
          : current.maxEmployesOverride,
      maxSitesOverride:
        dto.maxSitesOverride !== undefined
          ? dto.maxSitesOverride
          : current.maxSitesOverride,
      modulesOverride:
        dto.modulesOverride !== undefined
          ? dto.modulesOverride
          : current.modulesOverride,
    });

    const usage = await this.entitlements.getUsage(entrepriseId);
    if (
      !withinLimit(next.limites.maxEmployes, usage.employes, 0) ||
      !withinLimit(next.limites.maxSites, usage.sites, 0)
    ) {
      throw this.invalid("abonnementLimitesInsuffisantes", locale, {
        employes: usage.employes,
        sites: usage.sites,
      });
    }

    await this.prisma.entreprise.update({
      where: { id: entrepriseId },
      data: {
        ...(dto.packId !== undefined ? { packId: pack.id } : {}),
        ...(dto.statut !== undefined ? { statut: dto.statut } : {}),
        ...(dto.dateEcheance !== undefined
          ? {
              dateEcheance: dto.dateEcheance
                ? new Date(dto.dateEcheance)
                : null,
            }
          : {}),
        ...(dto.maxEmployesOverride !== undefined
          ? { maxEmployesOverride: dto.maxEmployesOverride }
          : {}),
        ...(dto.maxSitesOverride !== undefined
          ? { maxSitesOverride: dto.maxSitesOverride }
          : {}),
        ...(dto.modulesOverride !== undefined
          ? { modulesOverride: dto.modulesOverride ?? Prisma.DbNull }
          : {}),
      },
    });

    await this.auditActions.domainAction({
      acteurId,
      action: AUDIT_ACTIONS.ABONNEMENT_MODIFIE,
      objet: AUDIT_OBJETS.ENTREPRISE,
      objetId: entrepriseId,
      entrepriseId,
      details: {
        updatedFields: Object.keys(dto),
        fromPack: current.pack.code,
        toPack: pack.code,
      },
    });

    return this.get(entrepriseId, locale);
  }

  private async findActivePack(packId: number, locale: Locale) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
      select: PACK_LIMITS_SELECT,
    });
    if (!pack) throw new NotFoundException(translate(locale, "packNotFound"));
    if (!pack.actif) throw this.invalid("packInactif", locale);
    return pack;
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
