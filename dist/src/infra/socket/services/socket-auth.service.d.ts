import { ConfigService } from "@nestjs/config";
import { Socket } from "socket.io";
import { TokenService, type AuthenticatedUserSummary } from "../../../modules/auth/session/services/token.service";
export type AuthenticatedSocketUser = AuthenticatedUserSummary;
export declare class SocketAuthService {
    private readonly tokenService;
    private readonly config;
    constructor(tokenService: TokenService, config: ConfigService);
    resolveAuthenticatedUserId(client: Socket): Promise<number | null>;
    resolveAuthenticatedUser(client: Socket): Promise<AuthenticatedSocketUser | null>;
    verifyAccessTokenAndGetUserId(token: string): Promise<number | null>;
    isPlainUserIdAllowed(): boolean;
    extractPlainUserId(client: Socket): number | null;
    extractBearerToken(client: Socket): string | null;
    buildHandshakeDebug(client: Socket): Record<string, unknown>;
    redactJwtLike(value: string): string;
    describeAuthFailure(client: Socket): Promise<{
        summary: string;
        handshake: Record<string, unknown>;
    }>;
}
export declare function parsePlainUserId(raw: unknown): number | null;
