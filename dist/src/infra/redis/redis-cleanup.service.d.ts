import type { Cache } from "cache-manager";
import type Redis from "ioredis";
import { type Locale } from "../../common/i18n";
export type RedisCacheCleanupResult = {
    deletedKeys: number;
    cacheKeys: number;
    directKeys: number;
    patterns: readonly string[];
};
export declare class RedisCleanupService {
    private readonly redis;
    private readonly cache;
    private readonly logger;
    constructor(redis: Redis | null, cache: Cache);
    flushAll(locale: Locale): Promise<RedisCacheCleanupResult>;
    private countByPattern;
    private deleteByPattern;
}
