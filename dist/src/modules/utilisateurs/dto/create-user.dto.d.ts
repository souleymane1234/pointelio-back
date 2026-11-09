import { Role, StatutCompte } from "@prisma/client";
export declare class CreateUserDto {
    role: Role;
    nom: string;
    prenom: string;
    email?: string;
    telephone: string;
    password: string;
    statut?: StatutCompte;
    entrepriseId?: number;
    siteId?: number;
    horaireId?: number;
    salaireJournalier?: number;
    matricule?: string;
    poste?: string;
    dateEmbauche?: string;
    photoUrl?: string;
}
