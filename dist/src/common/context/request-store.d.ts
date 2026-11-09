export interface RequestStore {
    requestId?: string;
    ip?: string;
    entrepriseId?: number | null;
}
export declare function getRequestStore(): RequestStore | undefined;
export declare function runWithRequestStore<T>(store: RequestStore, fn: () => T): T;
