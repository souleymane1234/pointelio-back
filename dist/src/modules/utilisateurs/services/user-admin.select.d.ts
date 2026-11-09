import { Prisma } from "@prisma/client";
export declare const USERS_BCRYPT_ROUNDS = 10;
export declare const USER_ADMIN_SELECT: {
    id: true;
    entrepriseId: true;
    siteId: true;
    horaireId: true;
    matricule: true;
    nom: true;
    prenom: true;
    email: true;
    telephone: true;
    passwordHash: true;
    role: true;
    statut: true;
    poste: true;
    salaireJournalier: true;
    dateEmbauche: true;
    photoUrl: true;
    mfaActif: true;
    derniereConnexion: true;
    createdAt: true;
    updatedAt: true;
    entreprise: {
        select: {
            id: true;
            raisonSociale: true;
        };
    };
    site: {
        select: {
            id: true;
            nom: true;
        };
    };
    horaire: {
        select: {
            id: true;
            nom: true;
        };
    };
};
export type UserAdminRow = Prisma.UtilisateurGetPayload<{
    select: typeof USER_ADMIN_SELECT;
}>;
export declare function normalizeUserAdmin(u: UserAdminRow): {
    fullName: string;
    hasPassword: boolean;
    telephone: string | null;
    email: string | null;
    id: number;
    entrepriseId: number | null;
    siteId: number | null;
    horaireId: number | null;
    matricule: string | null;
    nom: string;
    prenom: string;
    role: import("@prisma/client").$Enums.Role;
    statut: import("@prisma/client").$Enums.StatutCompte;
    poste: string | null;
    salaireJournalier: number | null;
    dateEmbauche: Date | null;
    photoUrl: string | null;
    mfaActif: boolean;
    derniereConnexion: Date | null;
    createdAt: Date;
    updatedAt: Date;
    entreprise: {
        id: number;
        raisonSociale: string;
    } | null;
    site: {
        id: number;
        nom: string;
    } | null;
    horaire: {
        id: number;
        nom: string;
    } | null;
};
