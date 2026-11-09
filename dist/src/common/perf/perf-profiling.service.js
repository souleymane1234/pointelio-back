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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfProfilingService = void 0;
const common_1 = require("@nestjs/common");
const node_perf_hooks_1 = require("node:perf_hooks");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const perf_metrics_1 = require("./perf-metrics");
let PerfProfilingService = class PerfProfilingService {
    prisma;
    logger = new common_1.Logger("PERF");
    timer;
    loop;
    intervalMs = Number(process.env.PERF_SAMPLE_MS ?? 2000);
    constructor(prisma) {
        this.prisma = prisma;
    }
    onModuleInit() {
        if (!(0, perf_metrics_1.perfProfilingEnabled)())
            return;
        this.loop = (0, node_perf_hooks_1.monitorEventLoopDelay)({ resolution: 20 });
        this.loop.enable();
        this.timer = setInterval(() => this.flush(), this.intervalMs);
        this.timer.unref?.();
        this.logger.warn(`Profiling ACTIF (sample=${this.intervalMs}ms). PERF_PROFILING=1 — à désactiver après l'audit.`);
    }
    flush() {
        const toMs = (ns) => ns / 1e6;
        const meanLag = this.loop ? toMs(this.loop.mean) : 0;
        const p99Lag = this.loop ? toMs(this.loop.percentile(99)) : 0;
        const maxLag = this.loop ? toMs(this.loop.max) : 0;
        this.loop?.reset();
        const pool = this.prisma.pool;
        const total = pool.totalConnections();
        const idle = pool.idleConnections();
        const waiting = pool.taskQueueSize();
        const db = { ...perf_metrics_1.perfGlobalDb };
        (0, perf_metrics_1.resetPerfGlobalDb)();
        const qps = db.queries / (this.intervalMs / 1000);
        const avgMs = db.queries > 0 ? db.dbMs / db.queries : 0;
        this.logger.log(`loopLagMs mean=${meanLag.toFixed(1)} p99=${p99Lag.toFixed(1)} max=${maxLag.toFixed(1)} | ` +
            `dbPool total=${total} idle=${idle} waiting=${waiting} | ` +
            `db q/s=${qps.toFixed(0)} avgMs=${avgMs.toFixed(1)} maxMs=${db.maxMs.toFixed(1)} slow=${db.slow}`);
    }
    onModuleDestroy() {
        if (this.timer)
            clearInterval(this.timer);
        this.loop?.disable();
    }
};
exports.PerfProfilingService = PerfProfilingService;
exports.PerfProfilingService = PerfProfilingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PerfProfilingService);
//# sourceMappingURL=perf-profiling.service.js.map