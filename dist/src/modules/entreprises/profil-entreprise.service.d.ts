import { type Locale } from "../../common/i18n";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import type { UpdateProfilEntrepriseDto } from "./dto/update-entreprise.dto";
export declare class ProfilEntrepriseService {
    private readonly prisma;
    private readonly auditActions;
    constructor(prisma: PrismaService, auditActions: AuditActionsService);
    get(entrepriseId: number, locale: Locale): Promise<{
        id: number;
        statut: import("@prisma/client").$Enums.StatutEntreprise;
        createdAt: Date;
        updatedAt: Date;
        pack: {
            id: number;
            nom: string;
            code: string;
        };
        raisonSociale: string;
        nomCommercial: string | null;
        secteur: string | null;
        pays: string;
        ville: string | null;
        adresse: string | null;
        identifiantLegal: string | null;
        contactNom: string | null;
        contactFonction: string | null;
        contactEmail: string | null;
        contactTel: string | null;
        fuseauHoraire: string;
        dateDemarrage: Date | null;
        dateEcheance: Date | null;
        profilComplete: boolean;
    }>;
    update(acteurId: number, entrepriseId: number, dto: UpdateProfilEntrepriseDto, locale: Locale): Promise<{
        id: number;
        statut: import("@prisma/client").$Enums.StatutEntreprise;
        createdAt: Date;
        updatedAt: Date;
        pack: {
            id: number;
            nom: string;
            code: string;
        };
        raisonSociale: string;
        nomCommercial: string | null;
        secteur: string | null;
        pays: string;
        ville: string | null;
        adresse: string | null;
        identifiantLegal: string | null;
        contactNom: string | null;
        contactFonction: string | null;
        contactEmail: string | null;
        contactTel: string | null;
        fuseauHoraire: string;
        dateDemarrage: Date | null;
        dateEcheance: Date | null;
        profilComplete: boolean;
    }>;
}
