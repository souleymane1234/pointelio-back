import { StatutEntreprise } from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";
declare class EntreprisePackRefSchemaDto {
    id: number;
    code: string;
    nom: string;
}
export declare class EntrepriseProfilSchemaDto {
    id: number;
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
    statut: StatutEntreprise;
    dateDemarrage: Date | null;
    dateEcheance: Date | null;
    profilComplete: boolean;
    pack: EntreprisePackRefSchemaDto;
    createdAt: Date;
    updatedAt: Date;
}
export declare class EntrepriseAdminSchemaDto extends EntrepriseProfilSchemaDto {
    packId: number;
    maxSitesOverride: number | null;
    maxEmployesOverride: number | null;
    modulesOverride: string[] | null;
    notesInternes: string | null;
    utilisateursCount: number;
    sitesCount: number;
}
export declare class EntrepriseProfilResponseSchemaDto {
    success: true;
    message: string;
    data: EntrepriseProfilSchemaDto;
}
export declare class EntrepriseResponseSchemaDto {
    success: true;
    message: string;
    data: EntrepriseAdminSchemaDto;
}
export declare class EntreprisesPaginatedResponseSchemaDto {
    success: true;
    message: string;
    data: EntrepriseAdminSchemaDto[];
    pagination: PaginationMetaSchemaDto;
}
export {};
