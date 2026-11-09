"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RedisCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCleanupService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const i18n_1 = require("../../common/i18n");
const cache_namespace_1 = require("../cache/cache-namespace");
const redis_cleanup_constants_1 = require("./redis-cleanup.constants");
const redis_otp_constants_1 = require("./redis-otp.constants");
let RedisCleanupService = RedisCleanupService_1 = class RedisCleanupService {
    redis;
    cache;
    logger = new common_1.Logger(RedisCleanupService_1.name);
    constructor(redis, cache) {
        this.redis = redis;
        this.cache = cache;
    }
    async flushAll(locale) {
        if (!this.redis) {
            throw new common_1.ServiceUnavailableException((0, i18n_1.translate)(locale, "redisUnavailable"));
        }
        const cacheKeys = await this.countByPattern(redis_cleanup_constants_1.REDIS_KEYV_SCAN_PATTERN);
        await this.cache.clear();
        let directKeys = 0;
        for (const pattern of redis_cleanup_constants_1.REDIS_DIRECT_KEY_PATTERNS) {
            directKeys += await this.deleteByPattern(pattern);
        }
        (0, cache_namespace_1.bumpAllCacheGenerations)();
        const deletedKeys = cacheKeys + directKeys;
        const patterns = [redis_cleanup_constants_1.REDIS_KEYV_SCAN_PATTERN, ...redis_cleanup_constants_1.REDIS_DIRECT_KEY_PATTERNS];
        this.logger.warn(`Redis cache flushed: ${deletedKeys} key(s) removed (cache=${cacheKeys}, direct=${directKeys})`);
        return {
            deletedKeys,
            cacheKeys,
            directKeys,
            patterns,
        };
    }
    async countByPattern(pattern) {
        const redis = this.redis;
        let cursor = "0";
        let keyCount = 0;
        do {
            const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 200);
            cursor = nextCursor;
            keyCount += keys.length;
        } while (cursor !== "0");
        return keyCount;
    }
    async deleteByPattern(pattern) {
        const redis = this.redis;
        let cursor = "0";
        let deletedKeys = 0;
        do {
            const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 200);
            cursor = nextCursor;
            if (keys.length > 0) {
                deletedKeys += keys.length;
                await redis.del(...keys);
            }
        } while (cursor !== "0");
        return deletedKeys;
    }
};
exports.RedisCleanupService = RedisCleanupService;
exports.RedisCleanupService = RedisCleanupService = RedisCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_otp_constants_1.REDIS_OTP)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Object])
], RedisCleanupService);
//# sourceMappingURL=redis-cleanup.service.js.map