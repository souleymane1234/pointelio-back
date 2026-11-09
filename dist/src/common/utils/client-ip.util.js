"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveClientIp = resolveClientIp;
exports.normalizeIp = normalizeIp;
exports.isPublicIp = isPublicIp;
function resolveClientIp(req) {
    const candidates = [];
    pushHeader(candidates, req.headers["cf-connecting-ip"]);
    pushHeader(candidates, req.headers["true-client-ip"]);
    pushHeader(candidates, req.headers["x-real-ip"]);
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
        for (const part of forwarded.split(",")) {
            pushCandidate(candidates, part);
        }
    }
    else if (Array.isArray(forwarded)) {
        for (const entry of forwarded) {
            for (const part of entry.split(",")) {
                pushCandidate(candidates, part);
            }
        }
    }
    if (req.ip)
        pushCandidate(candidates, req.ip);
    if (req.socket?.remoteAddress) {
        pushCandidate(candidates, req.socket.remoteAddress);
    }
    const publicIp = candidates.find((ip) => isPublicIp(ip));
    if (publicIp)
        return publicIp;
    return candidates[0];
}
function pushHeader(candidates, value) {
    if (typeof value === "string") {
        pushCandidate(candidates, value);
    }
    else if (Array.isArray(value) && value[0]) {
        pushCandidate(candidates, value[0]);
    }
}
function pushCandidate(candidates, raw) {
    const ip = normalizeIp(raw);
    if (!ip)
        return;
    if (candidates.includes(ip))
        return;
    candidates.push(ip);
}
function normalizeIp(raw) {
    if (!raw)
        return undefined;
    let ip = raw.trim().toLowerCase();
    if (!ip)
        return undefined;
    if (ip.startsWith("[")) {
        const end = ip.indexOf("]");
        if (end > 0)
            ip = ip.slice(1, end);
    }
    else if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(ip)) {
        ip = ip.split(":")[0];
    }
    ip = ip.split("%")[0];
    if (ip.startsWith("::ffff:")) {
        ip = ip.slice("::ffff:".length);
    }
    return ip || undefined;
}
function isPublicIp(ip) {
    const normalized = normalizeIp(ip);
    if (!normalized)
        return false;
    if (normalized === "127.0.0.1" ||
        normalized === "::1" ||
        normalized === "0.0.0.0" ||
        normalized === "::") {
        return false;
    }
    if (/^\d+\.\d+\.\d+\.\d+$/.test(normalized)) {
        const [a, b] = normalized.split(".").map(Number);
        if (a === 10)
            return false;
        if (a === 127)
            return false;
        if (a === 0)
            return false;
        if (a === 169 && b === 254)
            return false;
        if (a === 172 && b >= 16 && b <= 31)
            return false;
        if (a === 192 && b === 168)
            return false;
        if (a === 100 && b >= 64 && b <= 127)
            return false;
        if (a >= 224)
            return false;
        return true;
    }
    if (normalized.startsWith("fc") ||
        normalized.startsWith("fd") ||
        normalized.startsWith("fe80:")) {
        return false;
    }
    return normalized.includes(":");
}
//# sourceMappingURL=client-ip.util.js.map