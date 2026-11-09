import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { ADMIN_USERS_CACHE_TTL_MS } from "../config/admin-users-cache.config";

/** Cache mémoire (via {@link AppCacheModule}) pour les lectures admin utilisateurs. */
@Injectable()
export class AdminUsersCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  wrap<T>(key: string, fn: () => Promise<T>, ttlMs?: number): Promise<T> {
    return this.cache.wrap(key, fn, ttlMs ?? ADMIN_USERS_CACHE_TTL_MS);
  }
}
