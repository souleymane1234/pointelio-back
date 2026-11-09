import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { type Locale } from "../../common/i18n";
import type { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
export declare class ProfileService {
    private readonly prisma;
    private readonly auditActions;
    constructor(prisma: PrismaService, auditActions: AuditActionsService);
    me(userId: number): Promise<{
        unreadNotificationsCount: number;
        telephone: string | null;
        email: string | null;
        id: number;
        entrepriseId: number | null;
        siteId: number | null;
        horaireId: number | null;
        matricule: string | null;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        statut: import("@prisma/client").$Enums.StatutCompte;
        poste: string | null;
        salaireJournalier: number | null;
        dateEmbauche: Date | null;
        photoUrl: string | null;
        derniereConnexion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        entreprise: {
            id: number;
            raisonSociale: string;
            nomCommercial: string | null;
        } | null;
        site: {
            id: number;
            nom: string;
        } | null;
    }>;
    update(userId: number, dto: UpdateProfileDto, locale: Locale): Promise<{
        telephone: string | null;
        email: string | null;
        id: number;
        entrepriseId: number | null;
        siteId: number | null;
        horaireId: number | null;
        matricule: string | null;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        statut: import("@prisma/client").$Enums.StatutCompte;
        poste: string | null;
        salaireJournalier: number | null;
        dateEmbauche: Date | null;
        photoUrl: string | null;
        derniereConnexion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        entreprise: {
            id: number;
            raisonSociale: string;
            nomCommercial: string | null;
        } | null;
        site: {
            id: number;
            nom: string;
        } | null;
    }>;
    changePassword(userId: number, dto: ChangePasswordDto, locale: Locale): Promise<void>;
    private invalid;
}
