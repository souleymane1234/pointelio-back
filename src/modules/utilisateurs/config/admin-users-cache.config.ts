import { DEFAULT_CACHE_TTL_MS } from "../../../infra/cache/cache-ttl.constants";
import { createCacheNamespace } from "../../../infra/cache/cache-namespace";

export type AdminUsersCacheSegment = "admin-users-list" | "admin-user-detail";

/** Cache Redis pour l’admin utilisateurs (liste, détail). Génération incrémentée après chaque écriture. */
const adminUsersCache =
  createCacheNamespace<AdminUsersCacheSegment>("admin-users");

/** TTL par clé (en ms). */
export const ADMIN_USERS_CACHE_TTL_MS = DEFAULT_CACHE_TTL_MS;

export const bumpAdminUsersCacheGeneration = adminUsersCache.bumpGeneration;

export const buildAdminUsersCacheKey = adminUsersCache.buildKey;
