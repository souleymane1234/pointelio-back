import type Redis from "ioredis";
export declare class JobLockService {
    private readonly redis;
    private readonly logger;
    private readonly instanceId;
    constructor(redis: Redis | null);
    runOncePerSlot(jobName: string, run: () => Promise<void>, now?: Date): Promise<void>;
}
