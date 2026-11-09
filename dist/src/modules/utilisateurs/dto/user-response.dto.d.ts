import { Role, StatutCompte } from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";
declare class RefEntrepriseSchemaDto {
    id: number;
    raisonSociale: string;
}
declare class RefNomSchemaDto {
    id: number;
    nom: string;
}
export declare class AdminUserDetailSchemaDto {
    id: number;
    entrepriseId: number | null;
    siteId: number | null;
    horaireId: number | null;
    matricule: string | null;
    nom: string;
    prenom: string;
    fullName: string;
    email: string | null;
    telephone: string | null;
    role: Role;
    statut: StatutCompte;
    hasPassword: boolean;
    poste: string | null;
    salaireJournalier: number | null;
    dateEmbauche: Date | null;
    photoUrl: string | null;
    mfaActif: boolean;
    derniereConnexion: Date | null;
    entreprise: RefEntrepriseSchemaDto | null;
    site: RefNomSchemaDto | null;
    horaire: RefNomSchemaDto | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserResponseSchemaDto {
    success: true;
    message: string;
    data: AdminUserDetailSchemaDto;
}
export declare class UsersPaginatedResponseSchemaDto {
    success: true;
    message: string;
    data: AdminUserDetailSchemaDto[];
    pagination: PaginationMetaSchemaDto;
}
export {};
