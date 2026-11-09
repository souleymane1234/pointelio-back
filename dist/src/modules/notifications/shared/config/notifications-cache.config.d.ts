export type NotificationsCacheSegment = "notifications-list" | "notification-detail";
export declare const NOTIFICATIONS_CACHE_TTL_MS: number;
export declare const bumpNotificationsCacheGeneration: () => void;
export declare const buildNotificationsCacheKey: (segment: NotificationsCacheSegment, query: Record<string, unknown>) => string;
