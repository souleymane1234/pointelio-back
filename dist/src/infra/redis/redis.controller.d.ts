import { RedisCleanupService } from "./redis-cleanup.service";
import { type AuthedRequest } from "../../common/types/request-context";
export declare class RedisController {
    private readonly redisCleanupService;
    constructor(redisCleanupService: RedisCleanupService);
    flushCache(req: AuthedRequest): Promise<import("../../common/interfaces/response.interface").SuccessResponse<import("./redis-cleanup.service").RedisCacheCleanupResult>>;
}
