import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import type { Cache } from "cache-manager";
import type Redis from "ioredis";
import { translate, type Locale } from "../../common/i18n";
import { bumpAllCacheGenerations } from "../cache/cache-namespace";
import {
  REDIS_DIRECT_KEY_PATTERNS,
  REDIS_KEYV_SCAN_PATTERN,
} from "./redis-cleanup.constants";
import { REDIS_OTP } from "./redis-otp.constants";

export type RedisCacheCleanupResult = {
  deletedKeys: number;
  cacheKeys: number;
  directKeys: number;
  patterns: readonly string[];
};

@Injectable()
export class RedisCleanupService {
  private readonly logger = new Logger(RedisCleanupService.name);

  constructor(
    @Inject(REDIS_OTP) private readonly redis: Redis | null,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async flushAll(locale: Locale): Promise<RedisCacheCleanupResult> {
    if (!this.redis) {
      throw new ServiceUnavailableException(
        translate(locale, "redisUnavailable"),
      );
    }

    const cacheKeys = await this.countByPattern(REDIS_KEYV_SCAN_PATTERN);
    await this.cache.clear();

    let directKeys = 0;
    for (const pattern of REDIS_DIRECT_KEY_PATTERNS) {
      directKeys += await this.deleteByPattern(pattern);
    }

    bumpAllCacheGenerations();

    const deletedKeys = cacheKeys + directKeys;
    const patterns = [REDIS_KEYV_SCAN_PATTERN, ...REDIS_DIRECT_KEY_PATTERNS];

    this.logger.warn(
      `Redis cache flushed: ${deletedKeys} key(s) removed (cache=${cacheKeys}, direct=${directKeys})`,
    );

    return {
      deletedKeys,
      cacheKeys,
      directKeys,
      patterns,
    };
  }

  private async countByPattern(pattern: string): Promise<number> {
    const redis = this.redis!;
    let cursor = "0";
    let keyCount = 0;

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        200,
      );
      cursor = nextCursor;
      keyCount += keys.length;
    } while (cursor !== "0");

    return keyCount;
  }

  private async deleteByPattern(pattern: string): Promise<number> {
    const redis = this.redis!;
    let cursor = "0";
    let deletedKeys = 0;

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        200,
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        deletedKeys += keys.length;
        await redis.del(...keys);
      }
    } while (cursor !== "0");

    return deletedKeys;
  }
}
