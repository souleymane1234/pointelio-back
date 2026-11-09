import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { Role, StatutCompte } from "@prisma/client";
import type { AuthUser } from "../../../common/types/request-context";
import { type Locale } from "../../../common/i18n";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { bumpAdminUsersCacheGeneration } from "../config/admin-users-cache.config";
import type { CreateUserDto } from "../dto/create-user.dto";
import { EntitlementsService } from "../../entitlements/entitlements.service";
import { isDecompteEmploye } from "../../entitlements/entitlements.util";
import { UserIdentifiersService } from "./user-identifiers.service";
import { UserScopeService } from "./user-scope.service";
import {
  normalizeUserAdmin,
  USER_ADMIN_SELECT,
  USERS_BCRYPT_ROUNDS,
} from "./user-admin.select";

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: UserScopeService,
    private readonly identifiers: UserIdentifiersService,
    private readonly entitlements: EntitlementsService,
  ) {}

  async create(actor: AuthUser, dto: CreateUserDto, locale: Locale) {
    this.scope.assertCanAssignRole(actor, dto.role);

    const entrepriseId = this.scope.resolveEntrepriseId(
      actor,
      dto.role,
      dto.entrepriseId,
      locale,
    );
    await this.scope.assertRattachement(
      entrepriseId,
      { siteId: dto.siteId, horaireId: dto.horaireId },
      locale,
    );

    const telephone = this.identifiers.normalizeTelephone(
      dto.telephone,
      locale,
    );
    await this.identifiers.assertAvailable(
      { email: dto.email, telephone, matricule: dto.matricule, entrepriseId },
      locale,
    );

    if (
      dto.role === Role.EMPLOYE &&
      (dto.salaireJournalier === undefined || dto.salaireJournalier < 1)
    ) {
      throw this.scope.invalid("salaireJournalierRequis", locale);
    }

    const passwordHash = await bcrypt.hash(dto.password, USERS_BCRYPT_ROUNDS);
    const statut = dto.statut ?? StatutCompte.ACTIF;

    if (
      entrepriseId !== null &&
      isDecompteEmploye({ entrepriseId, role: dto.role, statut })
    ) {
      await this.entitlements.assertCanAddEmploye(entrepriseId, locale);
    }

    const created = await this.prisma.utilisateur.create({
      data: {
        entrepriseId,
        siteId: dto.siteId,
        horaireId: dto.horaireId,
        matricule: dto.matricule,
        nom: dto.nom,
        prenom: dto.prenom,
        email: dto.email,
        telephone,
        passwordHash,
        role: dto.role,
        statut,
        poste: dto.poste,
        salaireJournalier: dto.salaireJournalier,
        dateEmbauche: dto.dateEmbauche ? new Date(dto.dateEmbauche) : undefined,
        photoUrl: dto.photoUrl,
      },
      select: USER_ADMIN_SELECT,
    });
    bumpAdminUsersCacheGeneration();
    return normalizeUserAdmin(created);
  }
}
