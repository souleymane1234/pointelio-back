import { StatutEntreprise } from "@prisma/client";
declare class EntitlementsPackSchemaDto {
    id: number;
    code: string;
    nom: string;
}
declare class EntitlementsLimitesSchemaDto {
    maxEmployes: number | null;
    maxSites: number | null;
}
declare class EntitlementsUsageSchemaDto {
    employes: number;
    sites: number;
}
export declare class EntitlementsSchemaDto {
    entrepriseId: number;
    statut: StatutEntreprise;
    dateEcheance: Date | null;
    pack: EntitlementsPackSchemaDto;
    limites: EntitlementsLimitesSchemaDto;
    modules: string[];
    usage: EntitlementsUsageSchemaDto;
}
export declare class EntitlementsResponseSchemaDto {
    success: true;
    message: string;
    data: EntitlementsSchemaDto | null;
}
export {};
