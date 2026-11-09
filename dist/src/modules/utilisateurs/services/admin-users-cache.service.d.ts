import type { Cache } from "cache-manager";
export declare class AdminUsersCacheService {
    private readonly cache;
    constructor(cache: Cache);
    wrap<T>(key: string, fn: () => Promise<T>, ttlMs?: number): Promise<T>;
}
