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
var AuthTokenRevocationStore_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenRevocationStore = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const redis_otp_constants_1 = require("../../../../infra/redis/redis-otp.constants");
const auth_token_revocation_constants_1 = require("../constants/auth-token-revocation.constants");
let AuthTokenRevocationStore = AuthTokenRevocationStore_1 = class AuthTokenRevocationStore {
    redis;
    logger = new common_1.Logger(AuthTokenRevocationStore_1.name);
    constructor(redis) {
        this.redis = redis;
        if (!this.redis) {
            this.logger.warn("REDIS_URL absent : logout, désactivation et rotation des refresh tokens ne révoquent aucun JWT.");
        }
    }
    key(token) {
        const hash = (0, crypto_1.createHash)("sha256").update(token).digest("hex");
        return `${auth_token_revocation_constants_1.AUTH_REVOKED_TOKEN_KEY_PREFIX}:${hash}`;
    }
    async revoke(token, ttlSec) {
        if (!this.redis || ttlSec <= 0)
            return;
        await this.redis.set(this.key(token), "1", "EX", ttlSec);
    }
    async isRevoked(token) {
        if (!this.redis)
            return false;
        return (await this.redis.exists(this.key(token))) === 1;
    }
    async consume(token, ttlSec) {
        if (!this.redis)
            return true;
        const result = await this.redis.set(this.key(token), "1", "EX", Math.max(ttlSec, 1), "NX");
        return result === "OK";
    }
};
exports.AuthTokenRevocationStore = AuthTokenRevocationStore;
exports.AuthTokenRevocationStore = AuthTokenRevocationStore = AuthTokenRevocationStore_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_otp_constants_1.REDIS_OTP)),
    __metadata("design:paramtypes", [Object])
], AuthTokenRevocationStore);
//# sourceMappingURL=auth-token-revocation.store.js.map