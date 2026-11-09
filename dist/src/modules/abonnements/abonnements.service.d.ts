import { type Locale } from "../../common/i18n";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import { EntitlementsService } from "../entitlements/entitlements.service";
import type { UpdateAbonnementDto } from "./dto/update-abonnement.dto";
export declare class AbonnementsService {
    private readonly prisma;
    private readonly entitlements;
    private readonly auditActions;
    constructor(prisma: PrismaService, entitlements: EntitlementsService, auditActions: AuditActionsService);
    get(entrepriseId: number, locale: Locale): Promise<{
        dateDemarrage: Date | null;
        prixMensuel: number;
        bloque: boolean;
        usage: {
            employes: number;
            sites: number;
        };
        entrepriseId: number;
        statut: import("@prisma/client").StatutEntreprise;
        dateEcheance: Date | null;
        pack: {
            id: number;
            code: string;
            nom: string;
        };
        limites: {
            maxEmployes: number | null;
            maxSites: number | null;
        };
        modules: import("../../common/constants/pack-modules.constants").PackModule[];
    }>;
    modifier(acteurId: number, entrepriseId: number, dto: UpdateAbonnementDto, locale: Locale): Promise<{
        dateDemarrage: Date | null;
        prixMensuel: number;
        bloque: boolean;
        usage: {
            employes: number;
            sites: number;
        };
        entrepriseId: number;
        statut: import("@prisma/client").StatutEntreprise;
        dateEcheance: Date | null;
        pack: {
            id: number;
            code: string;
            nom: string;
        };
        limites: {
            maxEmployes: number | null;
            maxSites: number | null;
        };
        modules: import("../../common/constants/pack-modules.constants").PackModule[];
    }>;
    private findActivePack;
    private invalid;
}
