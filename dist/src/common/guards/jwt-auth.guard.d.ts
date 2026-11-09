import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { type Role } from "@prisma/client";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuthTokenRevocationStore } from "../../modules/auth/session/services/auth-token-revocation.store";
export interface JwtPayload {
    sub: string;
    type?: string;
    role?: Role;
}
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly reflector;
    private readonly prisma;
    private readonly tokenRevocation;
    constructor(jwtService: JwtService, reflector: Reflector, prisma: PrismaService, tokenRevocation: AuthTokenRevocationStore);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private attachUserFromToken;
    private resolveUser;
    private locale;
    private isDocsOrOpenApiPath;
}
