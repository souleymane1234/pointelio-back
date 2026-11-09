"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authThrottleOptions = void 0;
function parsePositiveInt(raw, fallback) {
    if (raw === undefined || raw.trim() === "") {
        return fallback;
    }
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback;
}
function defaultAuthThrottleLimit() {
    return process.env.NODE_ENV === "production" ? 15 : 100_000;
}
const authThrottleOptions = () => ({
    default: {
        limit: parsePositiveInt(process.env.AUTH_THROTTLE_LIMIT, defaultAuthThrottleLimit()),
        ttl: parsePositiveInt(process.env.AUTH_THROTTLE_TTL_MS, 60_000),
    },
});
exports.authThrottleOptions = authThrottleOptions;
//# sourceMappingURL=throttler.constants.js.map