import type { RequestHandler } from "express";
import type Redis from "ioredis";
import type { PrismaService } from "../../infra/prisma/prisma.service";
export declare const HEALTH_LIVE_PATH = "/api/v1/health/live";
export declare const HEALTH_READY_PATH = "/api/v1/health/ready";
type HealthDependencies = {
    prisma: PrismaService;
    redis: Redis | null;
};
export declare function createHealthHandlers({ prisma, redis }: HealthDependencies): {
    live: RequestHandler;
    ready: RequestHandler;
    markShuttingDown: () => void;
};
export {};
