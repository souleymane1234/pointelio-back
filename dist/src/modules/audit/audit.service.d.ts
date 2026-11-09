import type { AuthUser } from "../../common/types/request-context";
import type { AuditLogsQueryDto } from "./audit-logs/dto/audit-logs-query.dto";
import type { RecordAuditActionInput } from "./shared/audit-trails.types";
import { AuditLogsService } from "./audit-logs/services/audit-logs.service";
import { AuditTrailRecorderService } from "./recorder/services/audit-trail-recorder.service";
export declare class AuditService {
    private readonly auditLogsService;
    private readonly auditTrailRecorderService;
    constructor(auditLogsService: AuditLogsService, auditTrailRecorderService: AuditTrailRecorderService);
    listAuditLogs(actor: AuthUser, query: AuditLogsQueryDto): Promise<{
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
    exportAuditLogsCsv(actor: AuthUser, query: AuditLogsQueryDto): Promise<string>;
    recordAction(input: RecordAuditActionInput): Promise<void>;
}
