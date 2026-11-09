"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEALTH_READY_PATH = exports.HEALTH_LIVE_PATH = void 0;
exports.createHealthHandlers = createHealthHandlers;
exports.HEALTH_LIVE_PATH = "/api/v1/health/live";
exports.HEALTH_READY_PATH = "/api/v1/health/ready";
const CHECK_TIMEOUT_MS = 2_000;
function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("timeout")), ms);
        promise.then((value) => {
            clearTimeout(timer);
            resolve(value);
        }, (error) => {
            clearTimeout(timer);
            reject(error instanceof Error ? error : new Error(String(error)));
        });
    });
}
async function check(run) {
    try {
        await withTimeout(run(), CHECK_TIMEOUT_MS);
        return "up";
    }
    catch {
        return "down";
    }
}
function createHealthHandlers({ prisma, redis }) {
    let shuttingDown = false;
    const live = (_req, res) => {
        res
            .status(200)
            .json({ status: "ok", uptimeSec: Math.round(process.uptime()) });
    };
    const ready = (_req, res) => {
        void (async () => {
            if (shuttingDown) {
                res.status(503).json({ status: "shutting_down" });
                return;
            }
            const [database, cache] = await Promise.all([
                check(() => prisma.$queryRaw `SELECT 1`),
                redis
                    ? check(() => redis.ping())
                    : Promise.resolve("skipped"),
            ]);
            const healthy = database === "up" && cache !== "down";
            res.status(healthy ? 200 : 503).json({
                status: healthy ? "ok" : "error",
                checks: { database, redis: cache },
            });
        })();
    };
    return {
        live,
        ready,
        markShuttingDown: () => {
            shuttingDown = true;
        },
    };
}
//# sourceMappingURL=health.handlers.js.map