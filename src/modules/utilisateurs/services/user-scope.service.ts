import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import type { Role } from "@prisma/client";
import type { AuthUser } from "../../../common/types/request-context";
import { translate, type Locale } from "../../../common/i18n";
import type { MessageKey } from "../../../common/i18n/translate";
import {
  canAssignRole,
  isPlatformRole,
} from "../../../common/rbac/role-groups";
import { validationErrorResponse } from "../../../common/utils/response.util";
import { PrismaService } from "../../../infra/prisma/prisma.service";

/**
 * Périmètre multi-tenant de l'admin utilisateurs :
 * - équipe Pointelio : toutes les entreprises ;
 * - admin d'entreprise : uniquement les comptes de son entreprise.
 */
@Injectable()
export class UserScopeService {
  constructor(private readonly prisma: PrismaService) {}

  /** Entreprise imposée par le périmètre de l'acteur (null = aucune restriction). */
  scopedEntrepriseId(actor: AuthUser): number | null {
    return isPlatformRole(actor.role) ? null : (actor.entrepriseId ?? -1);
  }

  /** 404 si la cible est hors périmètre : on ne révèle pas son existence. */
  assertInScope(
    actor: AuthUser,
    target: { entrepriseId: number | null },
    locale: Locale,
  ): void {
    const scoped = this.scopedEntrepriseId(actor);
    if (scoped !== null && target.entrepriseId !== scoped) {
      throw new NotFoundException(translate(locale, "userNotFound"));
    }
  }

  assertCanAssignRole(actor: AuthUser, role: Role): void {
    if (!canAssignRole(actor.role, role)) {
      throw new ForbiddenException();
    }
  }

  /**
   * Entreprise du compte selon son rôle : null pour l'équipe Pointelio,
   * obligatoire pour les autres (imposée par le périmètre d'un admin d'entreprise).
   */
  resolveEntrepriseId(
    actor: AuthUser,
    role: Role,
    requested: number | null | undefined,
    locale: Locale,
  ): number | null {
    if (isPlatformRole(role)) {
      return null;
    }
    const scoped = this.scopedEntrepriseId(actor);
    const entrepriseId = scoped ?? requested ?? null;
    if (!entrepriseId) {
      throw this.invalid("userEntrepriseRequired", locale);
    }
    return entrepriseId;
  }

  /** Site, horaire et entreprise doivent exister et appartenir à la même entreprise. */
  async assertRattachement(
    entrepriseId: number | null,
    refs: { siteId?: number | null; horaireId?: number | null },
    locale: Locale,
  ): Promise<void> {
    if (entrepriseId === null) {
      if (refs.siteId || refs.horaireId) {
        throw this.invalid("userRattachementInvalid", locale);
      }
      return;
    }

    const [entreprise, site, horaire] = await Promise.all([
      this.prisma.entreprise.findUnique({
        where: { id: entrepriseId },
        select: { id: true },
      }),
      refs.siteId
        ? this.prisma.site.findFirst({
            where: { id: refs.siteId, entrepriseId },
            select: { id: true },
          })
        : null,
      refs.horaireId
        ? this.prisma.horaire.findFirst({
            where: { id: refs.horaireId, entrepriseId },
            select: { id: true },
          })
        : null,
    ]);

    if (!entreprise || (refs.siteId && !site) || (refs.horaireId && !horaire)) {
      throw this.invalid("userRattachementInvalid", locale);
    }
  }

  invalid(key: MessageKey, locale: Locale) {
    return new UnprocessableEntityException(
      validationErrorResponse([translate(locale, key)], undefined, locale),
    );
  }
}
