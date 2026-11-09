"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfRequestInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const perf_metrics_1 = require("./perf-metrics");
let PerfRequestInterceptor = class PerfRequestInterceptor {
    logger = new common_1.Logger("PERF-REQ");
    logThresholdMs = Number(process.env.PERF_REQ_LOG_MS ?? 500);
    intercept(context, next) {
        if (!(0, perf_metrics_1.perfProfilingEnabled)() || context.getType() !== "http") {
            return next.handle();
        }
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        const url = req.originalUrl ?? req.url;
        const store = { queries: 0, dbMs: 0, slow: 0 };
        const start = Date.now();
        return new rxjs_1.Observable((subscriber) => {
            perf_metrics_1.perfRequestStore.run(store, () => {
                const inner = next
                    .handle()
                    .pipe((0, operators_1.finalize)(() => {
                    const totalMs = Date.now() - start;
                    if (totalMs >= this.logThresholdMs || store.queries >= 5) {
                        const otherMs = Math.max(0, totalMs - store.dbMs);
                        this.logger.log(`${method} ${url} total=${totalMs}ms db=${store.dbMs.toFixed(0)}ms ` +
                            `q=${store.queries} slow=${store.slow} nonDb=${otherMs.toFixed(0)}ms`);
                    }
                }))
                    .subscribe({
                    next: (value) => subscriber.next(value),
                    error: (err) => subscriber.error(err),
                    complete: () => subscriber.complete(),
                });
                return () => inner.unsubscribe();
            });
        });
    }
};
exports.PerfRequestInterceptor = PerfRequestInterceptor;
exports.PerfRequestInterceptor = PerfRequestInterceptor = __decorate([
    (0, common_1.Injectable)()
], PerfRequestInterceptor);
//# sourceMappingURL=perf-request.interceptor.js.map