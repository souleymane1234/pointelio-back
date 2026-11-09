"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const cache_module_1 = require("../cache/cache.module");
const redis_controller_1 = require("./redis.controller");
const redis_cleanup_service_1 = require("./redis-cleanup.service");
const redis_otp_module_1 = require("./redis-otp.module");
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Module)({
        imports: [redis_otp_module_1.RedisOtpModule, cache_module_1.AppCacheModule],
        controllers: [redis_controller_1.RedisController],
        providers: [redis_cleanup_service_1.RedisCleanupService],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map