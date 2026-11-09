"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_audience_decorator_1 = require("../../common/decorators/api-audience.decorator");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../common/i18n");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const response_util_1 = require("../../common/utils/response.util");
const api_redis_decorator_1 = require("./decorators/api-redis.decorator");
const redis_cleanup_service_1 = require("./redis-cleanup.service");
let RedisController = class RedisController {
    redisCleanupService;
    constructor(redisCleanupService) {
        this.redisCleanupService = redisCleanupService;
    }
    async flushCache(req) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.redisCleanupService.flushAll(locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "redisCacheCleared"), data, locale);
    }
};
exports.RedisController = RedisController;
__decorate([
    (0, common_1.Delete)("cache"),
    (0, api_redis_decorator_1.ApiAdminRedisFlushCache)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RedisController.prototype, "flushCache", null);
exports.RedisController = RedisController = __decorate([
    (0, swagger_1.ApiTags)("Admin — Redis"),
    (0, api_audience_decorator_1.ApiAudience)("plateforme"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Controller)("admin/redis"),
    __metadata("design:paramtypes", [redis_cleanup_service_1.RedisCleanupService])
], RedisController);
//# sourceMappingURL=redis.controller.js.map