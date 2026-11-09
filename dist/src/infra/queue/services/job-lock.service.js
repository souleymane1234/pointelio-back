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
var JobLockService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobLockService = void 0;
const common_1 = require("@nestjs/common");
const os_1 = require("os");
const app_constants_1 = require("../../../common/constants/app.constants");
const redis_otp_constants_1 = require("../../redis/redis-otp.constants");
const LOCK_KEY_PREFIX = `${app_constants_1.REDIS_KEY_PREFIX}:jobs:lock`;
const SLOT_LOCK_TTL_MS = 10 * 60 * 1000;
let JobLockService = JobLockService_1 = class JobLockService {
    redis;
    logger = new common_1.Logger(JobLockService_1.name);
    instanceId = `${(0, os_1.hostname)()}:${process.pid}`;
    constructor(redis) {
        this.redis = redis;
    }
    async runOncePerSlot(jobName, run, now = new Date()) {
        if (!this.redis) {
            await run();
            return;
        }
        const slot = Math.round(now.getTime() / 60_000);
        const key = `${LOCK_KEY_PREFIX}:${jobName}:${slot}`;
        let acquired;
        try {
            acquired =
                (await this.redis.set(key, this.instanceId, "PX", SLOT_LOCK_TTL_MS, "NX")) === "OK";
        }
        catch (error) {
            this.logger.error(`[${jobName}] skipped: Redis unavailable for job lock (${String(error)})`);
            return;
        }
        if (!acquired) {
            this.logger.debug(`[${jobName}] skipped: slot already taken by another instance`);
            return;
        }
        await run();
    }
};
exports.JobLockService = JobLockService;
exports.JobLockService = JobLockService = JobLockService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_otp_constants_1.REDIS_OTP)),
    __metadata("design:paramtypes", [Object])
], JobLockService);
//# sourceMappingURL=job-lock.service.js.map