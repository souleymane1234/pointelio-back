"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_APP_USER_PASSWORD_MESSAGE = exports.AUTH_EMAIL_PASSWORD_MIN_LENGTH = exports.ADMIN_APP_USER_PASSWORD_LENGTH = exports.AUTH_SECRET_CODE_MIN_LENGTH = void 0;
exports.isMobileRole = isMobileRole;
exports.isAppUserPinDigits = isAppUserPinDigits;
exports.isAdminUserPasswordValid = isAdminUserPasswordValid;
exports.adminUserPasswordErrorMessage = adminUserPasswordErrorMessage;
const role_groups_1 = require("../../../common/rbac/role-groups");
exports.AUTH_SECRET_CODE_MIN_LENGTH = 4;
exports.ADMIN_APP_USER_PASSWORD_LENGTH = 4;
exports.AUTH_EMAIL_PASSWORD_MIN_LENGTH = 8;
exports.ADMIN_APP_USER_PASSWORD_MESSAGE = "Le mot de passe d'un employé ou surveillant doit être un code PIN de 4 chiffres ou contenir au moins 8 caractères.";
function isMobileRole(role) {
    return role_groups_1.MOBILE_ROLES.includes(role);
}
function isAppUserPinDigits(password) {
    return /^\d+$/.test(password);
}
function isAdminUserPasswordValid(password, role) {
    if (isMobileRole(role)) {
        const isPin = password.length === exports.ADMIN_APP_USER_PASSWORD_LENGTH &&
            isAppUserPinDigits(password);
        return isPin || password.length >= exports.AUTH_EMAIL_PASSWORD_MIN_LENGTH;
    }
    return password.length >= exports.AUTH_EMAIL_PASSWORD_MIN_LENGTH;
}
function adminUserPasswordErrorMessage(role) {
    if (isMobileRole(role)) {
        return exports.ADMIN_APP_USER_PASSWORD_MESSAGE;
    }
    return `password must be longer than or equal to ${exports.AUTH_EMAIL_PASSWORD_MIN_LENGTH} characters`;
}
//# sourceMappingURL=auth-validation.constants.js.map