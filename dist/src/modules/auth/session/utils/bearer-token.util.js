"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractBearerToken = extractBearerToken;
function extractBearerToken(request) {
    const raw = request.headers.authorization?.trim();
    if (!raw)
        return undefined;
    const [scheme, ...rest] = raw.split(/\s+/);
    if (scheme?.toLowerCase() !== "bearer" || rest.length === 0)
        return undefined;
    return rest.join(" ");
}
//# sourceMappingURL=bearer-token.util.js.map