import { PrismaService } from "../../../../infra/prisma/prisma.service";
import type { RecordAuditActionInput } from "../../shared/audit-trails.types";
export declare class AuditTrailRecorderService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    recordAction(input: RecordAuditActionInput): Promise<void>;
    private resolveActeurEntreprise;
}
