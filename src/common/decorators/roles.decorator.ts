import { SetMetadata } from "@nestjs/common";
import type { Role } from "@prisma/client";
import { ROLES_KEY } from "../rbac/roles.constants";

/**
 * RBAC : rôles requis pour la route (enum Prisma `Role`, aligné sur `Utilisateur.role`).
 * Exemple: `@Roles(Role.SUPER_ADMIN)` ou `@Roles(...USER_MANAGER_ROLES)`
 */
export const Roles = (...roles: readonly Role[]) =>
  SetMetadata(ROLES_KEY, roles);
