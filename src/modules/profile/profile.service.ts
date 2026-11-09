import * as bcrypt from "bcrypt";
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma, StatutCompte } from "@prisma/client";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { translate, type Locale } from "../../common/i18n";
import type { MessageKey } from "../../common/i18n/translate";
import { validationErrorResponse } from "../../common/utils/response.util";
import {
  isAdminUserPasswordValid,
  isMobileRole,
} from "../auth/shared/auth-validation.constants";
import { USERS_BCRYPT_ROUNDS } from "../utilisateurs/services/user-admin.select";
import type { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

/** Champs stricts pour GET/PATCH profile — une seule requête. */
const profileUserSelect = {
  id: true,
  entrepriseId: true,
  siteId: true,
  horaireId: true,
  matricule: true,
  nom: true,
  prenom: true,
  email: true,
  telephone: true,
  role: true,
  statut: true,
  poste: true,
  salaireJournalier: true,
  dateEmbauche: true,
  photoUrl: true,
  derniereConnexion: true,
  createdAt: true,
  updatedAt: true,
  entreprise: {
    select: { id: true, raisonSociale: true, nomCommercial: true },
  },
  site: { select: { id: true, nom: true } },
} satisfies Prisma.UtilisateurSelect;

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditActions: AuditActionsService,
  ) {}

  async me(userId: number) {
    const [user, unreadNotificationsCount] = await Promise.all([
      this.prisma.utilisateur.findUnique({
        where: { id: userId },
        select: profileUserSelect,
      }),
      this.prisma.notification.count({
        where: { utilisateurId: userId, luAt: null },
      }),
    ]);

    if (!user || user.statut !== StatutCompte.ACTIF) {
      throw new NotFoundException();
    }

    return { ...user, unreadNotificationsCount };
  }

  async update(userId: number, dto: UpdateProfileDto, locale: Locale) {
    const nextEmail = dto.email?.trim().toLowerCase();

    if (nextEmail) {
      const existing = await this.prisma.utilisateur.findUnique({
        where: { email: nextEmail },
        select: { id: true },
      });
      if (existing && existing.id !== userId) {
        throw new UnprocessableEntityException(
          validationErrorResponse(
            [translate(locale, "emailAlreadyUsed")],
            undefined,
            locale,
          ),
        );
      }
    }

    const updated = await this.prisma.utilisateur.update({
      where: { id: userId },
      data: {
        ...(dto.nom !== undefined ? { nom: dto.nom } : {}),
        ...(dto.prenom !== undefined ? { prenom: dto.prenom } : {}),
        ...(nextEmail ? { email: nextEmail } : {}),
        ...(dto.photoUrl !== undefined
          ? { photoUrl: dto.photoUrl.trim() || null }
          : {}),
      },
      select: profileUserSelect,
    });

    if (updated.statut !== StatutCompte.ACTIF) {
      throw new NotFoundException();
    }

    await this.auditActions.profileUpdated(userId, {
      updatedFields: Object.keys(dto).filter(
        (key) => (dto as Record<string, unknown>)[key] !== undefined,
      ),
    });

    return updated;
  }

  /** Mot de passe (back-office) ou PIN (mobile), après vérification de l'actuel. */
  async changePassword(userId: number, dto: ChangePasswordDto, locale: Locale) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { role: true, statut: true, passwordHash: true },
    });
    if (!user || user.statut !== StatutCompte.ACTIF) {
      throw new NotFoundException();
    }

    const currentOk =
      user.passwordHash !== null &&
      (await bcrypt.compare(dto.currentPassword, user.passwordHash));
    if (!currentOk) throw this.invalid("currentPasswordInvalid", locale);

    if (!isAdminUserPasswordValid(dto.newPassword, user.role)) {
      throw this.invalid(
        isMobileRole(user.role) ? "newPasswordInvalidMobile" : "newPasswordInvalid",
        locale,
      );
    }
    if (dto.newPassword === dto.currentPassword) {
      throw this.invalid("passwordUnchanged", locale);
    }

    await this.prisma.utilisateur.update({
      where: { id: userId },
      data: {
        passwordHash: await bcrypt.hash(dto.newPassword, USERS_BCRYPT_ROUNDS),
      },
    });
    await this.auditActions.authPasswordReset(userId, { source: "profil" });
  }

  private invalid(key: MessageKey, locale: Locale) {
    return new UnprocessableEntityException(
      validationErrorResponse([translate(locale, key)], undefined, locale),
    );
  }
}
