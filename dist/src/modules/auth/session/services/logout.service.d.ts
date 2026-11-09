import { JwtService } from "@nestjs/jwt";
import { AuditActionsService } from "../../../audit/recorder/services/audit-actions.service";
import { type Locale } from "../../../../common/i18n";
import { AuthTokenRevocationStore } from "./auth-token-revocation.store";
export declare class LogoutService {
    private readonly jwtService;
    private readonly tokenRevocation;
    private readonly auditActions;
    constructor(jwtService: JwtService, tokenRevocation: AuthTokenRevocationStore, auditActions: AuditActionsService);
    logout(userId: number, accessToken: string, refreshToken: string | undefined, locale: Locale): Promise<void>;
    private remainingTtlSec;
    private accessFallbackTtlSec;
    private refreshFallbackTtlSec;
}
