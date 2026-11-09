import { type AuthedRequest } from "../../common/types/request-context";
import { DashboardService } from "./dashboard.service";
import { PresencePeriodeQueryDto, PresenceQueryDto } from "./dto/presence-query.dto";
export declare class DashboardClientController {
    private readonly dashboard;
    constructor(dashboard: DashboardService);
    presence(req: AuthedRequest, query: PresenceQueryDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        date: string;
        effectif: number;
        presents: number;
        retards: number;
        paiesValidees: number;
        masseSalarialeJour: number;
        employes: {
            employeId: number;
            nom: string;
            prenom: string;
            matricule: string | null;
            siteId: number;
            siteNom: string;
            jourOuvre: boolean;
            heureDebut: string | null;
            heureFin: string | null;
            toleranceMin: number | null;
            arrivee: {
                id: string;
                type: import("@prisma/client").$Enums.TypePointage;
                heureServeur: Date;
                statutValidation: import("@prisma/client").$Enums.StatutValidation;
                retardMinutes: number | null;
            } | null;
            depart: {
                id: string;
                type: import("@prisma/client").$Enums.TypePointage;
                heureServeur: Date;
                statutValidation: import("@prisma/client").$Enums.StatutValidation;
                retardMinutes: null;
            } | null;
            enRetard: boolean;
            paieValidee: boolean;
            salaireJournalier: number | null;
            montantJour: number;
        }[];
    }>>;
    presencePeriode(req: AuthedRequest, query: PresencePeriodeQueryDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        du: string;
        au: string;
        joursCalcules: number;
        effectif: number;
        totaux: {
            joursOuvres: number;
            joursPresents: number;
            absences: number;
            absencesJustifiees: number;
            retards: number;
            oublisDepart: number;
            joursPayes: number;
            masseSalariale: number;
            tauxPresence: number;
        };
        jours: {
            date: string;
            prevus: number;
            presents: number;
            retards: number;
            masseSalariale: number;
        }[];
        employes: ({
            employeId: number;
            nom: string;
            prenom: string;
            matricule: string | null;
            siteId: number;
            siteNom: string;
            salaireJournalier: number | null;
            joursOuvres: number;
            joursPresents: number;
            absences: number;
            absencesJustifiees: number;
            retards: number;
            retardMinutes: number;
            oublisDepart: number;
            joursPayes: number;
            montant: number;
        } | {
            detail: {
                date: string;
                jourOuvre: boolean;
                heureDebut: string | null;
                heureFin: string | null;
                arrivee: Date | null;
                depart: Date | null;
                retardMinutes: number;
                anomalieGps: boolean;
                conge: import("@prisma/client").TypeDemande | null;
                statut: "REPOS" | "ABSENT" | "CONGE" | "PRESENT" | "RETARD" | "SANS_DEPART" | "EN_POSTE";
                montant: number;
            }[];
            employeId: number;
            nom: string;
            prenom: string;
            matricule: string | null;
            siteId: number;
            siteNom: string;
            salaireJournalier: number | null;
            joursOuvres: number;
            joursPresents: number;
            absences: number;
            absencesJustifiees: number;
            retards: number;
            retardMinutes: number;
            oublisDepart: number;
            joursPayes: number;
            montant: number;
        })[];
    }>>;
}
