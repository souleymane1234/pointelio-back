import { AuditActionsService } from "../../../audit/recorder/services/audit-actions.service";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import { type Locale } from "../../../../common/i18n";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { TokenService } from "./token.service";
import { AuthPhoneService } from "../../phone/services/auth-phone.service";
import { AuthUserSessionService } from "./auth-user-session.service";
export declare class LoginService {
    private readonly prisma;
    private readonly tokenService;
    private readonly auditActions;
    private readonly authUserSession;
    private readonly authPhone;
    private readonly logger;
    constructor(prisma: PrismaService, tokenService: TokenService, auditActions: AuditActionsService, authUserSession: AuthUserSessionService, authPhone: AuthPhoneService);
    loginWithPhone(phoneNumber: string, secretCode: string, locale: Locale): Promise<AuthResponse>;
    loginWithEmail(email: string, password: string, locale: Locale): Promise<AuthResponse>;
    loginAdminWithEmail(email: string, password: string, locale: Locale): Promise<AuthResponse>;
    private authenticateLocal;
    private verifyLocalCredentials;
    private findUserForLocalLogin;
}
