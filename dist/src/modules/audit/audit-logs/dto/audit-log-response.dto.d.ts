import { PaginationMetaSchemaDto } from "../../../../common/dto/pagination-response.dto";
export declare class AuditLogActeurSchemaDto {
    id: number;
    nom: string;
    prenom: string;
    email: string | null;
}
export declare class AuditLogSchemaDto {
    id: string;
    entrepriseId: number | null;
    acteurId: number | null;
    acteur: AuditLogActeurSchemaDto | null;
    action: string;
    objet: string | null;
    objetId: string | null;
    details: Record<string, unknown> | null;
    ip: string | null;
    resultat: string;
    createdAt: Date;
}
export declare class AuditLogsPaginatedResponseSchemaDto {
    success: true;
    message: string;
    data: AuditLogSchemaDto[];
    pagination: PaginationMetaSchemaDto;
}
