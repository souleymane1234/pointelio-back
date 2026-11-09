import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { StatutCompte } from "@prisma/client";
import type { PackModule } from "../../common/constants/pack-modules.constants";
import { translate, type Locale } from "../../common/i18n";
import { validationErrorResponse } from "../../common/utils/response.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import {
  computeEntitlements,
  type Entitlements,
  ROLES_DECOMPTES_EMPLOYES,
  withinLimit,
} from "./entitlements.util";

/** Limites et modules effectifs d'une entreprise : seul point de calcul. */
@Injectable()
export class EntitlementsService {
  constructor(private readonly prisma: PrismaService) {}

  async getForEntreprise(
    entrepriseId: number,
    locale: Locale,
  ): Promise<Entitlements> {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: {
        id: true,
        statut: true,
        dateEcheance: true,
        maxSitesOverride: true,
        maxEmployesOverride: true,
        modulesOverride: true,
        pack: {
          select: {
            id: true,
            code: true,
            nom: true,
            maxEmployes: true,
            maxSites: true,
            modules: true,
          },
        },
      },
    });
    if (!entreprise) {
      throw new NotFoundException(translate(locale, "entrepriseNotFound"));
    }
    return computeEntitlements(entreprise);
  }

  async getUsage(entrepriseId: number) {
    const [employes, sites] = await Promise.all([
      this.countEmployes(entrepriseId),
      this.prisma.site.count({ where: { entrepriseId, actif: true } }),
    ]);
    return { employes, sites };
  }

  async hasModule(entrepriseId: number, module: PackModule): Promise<boolean> {
    const { modules } = await this.getForEntreprise(entrepriseId, "fr");
    return modules.includes(module);
  }

  async assertModule(
    entrepriseId: number,
    module: PackModule,
    locale: Locale,
  ): Promise<void> {
    if (!(await this.hasModule(entrepriseId, module))) {
      throw new ForbiddenException(
        translate(locale, "moduleNonInclus", { module }),
      );
    }
  }

  async assertCanAddSite(entrepriseId: number, locale: Locale): Promise<void> {
    const [{ limites }, sites] = await Promise.all([
      this.getForEntreprise(entrepriseId, locale),
      this.prisma.site.count({ where: { entrepriseId, actif: true } }),
    ]);
    if (!withinLimit(limites.maxSites, sites)) {
      throw this.limitReached("limiteSitesAtteinte", limites.maxSites, locale);
    }
  }

  async assertCanAddEmploye(
    entrepriseId: number,
    locale: Locale,
    ajout = 1,
  ): Promise<void> {
    const [{ limites }, employes] = await Promise.all([
      this.getForEntreprise(entrepriseId, locale),
      this.countEmployes(entrepriseId),
    ]);
    if (!withinLimit(limites.maxEmployes, employes, ajout)) {
      throw this.limitReached(
        "limiteEmployesAtteinte",
        limites.maxEmployes,
        locale,
      );
    }
  }

  private countEmployes(entrepriseId: number) {
    return this.prisma.utilisateur.count({
      where: {
        entrepriseId,
        role: { in: [...ROLES_DECOMPTES_EMPLOYES] },
        statut: { not: StatutCompte.DESACTIVE },
      },
    });
  }

  private limitReached(
    key: "limiteSitesAtteinte" | "limiteEmployesAtteinte",
    limit: number | null,
    locale: Locale,
  ) {
    return new UnprocessableEntityException(
      validationErrorResponse(
        [translate(locale, key, { limit: limit ?? 0 })],
        undefined,
        locale,
      ),
    );
  }
}
