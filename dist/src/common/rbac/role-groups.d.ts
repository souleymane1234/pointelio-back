import { Role } from "@prisma/client";
export declare const PLATFORM_ROLES: readonly Role[];
export declare const TENANT_ADMIN_ROLES: readonly Role[];
export declare const USER_MANAGER_ROLES: readonly Role[];
export declare const BACKOFFICE_ROLES: readonly Role[];
export declare const MOBILE_ROLES: readonly Role[];
export declare const TENANT_ROLES: readonly Role[];
export declare function isPlatformRole(role: Role): boolean;
export declare function canAssignRole(actorRole: Role, targetRole: Role): boolean;
