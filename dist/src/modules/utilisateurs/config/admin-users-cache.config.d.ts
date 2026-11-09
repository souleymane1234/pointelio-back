export type AdminUsersCacheSegment = "admin-users-list" | "admin-user-detail";
export declare const ADMIN_USERS_CACHE_TTL_MS: number;
export declare const bumpAdminUsersCacheGeneration: () => void;
export declare const buildAdminUsersCacheKey: (segment: AdminUsersCacheSegment, query: Record<string, unknown>) => string;
