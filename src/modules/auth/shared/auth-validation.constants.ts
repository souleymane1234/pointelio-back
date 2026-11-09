import type { Role } from "@prisma/client";
import { MOBILE_ROLES } from "../../../common/rbac/role-groups";

/** Longueur minimale du mot de passe (secret_code) à la connexion applicative. */
export const AUTH_SECRET_CODE_MIN_LENGTH = 4;

/** Code PIN d'un utilisateur mobile (parcours téléphone) : exactement 4 chiffres. */
export const ADMIN_APP_USER_PASSWORD_LENGTH = 4;

/** Mot de passe d'un compte e-mail / backoffice. */
export const AUTH_EMAIL_PASSWORD_MIN_LENGTH = 8;

export const ADMIN_APP_USER_PASSWORD_MESSAGE =
  "Le mot de passe d'un employé ou surveillant doit être un code PIN de 4 chiffres ou contenir au moins 8 caractères.";

export function isMobileRole(role: Role): boolean {
  return MOBILE_ROLES.includes(role);
}

export function isAppUserPinDigits(password: string): boolean {
  return /^\d+$/.test(password);
}

/**
 * EMPLOYE / SURVEILLANT : PIN de 4 chiffres ou 8 caractères min.
 * Autres rôles (backoffice) : 8 caractères min.
 */
export function isAdminUserPasswordValid(
  password: string,
  role: Role,
): boolean {
  if (isMobileRole(role)) {
    const isPin =
      password.length === ADMIN_APP_USER_PASSWORD_LENGTH &&
      isAppUserPinDigits(password);
    return isPin || password.length >= AUTH_EMAIL_PASSWORD_MIN_LENGTH;
  }
  return password.length >= AUTH_EMAIL_PASSWORD_MIN_LENGTH;
}

export function adminUserPasswordErrorMessage(role: Role): string {
  if (isMobileRole(role)) {
    return ADMIN_APP_USER_PASSWORD_MESSAGE;
  }
  return `password must be longer than or equal to ${AUTH_EMAIL_PASSWORD_MIN_LENGTH} characters`;
}
