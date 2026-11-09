export declare function bumpAllCacheGenerations(): void;
export type CacheNamespace<Segment extends string> = {
    prefix: string;
    getGeneration: () => number;
    bumpGeneration: () => void;
    buildKey: (segment: Segment, query: Record<string, unknown>) => string;
};
export type CacheNamespaceOptions = {
    version?: number;
    timeBucketMs?: number;
};
export declare function createCacheNamespace<Segment extends string>(name: string, options?: CacheNamespaceOptions): CacheNamespace<Segment>;
