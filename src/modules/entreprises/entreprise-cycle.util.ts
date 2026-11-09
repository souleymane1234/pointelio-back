import { StatutEntreprise } from "@prisma/client";

export type CycleAction = "suspendre" | "reactiver" | "cloturer";

const TRANSITIONS: Record<
  CycleAction,
  { from: readonly StatutEntreprise[]; to: StatutEntreprise }
> = {
  suspendre: {
    from: [
      StatutEntreprise.ESSAI,
      StatutEntreprise.ACTIF,
      StatutEntreprise.PAIEMENT_EN_ATTENTE,
      StatutEntreprise.EN_RETARD,
    ],
    to: StatutEntreprise.SUSPENDU,
  },
  reactiver: {
    from: [StatutEntreprise.SUSPENDU],
    to: StatutEntreprise.ACTIF,
  },
  cloturer: {
    from: Object.values(StatutEntreprise).filter(
      (s) => s !== StatutEntreprise.RESILIE,
    ),
    to: StatutEntreprise.RESILIE,
  },
};

/** Statut cible du cycle de vie, ou null si la transition est interdite. */
export function nextStatut(
  action: CycleAction,
  current: StatutEntreprise,
): StatutEntreprise | null {
  const transition = TRANSITIONS[action];
  return transition.from.includes(current) ? transition.to : null;
}
