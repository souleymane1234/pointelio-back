export declare class AuditLogsQueryDto {
    page?: number;
    per_page?: number;
    action?: string;
    objet?: string;
    objetId?: string;
    acteurId?: number;
    entrepriseId?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
}
