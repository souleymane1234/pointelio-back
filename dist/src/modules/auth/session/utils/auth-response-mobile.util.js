"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTokensSnakeCase = authTokensSnakeCase;
exports.authSuccessData = authSuccessData;
function authTokensSnakeCase(tokens) {
    return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
    };
}
function authSuccessData(result) {
    return {
        ...authTokensSnakeCase(result),
        user: result.user,
    };
}
//# sourceMappingURL=auth-response-mobile.util.js.map