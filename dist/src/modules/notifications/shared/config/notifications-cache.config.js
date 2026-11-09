"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNotificationsCacheKey = exports.bumpNotificationsCacheGeneration = exports.NOTIFICATIONS_CACHE_TTL_MS = void 0;
const cache_ttl_constants_1 = require("../../../../infra/cache/cache-ttl.constants");
const cache_namespace_1 = require("../../../../infra/cache/cache-namespace");
const notificationsCache = (0, cache_namespace_1.createCacheNamespace)("notifications");
exports.NOTIFICATIONS_CACHE_TTL_MS = cache_ttl_constants_1.DEFAULT_CACHE_TTL_MS;
exports.bumpNotificationsCacheGeneration = notificationsCache.bumpGeneration;
exports.buildNotificationsCacheKey = notificationsCache.buildKey;
//# sourceMappingURL=notifications-cache.config.js.map