"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = getUserId;
exports.requireUserId = requireUserId;
exports.requireTenant = requireTenant;
exports.requireUser = requireUser;
const common_1 = require("@nestjs/common");
function getUserId(req) {
    return req.user?.id;
}
function requireUserId(req) {
    const userId = getUserId(req);
    if (!userId) {
        throw new common_1.UnauthorizedException("Missing user id in request context");
    }
    return userId;
}
function requireTenant(req) {
    if (!req.tenant) {
        throw new common_1.ForbiddenException();
    }
    return req.tenant;
}
function requireUser(req) {
    const user = req.user;
    if (!user?.id || !user.role) {
        throw new common_1.UnauthorizedException("Missing user in request context");
    }
    return user;
}
//# sourceMappingURL=request-context.js.map