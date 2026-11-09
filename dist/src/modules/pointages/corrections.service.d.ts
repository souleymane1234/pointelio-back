import { type Locale } from "../../common/i18n";
import type { AuthUser } from "../../common/types/request-context";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import type { CorrigerPointageDto } from "./dto/pointage.dto";
import { PointagesService } from "./pointages.service";
export declare class CorrectionsService {
    private readonly prisma;
    private readonly pointages;
    private readonly auditActions;
    constructor(prisma: PrismaService, pointages: PointagesService, auditActions: AuditActionsService);
    list(user: AuthUser, entrepriseId: number, pointageId: bigint, locale: Locale): Promise<{
        pointageId: string;
        avant: Record<string, unknown>;
        apres: Record<string, unknown>;
        id: number;
        createdAt: Date;
        auteurId: number;
        motif: string;
        auteur: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        };
    }[]>;
    corriger(user: AuthUser, entrepriseId: number, pointageId: bigint, dto: CorrigerPointageDto, locale: Locale): Promise<{
        pointageId: string;
        avant: Record<string, unknown>;
        apres: Record<string, unknown>;
        id: number;
        createdAt: Date;
        auteurId: number;
        motif: string;
        auteur: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        };
    }>;
}
