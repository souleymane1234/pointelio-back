import * as bcrypt from "bcrypt";
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma, Role, type StatutCompte } from "@prisma/client";
import {
  adminUserPasswordErrorMessage,
  isAdminUserPasswordValid,
} from "../../auth/shared/auth-validation.constants";
import type { AuthUser } from "../../../common/types/request-context";
import { translate, type Locale } from "../../../common/i18n";
import { isPlatformRole } from "../../../common/rbac/role-groups";
import { validationErrorResponse } from "../../../common/utils/response.util";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { bumpAdminUsersCacheGeneration } from "../config/admin-users-cache.config";
import type { UpdateUserDto } from "../dto/update-user.dto";
import { EntitlementsService } from "../../entitlements/entitlements.service";
import { isDecompteEmploye } from "../../entitlements/entitlements.util";
import { UserIdentifiersService } from "./user-identifiers.service";
import { UserScopeService } from "./user-scope.service";
import {
  normalizeUserAdmin,
  USER_ADMIN_SELECT,
  USERS_BCRYPT_ROUNDS,
} from "./user-admin.select";

export type UserUpdateResult = {
  user: ReturnType<typeof normalizeUserAdmin>;
  previous: { role: Role; statut: StatutCompte; entrepriseId: number | null };
};

@Injectable()
export class UsersUpdateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: UserScopeService,
    private readonly identifiers: UserIdentifiersService,
    private readonly entitlements: EntitlementsService,
  ) {}

  async update(
    actor: AuthUser,
    id: number,
    dto: UpdateUserDto,
    locale: Locale,
  ): Promise<UserUpdateResult> {
    const existing = await this.prisma.utilisateur.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        statut: true,
        entrepriseId: true,
        siteId: true,
        horaireId: true,
        salaireJournalier: true,
        email: true,
        telephone: true,
      },
    });
    if (!existing) {
      throw new NotFoundException(translate(locale, "userNotFound"));
    }
    this.scope.assertInScope(actor, existing, locale);
    this.scope.assertCanAssignRole(actor, existing.role);

    const hasAny = (Object.keys(dto) as (keyof UpdateUserDto)[]).some(
      (k) => dto[k] !== undefined,
    );
    if (!hasAny) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "userUpdateEmpty")],
          translate(locale, "validationSummary"),
          locale,
        ),
      );
    }

    const nextRole = dto.role ?? existing.role;
    if (dto.role !== undefined) {
      this.scope.assertCanAssignRole(actor, dto.role);
    }

    const roleChangesScope =
      isPlatformRole(nextRole) !== isPlatformRole(existing.role);
    const nextEntrepriseId =
      dto.entrepriseId !== undefined || roleChangesScope
        ? this.scope.resolveEntrepriseId(
            actor,
            nextRole,
            dto.entrepriseId ?? existing.entrepriseId,
            locale,
          )
        : existing.entrepriseId;
    const entrepriseChanged = nextEntrepriseId !== existing.entrepriseId;

    const nextSiteId =
      dto.siteId !== undefined
        ? dto.siteId
        : entrepriseChanged
          ? null
          : existing.siteId;
    const nextHoraireId =
      dto.horaireId !== undefined
        ? dto.horaireId
        : entrepriseChanged
          ? null
          : existing.horaireId;
    if (
      entrepriseChanged ||
      dto.siteId !== undefined ||
      dto.horaireId !== undefined
    ) {
      await this.scope.assertRattachement(
        nextEntrepriseId,
        { siteId: nextSiteId, horaireId: nextHoraireId },
        locale,
      );
    }

    const nextStatut = dto.statut ?? existing.statut;
    const entreDansLeDecompte =
      isDecompteEmploye({
        entrepriseId: nextEntrepriseId,
        role: nextRole,
        statut: nextStatut,
      }) &&
      (!isDecompteEmploye(existing) || entrepriseChanged);
    if (entreDansLeDecompte && nextEntrepriseId !== null) {
      await this.entitlements.assertCanAddEmploye(nextEntrepriseId, locale);
    }

    if (nextRole === Role.EMPLOYE) {
      const salary = dto.salaireJournalier ?? existing.salaireJournalier;
      if (salary == null || salary < 1) {
        throw this.scope.invalid("salaireJournalierRequis", locale);
      }
    }

    const telephone =
      dto.telephone !== undefined && dto.telephone !== null
        ? this.identifiers.normalizeTelephone(dto.telephone, locale)
        : dto.telephone;

    const nextEmail = dto.email !== undefined ? dto.email : existing.email;
    const nextTelephone =
      telephone !== undefined ? telephone : existing.telephone;
    if (!nextEmail && !nextTelephone) {
      throw this.scope.invalid("userIdentifierRequired", locale);
    }

    await this.identifiers.assertAvailable(
      {
        email: dto.email,
        telephone,
        matricule: dto.matricule,
        entrepriseId: nextEntrepriseId,
      },
      locale,
      id,
    );

    const data: Prisma.UtilisateurUncheckedUpdateInput = {};
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.statut !== undefined) data.statut = dto.statut;
    if (dto.nom !== undefined) data.nom = dto.nom;
    if (dto.prenom !== undefined) data.prenom = dto.prenom;
    if (dto.email !== undefined) data.email = dto.email;
    if (telephone !== undefined) data.telephone = telephone;
    if (entrepriseChanged) data.entrepriseId = nextEntrepriseId;
    if (nextSiteId !== existing.siteId) data.siteId = nextSiteId;
    if (nextHoraireId !== existing.horaireId) data.horaireId = nextHoraireId;
    if (dto.matricule !== undefined) data.matricule = dto.matricule;
    if (dto.poste !== undefined) data.poste = dto.poste;
    if (dto.salaireJournalier !== undefined) {
      data.salaireJournalier = dto.salaireJournalier;
    }
    if (dto.dateEmbauche !== undefined) {
      data.dateEmbauche = dto.dateEmbauche ? new Date(dto.dateEmbauche) : null;
    }
    if (dto.photoUrl !== undefined) data.photoUrl = dto.photoUrl;

    if (dto.password !== undefined) {
      if (!isAdminUserPasswordValid(dto.password, nextRole)) {
        throw new UnprocessableEntityException(
          validationErrorResponse(
            [adminUserPasswordErrorMessage(nextRole)],
            undefined,
            locale,
          ),
        );
      }
      data.passwordHash = await bcrypt.hash(dto.password, USERS_BCRYPT_ROUNDS);
    }

    const updated = await this.prisma.utilisateur.update({
      where: { id },
      data,
      select: USER_ADMIN_SELECT,
    });
    bumpAdminUsersCacheGeneration();
    return {
      user: normalizeUserAdmin(updated),
      previous: {
        role: existing.role,
        statut: existing.statut,
        entrepriseId: existing.entrepriseId,
      },
    };
  }
}
