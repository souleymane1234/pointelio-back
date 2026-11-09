import * as bcrypt from "bcrypt";
import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StatutCompte, type Role } from "@prisma/client";
import { translate, type Locale } from "../../common/i18n";
import type { MessageKey } from "../../common/i18n/translate";
import { canAssignRole, isPlatformRole } from "../../common/rbac/role-groups";
import type { AuthUser } from "../../common/types/request-context";
import { validationErrorResponse } from "../../common/utils/response.util";
import { EmailingService } from "../../infra/mail/emailing.service";
import { generateGenericMessageEmail } from "../../infra/mail/templates";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
} from "../audit/shared/audit-actions.constants";
import {
  adminUserPasswordErrorMessage,
  isAdminUserPasswordValid,
} from "../auth/shared/auth-validation.constants";
import { TokenService } from "../auth/session/services/token.service";
import { authUserSelect } from "../auth/session/services/login.select";
import {
  generateInvitationToken,
  hashInvitationToken,
} from "./invitation-token.util";

const DEFAULT_TTL_HOURS = 72;

export type InvitableUser = {
  id: number;
  email: string | null;
  role: Role;
  statut: StatutCompte;
  entrepriseId: number | null;
};

export type InvitationResult = {
  envoyee: boolean;
  expireAt: Date;
  /** Uniquement si INVITATION_RETURN_TOKEN_IN_RESPONSE=true (dev, interdit en production). */
  token?: string;
};

/** Activation de compte par lien : un compte INVITE définit son mot de passe. */
@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly emailing: EmailingService,
    private readonly tokenService: TokenService,
    private readonly auditActions: AuditActionsService,
  ) {}

  /**
   * Crée l'invitation (remplace une invitation non utilisée) et l'envoie par e-mail.
   * Un échec d'envoi n'annule pas l'invitation : `envoyee` vaut false et
   * l'administrateur peut la renvoyer.
   */
  async inviter(
    acteurId: number,
    user: InvitableUser,
    locale: Locale,
  ): Promise<InvitationResult> {
    if (!user.email || !user.entrepriseId) {
      throw this.invalid("invitationEmailRequis", locale);
    }
    if (user.statut !== StatutCompte.INVITE) {
      throw this.invalid("invitationNonApplicable", locale);
    }

    const { token, tokenHash } = generateInvitationToken();
    const expireAt = new Date(Date.now() + this.ttlHours() * 3_600_000);

    const [, invitation, entreprise] = await this.prisma.$transaction([
      this.prisma.invitation.deleteMany({
        where: {
          email: user.email,
          entrepriseId: user.entrepriseId,
          utiliseeAt: null,
        },
      }),
      this.prisma.invitation.create({
        data: {
          entrepriseId: user.entrepriseId,
          email: user.email,
          role: user.role,
          tokenHash,
          expireAt,
        },
        select: { id: true },
      }),
      this.prisma.entreprise.findUniqueOrThrow({
        where: { id: user.entrepriseId },
        select: { raisonSociale: true, nomCommercial: true },
      }),
    ]);

    const envoyee = await this.sendEmail(
      user.email,
      token,
      expireAt,
      entreprise.nomCommercial ?? entreprise.raisonSociale,
      locale,
    );

    await this.auditActions.domainAction({
      acteurId,
      action: AUDIT_ACTIONS.INVITATION_ENVOYEE,
      objet: AUDIT_OBJETS.INVITATION,
      objetId: invitation.id,
      entrepriseId: user.entrepriseId,
      details: { utilisateurId: user.id, envoyee },
    });

    return {
      envoyee,
      expireAt,
      ...(this.exposeToken() ? { token } : {}),
    };
  }

  /** Renvoi depuis le backoffice, dans le périmètre de l'acteur. */
  async renvoyer(actor: AuthUser, utilisateurId: number, locale: Locale) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: {
        id: true,
        email: true,
        role: true,
        statut: true,
        entrepriseId: true,
      },
    });
    const inScope =
      user &&
      (isPlatformRole(actor.role) ||
        user.entrepriseId === actor.entrepriseId) &&
      canAssignRole(actor.role, user.role);
    if (!inScope) {
      throw new NotFoundException(translate(locale, "userNotFound"));
    }
    return this.inviter(actor.id, user, locale);
  }

  /** Informations affichées sur la page d'activation. */
  async verifier(token: string, locale: Locale) {
    const invitation = await this.findValid(token, locale);
    return {
      email: invitation.email,
      role: invitation.role,
      expireAt: invitation.expireAt,
      entreprise:
        invitation.entreprise.nomCommercial ??
        invitation.entreprise.raisonSociale,
    };
  }

  /** Définit le mot de passe, active le compte et ouvre la session. */
  async accepter(token: string, password: string, locale: Locale) {
    const invitation = await this.findValid(token, locale);
    const user = await this.prisma.utilisateur.findFirst({
      where: {
        email: invitation.email,
        entrepriseId: invitation.entrepriseId,
        statut: StatutCompte.INVITE,
      },
      select: { id: true, role: true },
    });
    if (!user) {
      throw this.invalid("invitationInvalide", locale);
    }
    if (!isAdminUserPasswordValid(password, user.role)) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [adminUserPasswordErrorMessage(user.role)],
          undefined,
          locale,
        ),
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const activated = await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.invitation.updateMany({
        where: { id: invitation.id, utiliseeAt: null },
        data: { utiliseeAt: new Date() },
      });
      if (count === 0) {
        throw this.invalid("invitationInvalide", locale);
      }
      return tx.utilisateur.update({
        where: { id: user.id, statut: StatutCompte.INVITE },
        data: { passwordHash, statut: StatutCompte.ACTIF },
        select: authUserSelect,
      });
    });

    await this.auditActions.domainAction({
      acteurId: user.id,
      action: AUDIT_ACTIONS.INVITATION_ACCEPTEE,
      objet: AUDIT_OBJETS.INVITATION,
      objetId: invitation.id,
      entrepriseId: invitation.entrepriseId,
    });

    return this.tokenService.buildAuthResponse(activated);
  }

  private async findValid(token: string, locale: Locale) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { tokenHash: hashInvitationToken(token) },
      select: {
        id: true,
        email: true,
        role: true,
        entrepriseId: true,
        expireAt: true,
        utiliseeAt: true,
        entreprise: { select: { raisonSociale: true, nomCommercial: true } },
      },
    });
    if (
      !invitation ||
      invitation.utiliseeAt ||
      invitation.expireAt.getTime() < Date.now()
    ) {
      throw this.invalid("invitationInvalide", locale);
    }
    return invitation;
  }

  private async sendEmail(
    email: string,
    token: string,
    expireAt: Date,
    entreprise: string,
    locale: Locale,
  ): Promise<boolean> {
    if (!this.emailing.isEnabled()) {
      this.logger.warn(
        `E-mail indisponible : invitation créée pour ${email} mais non envoyée.`,
      );
      return false;
    }
    const lien = `${this.activationUrl()}?token=${encodeURIComponent(token)}`;
    const { subject, html, text } = generateGenericMessageEmail({
      locale,
      subject: translate(locale, "invitationEmailSubject"),
      heading: translate(locale, "invitationEmailHeading"),
      message: translate(locale, "invitationEmailMessage", {
        entreprise,
        date: expireAt.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR"),
      }),
      action: { label: translate(locale, "invitationEmailAction"), href: lien },
    });
    try {
      await this.emailing.send({ to: [email], subject, html, text });
      return true;
    } catch (error) {
      this.logger.warn(
        `Échec d'envoi de l'invitation à ${email}: ${(error as Error).message}`,
      );
      return false;
    }
  }

  private ttlHours(): number {
    const parsed = Number(this.config.get<string>("INVITATION_TTL_HOURS"));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_HOURS;
  }

  private activationUrl(): string {
    return (
      this.config.get<string>("INVITATION_ACTIVATION_URL") ??
      "http://localhost:5010/activation"
    );
  }

  private exposeToken(): boolean {
    return (
      this.config.get<string>("INVITATION_RETURN_TOKEN_IN_RESPONSE") === "true"
    );
  }

  private invalid(key: MessageKey, locale: Locale) {
    return new UnprocessableEntityException(
      validationErrorResponse([translate(locale, key)], undefined, locale),
    );
  }
}
