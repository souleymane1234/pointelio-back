import { StatutDemande, TypeDemande } from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";
export declare class DemandePersonneSchemaDto {
    id: number;
    nom: string;
    prenom: string;
    matricule: string | null;
}
export declare class DemandeSchemaDto {
    id: number;
    entrepriseId: number;
    employeId: number;
    type: TypeDemande;
    dateDebut: string;
    dateFin: string;
    nbJours: number | null;
    commentaire: string | null;
    justificatifUrl: string | null;
    statut: StatutDemande;
    decideurId: number | null;
    decisionMotif: string | null;
    decideAt: Date | null;
    createdAt: Date;
    employe: DemandePersonneSchemaDto;
    decideur: DemandePersonneSchemaDto | null;
}
export declare class DemandeResponseSchemaDto {
    success: true;
    message: string;
    data: DemandeSchemaDto;
}
export declare class DemandesPaginatedResponseSchemaDto {
    success: true;
    message: string;
    data: DemandeSchemaDto[];
    pagination: PaginationMetaSchemaDto;
}
