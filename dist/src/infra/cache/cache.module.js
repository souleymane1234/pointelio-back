"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCacheModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const keyv_1 = __importDefault(require("keyv"));
const redis_1 = __importDefault(require("@keyv/redis"));
const cache_ttl_constants_1 = require("./cache-ttl.constants");
let AppCacheModule = class AppCacheModule {
};
exports.AppCacheModule = AppCacheModule;
exports.AppCacheModule = AppCacheModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const redisUrl = configService.get("REDIS_URL");
                    const ttlMinutes = configService.get("CACHE_TTL_MINUTES") ??
                        cache_ttl_constants_1.DEFAULT_CACHE_TTL_MINUTES;
                    const ttlMs = ttlMinutes * 60 * 1000;
                    const options = {
                        ttl: ttlMs,
                    };
                    if (redisUrl) {
                        const redisStore = new redis_1.default(redisUrl);
                        options.stores = [new keyv_1.default({ store: redisStore })];
                    }
                    return options;
                },
            }),
        ],
        exports: [cache_manager_1.CacheModule],
    })
], AppCacheModule);
//# sourceMappingURL=cache.module.js.map