import type { Role } from "@prisma/client";
export declare const AUTH_SECRET_CODE_MIN_LENGTH = 4;
export declare const ADMIN_APP_USER_PASSWORD_LENGTH = 4;
export declare const AUTH_EMAIL_PASSWORD_MIN_LENGTH = 8;
export declare const ADMIN_APP_USER_PASSWORD_MESSAGE = "Le mot de passe d'un employ\u00E9 ou surveillant doit \u00EAtre un code PIN de 4 chiffres ou contenir au moins 8 caract\u00E8res.";
export declare function isMobileRole(role: Role): boolean;
export declare function isAppUserPinDigits(password: string): boolean;
export declare function isAdminUserPasswordValid(password: string, role: Role): boolean;
export declare function adminUserPasswordErrorMessage(role: Role): string;
