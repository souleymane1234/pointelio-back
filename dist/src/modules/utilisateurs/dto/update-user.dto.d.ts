import { Role, StatutCompte } from "@prisma/client";
export declare class UpdateUserDto {
    role?: Role;
    statut?: StatutCompte;
    suspensionReason?: string;
    nom?: string;
    prenom?: string;
    email?: string | null;
    telephone?: string | null;
    password?: string;
    entrepriseId?: number;
    siteId?: number | null;
    horaireId?: number | null;
    salaireJournalier?: number;
    matricule?: string | null;
    poste?: string | null;
    dateEmbauche?: string | null;
    photoUrl?: string | null;
}
