import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma/prisma.service";
export declare class PerfProfilingService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly logger;
    private timer?;
    private loop?;
    private readonly intervalMs;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    private flush;
    onModuleDestroy(): void;
}
