"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtAccessExpiresInSeconds = getJwtAccessExpiresInSeconds;
exports.getJwtAccessExpiresInMinutes = getJwtAccessExpiresInMinutes;
exports.getJwtRefreshExpiresInSeconds = getJwtRefreshExpiresInSeconds;
exports.getConnectedUsersWithinMinutes = getConnectedUsersWithinMinutes;
function getJwtAccessExpiresInSeconds() {
    const minutes = Number(process.env.JWT_ACCESS_EXPIRES_IN_MINUTES);
    if (Number.isFinite(minutes) && minutes > 0) {
        return minutes * 60;
    }
    return (Number(process.env.JWT_EXPIRES_IN_DAYS) || 7) * 24 * 60 * 60;
}
function getJwtAccessExpiresInMinutes() {
    return Math.max(1, Math.ceil(getJwtAccessExpiresInSeconds() / 60));
}
function getJwtRefreshExpiresInSeconds() {
    return (Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS) || 30) * 24 * 60 * 60;
}
function getConnectedUsersWithinMinutes() {
    return getJwtAccessExpiresInMinutes();
}
//# sourceMappingURL=jwt-expiry.config.js.map