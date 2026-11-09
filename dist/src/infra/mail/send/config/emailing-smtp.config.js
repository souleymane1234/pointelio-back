"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEmailingSmtpConfig = resolveEmailingSmtpConfig;
function parseBoolean(value, fallback) {
    if (!value)
        return fallback;
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1")
        return true;
    if (normalized === "false" || normalized === "0")
        return false;
    return fallback;
}
function resolveEmailingSmtpConfig(get) {
    const enabled = parseBoolean(get("SMTP_ENABLED"), true);
    const host = get("SMTP_HOST")?.trim() ?? "";
    const rawPort = get("SMTP_PORT")?.trim();
    const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : NaN;
    const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 0;
    const secure = port === 465;
    const requireTls = secure
        ? false
        : parseBoolean(get("SMTP_REQUIRE_TLS"), true);
    const user = get("SMTP_USER")?.trim() ?? "";
    const password = get("SMTP_PASSWORD")?.trim() ?? "";
    const defaultFromEmail = get("SMTP_FROM_EMAIL")?.trim() ?? "";
    const defaultFromName = get("SMTP_FROM_NAME")?.trim() || undefined;
    const valid = Boolean(enabled &&
        host.length > 0 &&
        port > 0 &&
        user &&
        password &&
        defaultFromEmail);
    return {
        enabled,
        host,
        port,
        secure,
        user,
        password,
        defaultFromEmail,
        defaultFromName,
        requireTls,
        valid,
    };
}
//# sourceMappingURL=emailing-smtp.config.js.map