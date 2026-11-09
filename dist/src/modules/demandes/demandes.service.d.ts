import { type Locale } from "../../common/i18n";
import type { AuthUser } from "../../common/types/request-context";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import { NotificationsService } from "../notifications/notifications.service";
import type { CreateDemandeDto, DeciderDemandeDto, DemandesQueryDto, UpdateDemandeDto } from "./dto/demande.dto";
export declare class DemandesService {
    private readonly prisma;
    private readonly auditActions;
    private readonly notifications;
    private readonly logger;
    constructor(prisma: PrismaService, auditActions: AuditActionsService, notifications: NotificationsService);
    findAll(user: AuthUser, entrepriseId: number, query: DemandesQueryDto): Promise<{
        data: {
            dateDebut: string;
            dateFin: string;
            id: number;
            entrepriseId: number;
            statut: import("@prisma/client").$Enums.StatutDemande;
            createdAt: Date;
            employe: {
                id: number;
                matricule: string | null;
                nom: string;
                prenom: string;
            };
            type: import("@prisma/client").$Enums.TypeDemande;
            employeId: number;
            nbJours: number | null;
            commentaire: string | null;
            justificatifUrl: string | null;
            decideurId: number | null;
            decisionMotif: string | null;
            decideAt: Date | null;
            decideur: {
                id: number;
                matricule: string | null;
                nom: string;
                prenom: string;
            } | null;
        }[];
        pagination: import("../../common/interfaces/response.interface").PaginationMeta;
    }>;
    findOne(user: AuthUser, entrepriseId: number, id: number, locale: Locale): Promise<{
        dateDebut: string;
        dateFin: string;
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutDemande;
        createdAt: Date;
        employe: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        };
        type: import("@prisma/client").$Enums.TypeDemande;
        employeId: number;
        nbJours: number | null;
        commentaire: string | null;
        justificatifUrl: string | null;
        decideurId: number | null;
        decisionMotif: string | null;
        decideAt: Date | null;
        decideur: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        } | null;
    }>;
    create(user: AuthUser, entrepriseId: number, dto: CreateDemandeDto, locale: Locale): Promise<{
        dateDebut: string;
        dateFin: string;
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutDemande;
        createdAt: Date;
        employe: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        };
        type: import("@prisma/client").$Enums.TypeDemande;
        employeId: number;
        nbJours: number | null;
        commentaire: string | null;
        justificatifUrl: string | null;
        decideurId: number | null;
        decisionMotif: string | null;
        decideAt: Date | null;
        decideur: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        } | null;
    }>;
    update(user: AuthUser, entrepriseId: number, id: number, dto: UpdateDemandeDto, locale: Locale): Promise<{
        dateDebut: string;
        dateFin: string;
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutDemande;
        createdAt: Date;
        employe: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        };
        type: import("@prisma/client").$Enums.TypeDemande;
        employeId: number;
        nbJours: number | null;
        commentaire: string | null;
        justificatifUrl: string | null;
        decideurId: number | null;
        decisionMotif: string | null;
        decideAt: Date | null;
        decideur: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        } | null;
    }>;
    decider(user: AuthUser, entrepriseId: number, id: number, dto: DeciderDemandeDto, locale: Locale): Promise<{
        dateDebut: string;
        dateFin: string;
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutDemande;
        createdAt: Date;
        employe: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        };
        type: import("@prisma/client").$Enums.TypeDemande;
        employeId: number;
        nbJours: number | null;
        commentaire: string | null;
        justificatifUrl: string | null;
        decideurId: number | null;
        decisionMotif: string | null;
        decideAt: Date | null;
        decideur: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        } | null;
    }>;
    annuler(user: AuthUser, entrepriseId: number, id: number, locale: Locale): Promise<{
        dateDebut: string;
        dateFin: string;
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutDemande;
        createdAt: Date;
        employe: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        };
        type: import("@prisma/client").$Enums.TypeDemande;
        employeId: number;
        nbJours: number | null;
        commentaire: string | null;
        justificatifUrl: string | null;
        decideurId: number | null;
        decisionMotif: string | null;
        decideAt: Date | null;
        decideur: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        } | null;
    }>;
    private requireEnAttente;
    private assertOwnerOrAdmin;
    private assertCanRead;
    private sameSite;
    private resolveEmployeId;
    private assertPeriode;
    private assertJustificatif;
    private assertPasDeChevauchement;
    private nbJoursOuvres;
    private scopeWhere;
    private notifyDecideurs;
    private notifyEmploye;
    private notifySafe;
    private audit;
    private invalid;
}
