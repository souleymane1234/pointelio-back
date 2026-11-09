import type { ThrottlerStorage } from "@nestjs/throttler";
import type Redis from "ioredis";
type ThrottlerStorageRecord = {
    totalHits: number;
    timeToExpire: number;
    isBlocked: boolean;
    timeToBlockExpire: number;
};
export declare class RedisThrottlerStorage implements ThrottlerStorage {
    private readonly redis;
    private readonly prefix;
    constructor(redis: Redis, prefix?: string);
    increment(key: string, ttl: number, limit: number, blockDuration: number, throttlerName: string): Promise<ThrottlerStorageRecord>;
}
export {};
