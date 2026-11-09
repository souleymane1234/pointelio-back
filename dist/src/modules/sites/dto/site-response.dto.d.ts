import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";
export declare class SiteJourHoraireSchemaDto {
    jour: number;
    heureDebut: string;
    heureFin: string;
}
export declare class SiteSchemaDto {
    id: number;
    entrepriseId: number;
    nom: string;
    adresse: string | null;
    latitude: number;
    longitude: number;
    rayonM: number;
    precisionMaxM: number;
    toleranceMin: number | null;
    horairesJours: SiteJourHoraireSchemaDto[];
    joursTravail: number[];
    qrToken: string;
    actif: boolean;
    employesCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class SiteResponseSchemaDto {
    success: true;
    message: string;
    data: SiteSchemaDto;
}
export declare class SitesPaginatedResponseSchemaDto {
    success: true;
    message: string;
    data: SiteSchemaDto[];
    pagination: PaginationMetaSchemaDto;
}
