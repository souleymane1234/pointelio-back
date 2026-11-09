import { PrismaService } from "../../../../infra/prisma/prisma.service";
export declare class AuthUserSessionService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    touchLastLoginAt(userId: number): void;
}
