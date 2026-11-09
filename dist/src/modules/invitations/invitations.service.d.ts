import { ConfigService } from "@nestjs/config";
import { StatutCompte, type Role } from "@prisma/client";
import { type Locale } from "../../common/i18n";
import type { AuthUser } from "../../common/types/request-context";
import { EmailingService } from "../../infra/mail/emailing.service";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import { TokenService } from "../auth/session/services/token.service";
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
    token?: string;
};
export declare class InvitationsService {
    private readonly prisma;
    private readonly config;
    private readonly emailing;
    private readonly tokenService;
    private readonly auditActions;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService, emailing: EmailingService, tokenService: TokenService, auditActions: AuditActionsService);
    inviter(acteurId: number, user: InvitableUser, locale: Locale): Promise<InvitationResult>;
    renvoyer(actor: AuthUser, utilisateurId: number, locale: Locale): Promise<InvitationResult>;
    verifier(token: string, locale: Locale): Promise<{
        email: string;
        role: import("@prisma/client").$Enums.Role;
        expireAt: Date;
        entreprise: string;
    }>;
    accepter(token: string, password: string, locale: Locale): Promise<import("../auth/session/interfaces/auth-response.interface").AuthResponse>;
    private findValid;
    private sendEmail;
    private ttlHours;
    private activationUrl;
    private exposeToken;
    private invalid;
}
