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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BullMqConnectionLifecycle_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
const jobs_constants_1 = require("./jobs.constants");
const job_lock_service_1 = require("./services/job-lock.service");
let BullMqConnectionLifecycle = BullMqConnectionLifecycle_1 = class BullMqConnectionLifecycle {
    connection;
    logger = new common_1.Logger(BullMqConnectionLifecycle_1.name);
    constructor(connection) {
        this.connection = connection;
    }
    async onApplicationShutdown() {
        if (!this.connection)
            return;
        try {
            await this.connection.quit();
        }
        catch (error) {
            this.logger.warn(`BullMQ disconnect: ${error.message}`);
        }
    }
};
BullMqConnectionLifecycle = BullMqConnectionLifecycle_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(jobs_constants_1.BULLMQ_CONNECTION)),
    __metadata("design:paramtypes", [Object])
], BullMqConnectionLifecycle);
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: jobs_constants_1.BULLMQ_CONNECTION,
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const url = config.get("REDIS_URL")?.trim();
                    if (!url)
                        return null;
                    return new ioredis_1.default(url, { maxRetriesPerRequest: null });
                },
            },
            BullMqConnectionLifecycle,
            job_lock_service_1.JobLockService,
        ],
        exports: [jobs_constants_1.BULLMQ_CONNECTION, job_lock_service_1.JobLockService],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map