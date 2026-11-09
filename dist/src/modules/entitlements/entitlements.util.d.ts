import { Role, StatutCompte, type Prisma, type StatutEntreprise } from "@prisma/client";
import { type PackModule } from "../../common/constants/pack-modules.constants";
export declare const ROLES_DECOMPTES_EMPLOYES: readonly Role[];
export declare function isDecompteEmploye(user: {
    entrepriseId: number | null;
    role: Role;
    statut: StatutCompte;
}): boolean;
export type Entitlements = {
    entrepriseId: number;
    statut: StatutEntreprise;
    dateEcheance: Date | null;
    pack: {
        id: number;
        code: string;
        nom: string;
    };
    limites: {
        maxEmployes: number | null;
        maxSites: number | null;
    };
    modules: PackModule[];
};
type EntrepriseForEntitlements = {
    id: number;
    statut: StatutEntreprise;
    dateEcheance: Date | null;
    maxSitesOverride: number | null;
    maxEmployesOverride: number | null;
    modulesOverride: Prisma.JsonValue | null;
    pack: {
        id: number;
        code: string;
        nom: string;
        maxEmployes: number | null;
        maxSites: number | null;
        modules: Prisma.JsonValue;
    };
};
export declare function parseModules(value: Prisma.JsonValue | null): PackModule[];
export declare function computeEntitlements(entreprise: EntrepriseForEntitlements): Entitlements;
export declare function withinLimit(limit: number | null, count: number, ajout?: number): boolean;
export {};
