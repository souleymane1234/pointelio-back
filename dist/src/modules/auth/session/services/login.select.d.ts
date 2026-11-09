import type { Prisma } from "@prisma/client";
export declare const authUserSelect: {
    id: true;
    entrepriseId: true;
    siteId: true;
    matricule: true;
    nom: true;
    prenom: true;
    email: true;
    telephone: true;
    role: true;
    poste: true;
    photoUrl: true;
};
export declare const localLoginUserSelect: {
    passwordHash: true;
    statut: true;
    id: true;
    entrepriseId: true;
    siteId: true;
    matricule: true;
    nom: true;
    prenom: true;
    email: true;
    telephone: true;
    role: true;
    poste: true;
    photoUrl: true;
};
export type AuthUserRow = Prisma.UtilisateurGetPayload<{
    select: typeof authUserSelect;
}>;
export type LocalLoginUser = Prisma.UtilisateurGetPayload<{
    select: typeof localLoginUserSelect;
}>;
