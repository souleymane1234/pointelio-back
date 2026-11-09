import type { Prisma } from "@prisma/client";
export declare const ENTREPRISE_PROFIL_SELECT: {
    id: true;
    raisonSociale: true;
    nomCommercial: true;
    secteur: true;
    pays: true;
    ville: true;
    adresse: true;
    identifiantLegal: true;
    contactNom: true;
    contactFonction: true;
    contactEmail: true;
    contactTel: true;
    fuseauHoraire: true;
    statut: true;
    dateDemarrage: true;
    dateEcheance: true;
    profilComplete: true;
    createdAt: true;
    updatedAt: true;
    pack: {
        select: {
            id: true;
            code: true;
            nom: true;
        };
    };
};
export declare const ENTREPRISE_ADMIN_SELECT: {
    packId: true;
    maxSitesOverride: true;
    maxEmployesOverride: true;
    modulesOverride: true;
    notesInternes: true;
    _count: {
        select: {
            utilisateurs: true;
            sites: true;
        };
    };
    id: true;
    raisonSociale: true;
    nomCommercial: true;
    secteur: true;
    pays: true;
    ville: true;
    adresse: true;
    identifiantLegal: true;
    contactNom: true;
    contactFonction: true;
    contactEmail: true;
    contactTel: true;
    fuseauHoraire: true;
    statut: true;
    dateDemarrage: true;
    dateEcheance: true;
    profilComplete: true;
    createdAt: true;
    updatedAt: true;
    pack: {
        select: {
            id: true;
            code: true;
            nom: true;
        };
    };
};
type EntrepriseAdminRow = Prisma.EntrepriseGetPayload<{
    select: typeof ENTREPRISE_ADMIN_SELECT;
}>;
export declare function normalizeEntrepriseAdmin(row: EntrepriseAdminRow): {
    utilisateursCount: number;
    sitesCount: number;
    id: number;
    statut: import("@prisma/client").$Enums.StatutEntreprise;
    createdAt: Date;
    updatedAt: Date;
    pack: {
        id: number;
        nom: string;
        code: string;
    };
    raisonSociale: string;
    nomCommercial: string | null;
    secteur: string | null;
    pays: string;
    ville: string | null;
    adresse: string | null;
    identifiantLegal: string | null;
    contactNom: string | null;
    contactFonction: string | null;
    contactEmail: string | null;
    contactTel: string | null;
    fuseauHoraire: string;
    packId: number;
    dateDemarrage: Date | null;
    dateEcheance: Date | null;
    profilComplete: boolean;
    maxSitesOverride: number | null;
    maxEmployesOverride: number | null;
    modulesOverride: Prisma.JsonValue;
    notesInternes: string | null;
};
export declare function isProfilComplete(e: {
    secteur: string | null;
    ville: string | null;
    adresse: string | null;
    contactNom: string | null;
    contactEmail: string | null;
    contactTel: string | null;
}): boolean;
export {};
