export declare const STATUTS_ABONNEMENT: readonly ["ESSAI", "ACTIF", "PAIEMENT_EN_ATTENTE", "EN_RETARD"];
export declare class UpdateAbonnementDto {
    packId?: number;
    statut?: (typeof STATUTS_ABONNEMENT)[number];
    dateEcheance?: string | null;
    maxEmployesOverride?: number | null;
    maxSitesOverride?: number | null;
    modulesOverride?: string[] | null;
}
