import { Role, StatutCompte } from "@prisma/client";
declare class ProfileEntrepriseSchemaDto {
    id: number;
    raisonSociale: string;
    nomCommercial: string | null;
}
declare class ProfileSiteSchemaDto {
    id: number;
    nom: string;
}
declare class ProfileUserSchemaDto {
    id: number;
    entrepriseId: number | null;
    siteId: number | null;
    horaireId: number | null;
    matricule: string | null;
    nom: string;
    prenom: string;
    email: string | null;
    telephone: string | null;
    role: Role;
    statut: StatutCompte;
    poste: string | null;
    dateEmbauche: string | null;
    photoUrl: string | null;
    derniereConnexion: string | null;
    createdAt: string;
    updatedAt: string;
    entreprise: ProfileEntrepriseSchemaDto | null;
    site: ProfileSiteSchemaDto | null;
    unreadNotificationsCount?: number;
}
export declare class ProfileMeResponseSchemaDto {
    success: true;
    message: string;
    data: ProfileUserSchemaDto;
}
export {};
