import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { NOTIFICATIONS_CACHE_TTL_MS } from "../config/notifications-cache.config";

@Injectable()
export class NotificationCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  wrap<T>(key: string, fn: () => Promise<T>, ttlMs?: number): Promise<T> {
    return this.cache.wrap(key, fn, ttlMs ?? NOTIFICATIONS_CACHE_TTL_MS);
  }
}
