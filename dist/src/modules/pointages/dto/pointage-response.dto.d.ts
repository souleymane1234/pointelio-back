import { MethodePointage, StatutValidation, TypePointage } from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";
import { type AnomalieType } from "../anomalies.constants";
export declare class PointagePersonneSchemaDto {
    id: number;
    nom: string;
    prenom: string;
    matricule: string | null;
    salaireJournalier?: number | null;
}
export declare class PointageSiteSchemaDto {
    id: number;
    nom: string;
}
export declare class PointageSchemaDto {
    id: string;
    entrepriseId: number;
    employeId: number;
    siteId: number;
    pointeParId: number | null;
    type: TypePointage;
    methode: MethodePointage;
    latitude: number | null;
    longitude: number | null;
    precisionM: number | null;
    distanceM: number | null;
    statutValidation: StatutValidation;
    motifStatut: string | null;
    mockDetecte: boolean;
    requestId: string;
    heureServeur: Date;
    createdAt: Date;
    employe: PointagePersonneSchemaDto;
    site: PointageSiteSchemaDto;
    pointePar: PointagePersonneSchemaDto | null;
    retardMinutes: number | null;
    paieValidee: boolean;
    montantJour: number;
    anomalies: AnomalieType[];
}
export declare class PointageCorrectionSchemaDto {
    id: number;
    pointageId: string;
    auteurId: number;
    motif: string;
    avant: Record<string, unknown>;
    apres: Record<string, unknown>;
    createdAt: Date;
    auteur: PointagePersonneSchemaDto;
}
export declare class SurveillantEmployeSchemaDto {
    id: number;
    nom: string;
    prenom: string;
    matricule: string | null;
    poste: string | null;
    photoUrl: string | null;
    dernierPointageJour: Pick<PointageSchemaDto, "id" | "type" | "heureServeur" | "statutValidation"> | null;
}
export declare class PointageResponseSchemaDto {
    success: true;
    message: string;
    data: PointageSchemaDto;
}
export declare class PointagesPaginatedResponseSchemaDto {
    success: true;
    message: string;
    data: PointageSchemaDto[];
    pagination: PaginationMetaSchemaDto;
}
export declare class PointageCorrectionResponseSchemaDto {
    success: true;
    message: string;
    data: PointageCorrectionSchemaDto;
}
export declare class PointageCorrectionsResponseSchemaDto {
    success: true;
    message: string;
    data: PointageCorrectionSchemaDto[];
}
export declare class SurveillantEmployesResponseSchemaDto {
    success: true;
    message: string;
    data: SurveillantEmployeSchemaDto[];
}
