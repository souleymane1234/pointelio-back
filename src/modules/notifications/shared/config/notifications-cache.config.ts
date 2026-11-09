import { DEFAULT_CACHE_TTL_MS } from "../../../../infra/cache/cache-ttl.constants";
import { createCacheNamespace } from "../../../../infra/cache/cache-namespace";

export type NotificationsCacheSegment =
  "notifications-list" | "notification-detail";

/** Cache Redis pour les notifications. Génération incrémentée après chaque écriture. */
const notificationsCache =
  createCacheNamespace<NotificationsCacheSegment>("notifications");

/** TTL par clé (en ms). */
export const NOTIFICATIONS_CACHE_TTL_MS = DEFAULT_CACHE_TTL_MS;

export const bumpNotificationsCacheGeneration =
  notificationsCache.bumpGeneration;

export const buildNotificationsCacheKey = notificationsCache.buildKey;
