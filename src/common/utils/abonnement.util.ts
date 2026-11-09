import { StatutEntreprise } from "@prisma/client";

/**
 * Un compte d'entreprise est bloqué si l'abonnement est suspendu, résilié, ou
 * si la période d'essai est échue. Les statuts de retard de paiement
 * (PAIEMENT_EN_ATTENTE, EN_RETARD) laissent l'accès : la relance puis la
 * suspension relèvent de la facturation.
 */
export function isAbonnementBloque(
  statut: StatutEntreprise,
  dateEcheance: Date | null,
  now: Date = new Date(),
): boolean {
  if (
    statut === StatutEntreprise.SUSPENDU ||
    statut === StatutEntreprise.RESILIE
  ) {
    return true;
  }
  return (
    statut === StatutEntreprise.ESSAI &&
    dateEcheance !== null &&
    dateEcheance.getTime() < now.getTime()
  );
}
