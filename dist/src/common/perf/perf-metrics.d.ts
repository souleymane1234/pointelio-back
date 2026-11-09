import { AsyncLocalStorage } from "node:async_hooks";
import type { Pool } from "mariadb";
export declare function perfProfilingEnabled(): boolean;
export declare const PERF_SLOW_QUERY_MS: number;
export interface RequestDbStats {
    queries: number;
    dbMs: number;
    slow: number;
}
export declare const perfRequestStore: AsyncLocalStorage<RequestDbStats>;
export declare const perfGlobalDb: {
    queries: number;
    dbMs: number;
    maxMs: number;
    slow: number;
};
export declare function resetPerfGlobalDb(): void;
export declare function instrumentDbPool(pool: Pool): void;
