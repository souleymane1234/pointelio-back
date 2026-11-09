import { JwtService } from "@nestjs/jwt";
import { type Role } from "@prisma/client";
import { AuditActionsService } from "../../../audit/recorder/services/audit-actions.service";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import { type Locale } from "../../../../common/i18n";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { AuthTokenRevocationStore } from "./auth-token-revocation.store";
import { AuthUserSessionService } from "./auth-user-session.service";
import { type AuthUserRow } from "./login.select";
export interface AuthenticatedUserSummary {
    id: number;
    role: Role;
    entrepriseId: number | null;
}
export type AccessTokenDiagnosis = {
    ok: true;
    user: AuthenticatedUserSummary;
} | {
    ok: false;
    reason: "jwt_verify_echec" | "jwt_type_incorrect" | "sub_introuvable_en_base" | "token_revoke";
    detail?: string;
};
export declare class TokenService {
    private readonly jwtService;
    private readonly prisma;
    private readonly auditActions;
    private readonly tokenRevocation;
    private readonly authUserSession;
    constructor(jwtService: JwtService, prisma: PrismaService, auditActions: AuditActionsService, tokenRevocation: AuthTokenRevocationStore, authUserSession: AuthUserSessionService);
    signTokenPair(userId: number, role: Role): {
        accessToken: string;
        refreshToken: string;
    };
    buildAuthResponse(user: AuthUserRow): AuthResponse;
    refresh(refreshToken: string, locale: Locale): Promise<Pick<AuthResponse, "accessToken" | "refreshToken">>;
    findAuthUser(userId: number): Promise<AuthUserRow | null>;
    verifyAccessTokenAndGetUser(token: string): Promise<AuthenticatedUserSummary | null>;
    verifyAccessTokenAndGetUserId(token: string): Promise<number | null>;
    verifyAccessTokenDiagnose(token: string): Promise<AccessTokenDiagnosis>;
}
