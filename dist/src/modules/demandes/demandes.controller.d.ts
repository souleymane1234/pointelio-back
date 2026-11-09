import { type AuthedRequest } from "../../common/types/request-context";
import { DemandesService } from "./demandes.service";
import { CreateDemandeDto, DeciderDemandeDto, DemandesQueryDto, UpdateDemandeDto } from "./dto/demande.dto";
export declare class DemandesController {
    private readonly demandes;
    constructor(demandes: DemandesService);
    findAll(req: AuthedRequest, query: DemandesQueryDto): Promise<import("../../common/interfaces/response.interface").PaginatedResponse<{
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
    }>>;
    create(req: AuthedRequest, dto: CreateDemandeDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    findOne(req: AuthedRequest, id: number): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    update(req: AuthedRequest, id: number, dto: UpdateDemandeDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    decider(req: AuthedRequest, id: number, dto: DeciderDemandeDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    annuler(req: AuthedRequest, id: number): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    private locale;
}
