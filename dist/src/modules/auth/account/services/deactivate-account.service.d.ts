import { JwtService } from "@nestjs/jwt";
import { AuditActionsService } from "../../../audit/recorder/services/audit-actions.service";
import { type Locale } from "../../../../common/i18n";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import { AuthTokenRevocationStore } from "../../session/services/auth-token-revocation.store";
export declare class DeactivateAccountService {
    private readonly jwtService;
    private readonly prisma;
    private readonly tokenRevocation;
    private readonly auditActions;
    constructor(jwtService: JwtService, prisma: PrismaService, tokenRevocation: AuthTokenRevocationStore, auditActions: AuditActionsService);
    deactivate(userId: number, accessToken: string, locale: Locale): Promise<void>;
    private remainingTtlSec;
}
