import { Role } from "@prisma/client";

/** Équipe Pointelio : aucune entreprise de rattachement, accès à toutes les entreprises. */
export const PLATFORM_ROLES: readonly Role[] = [Role.SUPER_ADMIN, Role.SUPPORT];

/** Administrateurs d'une entreprise cliente : gèrent les comptes de leur entreprise. */
export const TENANT_ADMIN_ROLES: readonly Role[] = [
  Role.ADMIN_CLIENT,
  Role.RESPONSABLE_RH,
];

/** Rôles autorisés à gérer des utilisateurs (plateforme + admins d'entreprise). */
export const USER_MANAGER_ROLES: readonly Role[] = [
  ...PLATFORM_ROLES,
  ...TENANT_ADMIN_ROLES,
];

/** Rôles autorisés sur le backoffice web (connexion via /auth/admin/login). */
export const BACKOFFICE_ROLES: readonly Role[] = [
  ...USER_MANAGER_ROLES,
  Role.MANAGER,
];

/** Rôles de l'application mobile : un PIN de 4 chiffres est accepté comme mot de passe. */
export const MOBILE_ROLES: readonly Role[] = [Role.EMPLOYE, Role.SURVEILLANT];

/** Rôles rattachés à une entreprise (tous sauf l'équipe Pointelio). */
export const TENANT_ROLES: readonly Role[] = Object.values(Role).filter(
  (role) => !PLATFORM_ROLES.includes(role),
);

/** Rôles qu'un acteur peut attribuer (création / modification de compte). */
const ASSIGNABLE_ROLES: Record<Role, readonly Role[]> = {
  [Role.SUPER_ADMIN]: Object.values(Role),
  [Role.SUPPORT]: Object.values(Role).filter((r) => r !== Role.SUPER_ADMIN),
  [Role.ADMIN_CLIENT]: TENANT_ROLES,
  [Role.RESPONSABLE_RH]: [Role.MANAGER, Role.SURVEILLANT, Role.EMPLOYE],
  [Role.MANAGER]: [],
  [Role.SURVEILLANT]: [],
  [Role.EMPLOYE]: [],
};

export function isPlatformRole(role: Role): boolean {
  return PLATFORM_ROLES.includes(role);
}

export function canAssignRole(actorRole: Role, targetRole: Role): boolean {
  return ASSIGNABLE_ROLES[actorRole].includes(targetRole);
}
