"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TENANT_ROLES = exports.MOBILE_ROLES = exports.BACKOFFICE_ROLES = exports.USER_MANAGER_ROLES = exports.TENANT_ADMIN_ROLES = exports.PLATFORM_ROLES = void 0;
exports.isPlatformRole = isPlatformRole;
exports.canAssignRole = canAssignRole;
const client_1 = require("@prisma/client");
exports.PLATFORM_ROLES = [client_1.Role.SUPER_ADMIN, client_1.Role.SUPPORT];
exports.TENANT_ADMIN_ROLES = [
    client_1.Role.ADMIN_CLIENT,
    client_1.Role.RESPONSABLE_RH,
];
exports.USER_MANAGER_ROLES = [
    ...exports.PLATFORM_ROLES,
    ...exports.TENANT_ADMIN_ROLES,
];
exports.BACKOFFICE_ROLES = [
    ...exports.USER_MANAGER_ROLES,
    client_1.Role.MANAGER,
];
exports.MOBILE_ROLES = [client_1.Role.EMPLOYE, client_1.Role.SURVEILLANT];
exports.TENANT_ROLES = Object.values(client_1.Role).filter((role) => !exports.PLATFORM_ROLES.includes(role));
const ASSIGNABLE_ROLES = {
    [client_1.Role.SUPER_ADMIN]: Object.values(client_1.Role),
    [client_1.Role.SUPPORT]: Object.values(client_1.Role).filter((r) => r !== client_1.Role.SUPER_ADMIN),
    [client_1.Role.ADMIN_CLIENT]: exports.TENANT_ROLES,
    [client_1.Role.RESPONSABLE_RH]: [client_1.Role.MANAGER, client_1.Role.SURVEILLANT, client_1.Role.EMPLOYE],
    [client_1.Role.MANAGER]: [],
    [client_1.Role.SURVEILLANT]: [],
    [client_1.Role.EMPLOYE]: [],
};
function isPlatformRole(role) {
    return exports.PLATFORM_ROLES.includes(role);
}
function canAssignRole(actorRole, targetRole) {
    return ASSIGNABLE_ROLES[actorRole].includes(targetRole);
}
//# sourceMappingURL=role-groups.js.map