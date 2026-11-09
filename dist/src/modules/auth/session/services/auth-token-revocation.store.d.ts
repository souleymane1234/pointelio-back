import type Redis from "ioredis";
export declare class AuthTokenRevocationStore {
    private readonly redis;
    private readonly logger;
    constructor(redis: Redis | null);
    private key;
    revoke(token: string, ttlSec: number): Promise<void>;
    isRevoked(token: string): Promise<boolean>;
    consume(token: string, ttlSec: number): Promise<boolean>;
}
