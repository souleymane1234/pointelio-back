import {
  Role,
  StatutCompte,
  type Prisma,
  type StatutEntreprise,
} from "@prisma/client";
import {
  isPackModule,
  PACK_MODULES,
  type PackModule,
} from "../../common/constants/pack-modules.constants";

/**
 * Comptes décomptés dans `maxEmployes` : tout compte de l'entreprise sauf
 * l'administrateur client, hors comptes désactivés.
 */
export const ROLES_DECOMPTES_EMPLOYES: readonly Role[] = [
  Role.RESPONSABLE_RH,
  Role.MANAGER,
  Role.SURVEILLANT,
  Role.EMPLOYE,
];

/** Vrai si le compte est décompté dans la limite d'employés de son entreprise. */
export function isDecompteEmploye(user: {
  entrepriseId: number | null;
  role: Role;
  statut: StatutCompte;
}): boolean {
  return (
    user.entrepriseId !== null &&
    ROLES_DECOMPTES_EMPLOYES.includes(user.role) &&
    user.statut !== StatutCompte.DESACTIVE
  );
}

export type Entitlements = {
  entrepriseId: number;
  statut: StatutEntreprise;
  dateEcheance: Date | null;
  pack: { id: number; code: string; nom: string };
  /** null = illimité. */
  limites: { maxEmployes: number | null; maxSites: number | null };
  modules: PackModule[];
};

type EntrepriseForEntitlements = {
  id: number;
  statut: StatutEntreprise;
  dateEcheance: Date | null;
  maxSitesOverride: number | null;
  maxEmployesOverride: number | null;
  modulesOverride: Prisma.JsonValue | null;
  pack: {
    id: number;
    code: string;
    nom: string;
    maxEmployes: number | null;
    maxSites: number | null;
    modules: Prisma.JsonValue;
  };
};

export function parseModules(value: Prisma.JsonValue | null): PackModule[] {
  return Array.isArray(value) ? [...new Set(value.filter(isPackModule))] : [];
}

/**
 * Surcharge de l'entreprise si renseignée, sinon valeur du pack.
 * Sans le module MULTI_SITES, l'entreprise est limitée à un site.
 */
export function computeEntitlements(
  entreprise: EntrepriseForEntitlements,
): Entitlements {
  const modules = parseModules(
    entreprise.modulesOverride ?? entreprise.pack.modules,
  );
  const maxSites = entreprise.maxSitesOverride ?? entreprise.pack.maxSites;

  return {
    entrepriseId: entreprise.id,
    statut: entreprise.statut,
    dateEcheance: entreprise.dateEcheance,
    pack: {
      id: entreprise.pack.id,
      code: entreprise.pack.code,
      nom: entreprise.pack.nom,
    },
    limites: {
      maxEmployes:
        entreprise.maxEmployesOverride ?? entreprise.pack.maxEmployes,
      maxSites: modules.includes(PACK_MODULES.MULTI_SITES)
        ? maxSites
        : Math.min(maxSites ?? 1, 1),
    },
    modules,
  };
}

/** Vrai si `count + ajout` reste dans la limite (null = illimité). */
export function withinLimit(
  limit: number | null,
  count: number,
  ajout = 1,
): boolean {
  return limit === null || count + ajout <= limit;
}
