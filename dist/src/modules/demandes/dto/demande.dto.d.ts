import { StatutDemande, TypeDemande } from "@prisma/client";
export declare class CreateDemandeDto {
    type: TypeDemande;
    dateDebut: string;
    dateFin: string;
    employeId?: number;
    commentaire?: string;
    justificatifUrl?: string;
}
export declare class UpdateDemandeDto {
    type?: TypeDemande;
    dateDebut?: string;
    dateFin?: string;
    commentaire?: string | null;
    justificatifUrl?: string | null;
}
export declare class DeciderDemandeDto {
    statut: typeof StatutDemande.APPROUVEE | typeof StatutDemande.REFUSEE;
    decisionMotif?: string;
}
export declare class DemandesQueryDto {
    page?: number;
    per_page?: number;
    statut?: StatutDemande;
    type?: TypeDemande;
    employeId?: number;
    dateDebut?: string;
    dateFin?: string;
}
