import type { Prisma } from "@prisma/client";

/** Profil visible par l'entreprise cliente (sans notes internes). */
export const ENTREPRISE_PROFIL_SELECT = {
  id: true,
  raisonSociale: true,
  nomCommercial: true,
  secteur: true,
  pays: true,
  ville: true,
  adresse: true,
  identifiantLegal: true,
  contactNom: true,
  contactFonction: true,
  contactEmail: true,
  contactTel: true,
  fuseauHoraire: true,
  statut: true,
  dateDemarrage: true,
  dateEcheance: true,
  profilComplete: true,
  createdAt: true,
  updatedAt: true,
  pack: { select: { id: true, code: true, nom: true } },
} satisfies Prisma.EntrepriseSelect;

/** Vue backoffice Pointelio : profil + surcharges, notes internes et volumes. */
export const ENTREPRISE_ADMIN_SELECT = {
  ...ENTREPRISE_PROFIL_SELECT,
  packId: true,
  maxSitesOverride: true,
  maxEmployesOverride: true,
  modulesOverride: true,
  notesInternes: true,
  _count: { select: { utilisateurs: true, sites: true } },
} satisfies Prisma.EntrepriseSelect;

type EntrepriseAdminRow = Prisma.EntrepriseGetPayload<{
  select: typeof ENTREPRISE_ADMIN_SELECT;
}>;

export function normalizeEntrepriseAdmin(row: EntrepriseAdminRow) {
  const { _count, ...entreprise } = row;
  return {
    ...entreprise,
    utilisateursCount: _count.utilisateurs,
    sitesCount: _count.sites,
  };
}

/** Champs requis pour considérer le profil comme complet. */
export function isProfilComplete(e: {
  secteur: string | null;
  ville: string | null;
  adresse: string | null;
  contactNom: string | null;
  contactEmail: string | null;
  contactTel: string | null;
}): boolean {
  return Boolean(
    e.secteur &&
    e.ville &&
    e.adresse &&
    e.contactNom &&
    (e.contactEmail || e.contactTel),
  );
}
