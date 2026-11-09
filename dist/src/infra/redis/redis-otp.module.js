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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisOtpConnection_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisOtpModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
const redis_otp_constants_1 = require("./redis-otp.constants");
function createRedisClient(url) {
    return new ioredis_1.default(url.trim(), {
        maxRetriesPerRequest: 2,
        connectTimeout: 5_000,
        commandTimeout: 3_000,
        enableReadyCheck: true,
        lazyConnect: false,
        keepAlive: 30_000,
    });
}
let RedisOtpConnection = RedisOtpConnection_1 = class RedisOtpConnection {
    client;
    logger = new common_1.Logger(RedisOtpConnection_1.name);
    constructor(client) {
        this.client = client;
    }
    async onModuleDestroy() {
        if (!this.client) {
            return;
        }
        try {
            await this.client.quit();
        }
        catch (error) {
            this.logger.warn(`Redis disconnect: ${error.message}`);
        }
    }
};
RedisOtpConnection = RedisOtpConnection_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], RedisOtpConnection);
let RedisOtpModule = class RedisOtpModule {
};
exports.RedisOtpModule = RedisOtpModule;
exports.RedisOtpModule = RedisOtpModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: redis_otp_constants_1.REDIS_OTP,
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const url = config.get("REDIS_URL");
                    if (!url?.trim()) {
                        return null;
                    }
                    return createRedisClient(url);
                },
            },
            {
                provide: RedisOtpConnection,
                inject: [redis_otp_constants_1.REDIS_OTP],
                useFactory: (client) => new RedisOtpConnection(client),
            },
        ],
        exports: [redis_otp_constants_1.REDIS_OTP],
    })
], RedisOtpModule);
//# sourceMappingURL=redis-otp.module.js.map