"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.perfGlobalDb = exports.perfRequestStore = exports.PERF_SLOW_QUERY_MS = void 0;
exports.perfProfilingEnabled = perfProfilingEnabled;
exports.resetPerfGlobalDb = resetPerfGlobalDb;
exports.instrumentDbPool = instrumentDbPool;
const node_async_hooks_1 = require("node:async_hooks");
const node_perf_hooks_1 = require("node:perf_hooks");
function perfProfilingEnabled() {
    const v = process.env.PERF_PROFILING;
    return v === "1" || v === "true";
}
exports.PERF_SLOW_QUERY_MS = Number(process.env.PERF_SLOW_QUERY_MS ?? 200);
exports.perfRequestStore = new node_async_hooks_1.AsyncLocalStorage();
exports.perfGlobalDb = {
    queries: 0,
    dbMs: 0,
    maxMs: 0,
    slow: 0,
};
function resetPerfGlobalDb() {
    exports.perfGlobalDb.queries = 0;
    exports.perfGlobalDb.dbMs = 0;
    exports.perfGlobalDb.maxMs = 0;
    exports.perfGlobalDb.slow = 0;
}
function recordDbQuery(durationMs) {
    exports.perfGlobalDb.queries += 1;
    exports.perfGlobalDb.dbMs += durationMs;
    if (durationMs > exports.perfGlobalDb.maxMs)
        exports.perfGlobalDb.maxMs = durationMs;
    const slow = durationMs >= exports.PERF_SLOW_QUERY_MS;
    if (slow)
        exports.perfGlobalDb.slow += 1;
    const store = exports.perfRequestStore.getStore();
    if (store) {
        store.queries += 1;
        store.dbMs += durationMs;
        if (slow)
            store.slow += 1;
    }
}
function instrumentDbPool(pool) {
    const anyPool = pool;
    if (anyPool.__perfInstrumented)
        return;
    anyPool.__perfInstrumented = true;
    for (const method of ["query", "execute"]) {
        const original = anyPool[method].bind(pool);
        anyPool[method] = (...args) => {
            const start = node_perf_hooks_1.performance.now();
            return original(...args).then((res) => {
                recordDbQuery(node_perf_hooks_1.performance.now() - start);
                return res;
            }, (err) => {
                recordDbQuery(node_perf_hooks_1.performance.now() - start);
                throw err;
            });
        };
    }
}
//# sourceMappingURL=perf-metrics.js.map