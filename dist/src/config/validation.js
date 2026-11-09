"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const JWT_SECRET_MIN_LENGTH = 32;
const KNOWN_PLACEHOLDER_SECRETS = new Set([
    "change-me-in-production",
    "changeme",
    "secret",
]);
const FORBIDDEN_IN_PRODUCTION = [
    "SOCKET_AUTH_ALLOW_PLAIN_USERID",
    "INVITATION_RETURN_TOKEN_IN_RESPONSE",
];
const REQUIRED_IN_PRODUCTION = ["REDIS_URL"];
function read(env, key) {
    const value = env[key];
    return typeof value === "string" ? value.trim() : "";
}
function isEnabled(env, key) {
    const value = read(env, key).toLowerCase();
    return value === "true" || value === "1";
}
function validateEnv(env) {
    const errors = [];
    const isProd = read(env, "NODE_ENV") === "production";
    if (!read(env, "DATABASE_URL")) {
        errors.push("DATABASE_URL is required");
    }
    const jwtSecret = read(env, "JWT_SECRET");
    if (!jwtSecret) {
        errors.push("JWT_SECRET is required");
    }
    else if (KNOWN_PLACEHOLDER_SECRETS.has(jwtSecret.toLowerCase())) {
        errors.push("JWT_SECRET must not be a placeholder value");
    }
    else if (jwtSecret.length < JWT_SECRET_MIN_LENGTH) {
        errors.push(`JWT_SECRET must be at least ${JWT_SECRET_MIN_LENGTH} characters long`);
    }
    if (isProd) {
        for (const key of REQUIRED_IN_PRODUCTION) {
            if (!read(env, key))
                errors.push(`${key} is required in production`);
        }
        for (const key of FORBIDDEN_IN_PRODUCTION) {
            if (isEnabled(env, key)) {
                errors.push(`${key} must not be enabled in production`);
            }
        }
    }
    if (errors.length > 0) {
        throw new Error(`Invalid environment configuration:\n- ${errors.join("\n- ")}`);
    }
    return env;
}
//# sourceMappingURL=validation.js.map