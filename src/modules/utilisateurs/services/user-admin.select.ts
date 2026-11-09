import { Prisma } from "@prisma/client";

/** Rounds bcrypt pour création / mise à jour mot de passe. */
export const USERS_BCRYPT_ROUNDS = 10;

/** Sélection Prisma commune pour les réponses admin utilisateur. */
export const USER_ADMIN_SELECT = {
  id: true,
  entrepriseId: true,
  siteId: true,
  horaireId: true,
  matricule: true,
  nom: true,
  prenom: true,
  email: true,
  telephone: true,
  passwordHash: true,
  role: true,
  statut: true,
  poste: true,
  salaireJournalier: true,
  dateEmbauche: true,
  photoUrl: true,
  mfaActif: true,
  derniereConnexion: true,
  createdAt: true,
  updatedAt: true,
  entreprise: { select: { id: true, raisonSociale: true } },
  site: { select: { id: true, nom: true } },
  horaire: { select: { id: true, nom: true } },
} satisfies Prisma.UtilisateurSelect;

export type UserAdminRow = Prisma.UtilisateurGetPayload<{
  select: typeof USER_ADMIN_SELECT;
}>;

/** Ne renvoie jamais le hash : seulement s'il existe (compte invité sans mot de passe). */
export function normalizeUserAdmin(u: UserAdminRow) {
  const { passwordHash, ...rest } = u;
  return {
    ...rest,
    fullName: `${u.prenom} ${u.nom}`.trim(),
    hasPassword: Boolean(passwordHash),
  };
}
