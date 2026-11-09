import type { Response } from "express";
import { type AuthedRequest } from "../../../common/types/request-context";
import { AuditActionsService } from "../recorder/services/audit-actions.service";
import { AuditService } from "../audit.service";
import { AuditLogsQueryDto } from "./dto/audit-logs-query.dto";
export declare class AuditLogsController {
    private readonly auditTrailsService;
    private readonly auditActions;
    constructor(auditTrailsService: AuditService, auditActions: AuditActionsService);
    listAuditLogs(req: AuthedRequest, query: AuditLogsQueryDto): Promise<import("../../../common/interfaces/response.interface").PaginatedResponse<{
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
    }>>;
    exportAuditLogs(req: AuthedRequest, query: AuditLogsQueryDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
