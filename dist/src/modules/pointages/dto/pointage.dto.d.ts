import { MethodePointage, StatutValidation, TypePointage } from "@prisma/client";
import { type AnomalieType } from "../anomalies.constants";
export declare class PointerQrDto {
    qrToken: string;
    type: TypePointage;
    latitude: number;
    longitude: number;
    precisionM: number;
    requestId: string;
    mockDetecte?: boolean;
}
export declare class PointerSurveillantDto {
    employeId: number;
    type: TypePointage;
    requestId: string;
    latitude?: number;
    longitude?: number;
    precisionM?: number;
    mockDetecte?: boolean;
}
export declare class CorrigerPointageDto {
    motif: string;
    type?: TypePointage;
    siteId?: number;
    heureServeur?: string;
    statutValidation?: StatutValidation;
    motifStatut?: string;
}
export declare class PointagesQueryDto {
    page?: number;
    per_page?: number;
    employeId?: number;
    siteId?: number;
    type?: TypePointage;
    methode?: MethodePointage;
    statutValidation?: StatutValidation;
    dateDebut?: string;
    dateFin?: string;
}
export declare class AnomaliesQueryDto extends PointagesQueryDto {
    anomalie?: AnomalieType;
}
