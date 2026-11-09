import type { AuthUser } from "../../../../common/types/request-context";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import type { AuditLogsQueryDto } from "../dto/audit-logs-query.dto";
export declare class AuditLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildWhere;
    private mapRow;
    list(actor: AuthUser, query: AuditLogsQueryDto): Promise<{
        data: {
            id: string;
            details: Record<string, unknown> | null;
            entrepriseId: number | null;
            createdAt: Date;
            acteurId: number | null;
            action: string;
            objet: string | null;
            objetId: string | null;
            ip: string | null;
            resultat: string;
            acteur: {
                email: string | null;
                id: number;
                nom: string;
                prenom: string;
            } | null;
        }[];
        pagination: {
            current_page: number;
            total_pages: number;
            per_page: number;
            total_items: number;
        };
    }>;
    exportCsv(actor: AuthUser, query: AuditLogsQueryDto): Promise<string>;
    private sanitizeDetailsForExport;
}
