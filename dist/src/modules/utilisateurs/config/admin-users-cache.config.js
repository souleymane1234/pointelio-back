"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAdminUsersCacheKey = exports.bumpAdminUsersCacheGeneration = exports.ADMIN_USERS_CACHE_TTL_MS = void 0;
const cache_ttl_constants_1 = require("../../../infra/cache/cache-ttl.constants");
const cache_namespace_1 = require("../../../infra/cache/cache-namespace");
const adminUsersCache = (0, cache_namespace_1.createCacheNamespace)("admin-users");
exports.ADMIN_USERS_CACHE_TTL_MS = cache_ttl_constants_1.DEFAULT_CACHE_TTL_MS;
exports.bumpAdminUsersCacheGeneration = adminUsersCache.bumpGeneration;
exports.buildAdminUsersCacheKey = adminUsersCache.buildKey;
//# sourceMappingURL=admin-users-cache.config.js.map