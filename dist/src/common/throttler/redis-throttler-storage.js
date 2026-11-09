"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisThrottlerStorage = void 0;
class RedisThrottlerStorage {
    redis;
    prefix;
    constructor(redis, prefix = "throttler") {
        this.redis = redis;
        this.prefix = prefix;
    }
    async increment(key, ttl, limit, blockDuration, throttlerName) {
        const counterKey = `${this.prefix}:${throttlerName}:${key}:hits`;
        const blockKey = `${this.prefix}:${throttlerName}:${key}:blocked`;
        const blockTtlMs = await this.redis.pttl(blockKey);
        if (blockTtlMs > 0) {
            const counterTtlMs = await this.redis.pttl(counterKey);
            const counterVal = await this.redis.get(counterKey);
            const totalHits = counterVal ? Number.parseInt(counterVal, 10) : 0;
            return {
                totalHits,
                timeToExpire: counterTtlMs > 0 ? counterTtlMs : 0,
                isBlocked: true,
                timeToBlockExpire: blockTtlMs,
            };
        }
        const newTotalHits = await this.redis.incr(counterKey);
        if (newTotalHits === 1) {
            await this.redis.pexpire(counterKey, ttl);
        }
        else {
            const counterTtlMs = await this.redis.pttl(counterKey);
            if (counterTtlMs < 0) {
                await this.redis.pexpire(counterKey, ttl);
            }
        }
        const timeToExpire = await this.redis.pttl(counterKey);
        if (newTotalHits > limit) {
            await this.redis.set(blockKey, "1", "PX", blockDuration);
            const timeToBlockExpire = await this.redis.pttl(blockKey);
            return {
                totalHits: newTotalHits,
                timeToExpire: timeToExpire > 0 ? timeToExpire : 0,
                isBlocked: true,
                timeToBlockExpire: timeToBlockExpire > 0 ? timeToBlockExpire : blockDuration,
            };
        }
        return {
            totalHits: newTotalHits,
            timeToExpire: timeToExpire > 0 ? timeToExpire : 0,
            isBlocked: false,
            timeToBlockExpire: 0,
        };
    }
}
exports.RedisThrottlerStorage = RedisThrottlerStorage;
//# sourceMappingURL=redis-throttler-storage.js.map