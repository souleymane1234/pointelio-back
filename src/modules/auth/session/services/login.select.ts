import type { Prisma } from "@prisma/client";

/** Champs exposés dans la réponse d'authentification. */
export const authUserSelect = {
  id: true,
  entrepriseId: true,
  siteId: true,
  matricule: true,
  nom: true,
  prenom: true,
  email: true,
  telephone: true,
  role: true,
  poste: true,
  photoUrl: true,
} satisfies Prisma.UtilisateurSelect;

/** Champs stricts pour l'authentification locale — une requête, sans relations. */
export const localLoginUserSelect = {
  ...authUserSelect,
  passwordHash: true,
  statut: true,
} satisfies Prisma.UtilisateurSelect;

export type AuthUserRow = Prisma.UtilisateurGetPayload<{
  select: typeof authUserSelect;
}>;

export type LocalLoginUser = Prisma.UtilisateurGetPayload<{
  select: typeof localLoginUserSelect;
}>;
