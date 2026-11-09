import * as bcrypt from "bcrypt";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { StatutCompte } from "@prisma/client";
import { AuditActionsService } from "../../../audit/recorder/services/audit-actions.service";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import { translate, type Locale } from "../../../../common/i18n";
import { BACKOFFICE_ROLES } from "../../../../common/rbac/role-groups";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { type LocalLoginUser, localLoginUserSelect } from "./login.select";
import { TokenService } from "./token.service";
import { AuthPhoneService } from "../../phone/services/auth-phone.service";
import { AuthUserSessionService } from "./auth-user-session.service";

type AuthenticateLocalOptions = {
  requireBackoffice: boolean;
  credentialsKey?: "invalidCredentials" | "invalidPin";
};

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly auditActions: AuditActionsService,
    private readonly authUserSession: AuthUserSessionService,
    private readonly authPhone: AuthPhoneService,
  ) {}

  /** Parcours téléphone : numéro + code PIN. */
  async loginWithPhone(
    phoneNumber: string,
    secretCode: string,
    locale: Locale,
  ): Promise<AuthResponse> {
    const telephone = this.authPhone.normalizeRequiringDialCode(
      phoneNumber,
      locale,
    );
    return this.authenticateLocal({ telephone }, secretCode, locale, {
      requireBackoffice: false,
      credentialsKey: "invalidPin",
    });
  }

  /** Parcours e-mail : e-mail + mot de passe. */
  async loginWithEmail(
    email: string,
    password: string,
    locale: Locale,
  ): Promise<AuthResponse> {
    return this.authenticateLocal({ email }, password, locale, {
      requireBackoffice: false,
      credentialsKey: "invalidCredentials",
    });
  }

  /** Backoffice web : réservé à l'équipe Pointelio et aux admins / managers d'entreprise. */
  async loginAdminWithEmail(
    email: string,
    password: string,
    locale: Locale,
  ): Promise<AuthResponse> {
    return this.authenticateLocal({ email }, password, locale, {
      requireBackoffice: true,
    });
  }

  private async authenticateLocal(
    params: { email?: string; telephone?: string },
    password: string,
    locale: Locale,
    options: AuthenticateLocalOptions,
  ): Promise<AuthResponse> {
    const startedAt = Date.now();
    const user = await this.verifyLocalCredentials(
      params,
      password,
      locale,
      options,
    );

    void this.auditActions.authLogin(user.id);
    this.authUserSession.touchLastLoginAt(user.id);

    const response = this.tokenService.buildAuthResponse(user);
    this.logger.log(`200 - login total=${Date.now() - startedAt}ms`);
    return response;
  }

  private async verifyLocalCredentials(
    params: { email?: string; telephone?: string },
    password: string,
    locale: Locale,
    options: AuthenticateLocalOptions,
  ): Promise<LocalLoginUser> {
    const invalidCredentials = () =>
      new UnauthorizedException(
        translate(locale, options.credentialsKey ?? "invalidCredentials"),
      );

    const user = await this.findUserForLocalLogin(params);

    if (
      !user ||
      !user.passwordHash ||
      (options.requireBackoffice && !BACKOFFICE_ROLES.includes(user.role))
    ) {
      throw invalidCredentials();
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw invalidCredentials();
    }

    if (user.statut !== StatutCompte.ACTIF) {
      throw new UnauthorizedException(translate(locale, "accountInactive"));
    }

    return user;
  }

  private async findUserForLocalLogin(params: {
    email?: string;
    telephone?: string;
  }): Promise<LocalLoginUser | null> {
    const email = params.email?.trim().toLowerCase();
    if (email) {
      return this.prisma.utilisateur.findUnique({
        where: { email },
        select: localLoginUserSelect,
      });
    }

    const telephone = params.telephone?.trim();
    if (!telephone) {
      return null;
    }

    return this.prisma.utilisateur.findUnique({
      where: { telephone },
      select: localLoginUserSelect,
    });
  }
}
