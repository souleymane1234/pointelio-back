import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";
export declare class PackSchemaDto {
    id: number;
    code: string;
    nom: string;
    prixMensuel: number;
    description: string | null;
    maxEmployes: number | null;
    maxSites: number | null;
    essaiJours: number;
    modules: string[];
    ordre: number;
    actif: boolean;
    entreprisesCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PackResponseSchemaDto {
    success: true;
    message: string;
    data: PackSchemaDto;
}
export declare class PacksPaginatedResponseSchemaDto {
    success: true;
    message: string;
    data: PackSchemaDto[];
    pagination: PaginationMetaSchemaDto;
}
