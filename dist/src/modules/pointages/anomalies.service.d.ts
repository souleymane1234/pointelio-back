import type { AuthUser } from "../../common/types/request-context";
import type { AnomaliesQueryDto } from "./dto/pointage.dto";
import { PointagesService } from "./pointages.service";
export declare class AnomaliesService {
    private readonly pointages;
    constructor(pointages: PointagesService);
    list(user: AuthUser, entrepriseId: number, query: AnomaliesQueryDto): Promise<{
        data: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            employe: {
                salaireJournalier: number | null;
                id: number;
                matricule: string | null;
                nom: string;
                prenom: string;
            };
            site: {
                id: number;
                nom: string;
            };
            pointePar: {
                id: number;
                matricule: string | null;
                nom: string;
                prenom: string;
            } | null;
            retardMinutes: number | null;
            paieValidee: boolean;
            montantJour: number;
            anomalies: import("./anomalies.constants").AnomalieType[];
            entrepriseId: number;
            siteId: number;
            createdAt: Date;
            type: import("@prisma/client").$Enums.TypePointage;
            employeId: number;
            pointeParId: number | null;
            methode: import("@prisma/client").$Enums.MethodePointage;
            precisionM: number | null;
            distanceM: number | null;
            statutValidation: import("@prisma/client").$Enums.StatutValidation;
            motifStatut: string | null;
            mockDetecte: boolean;
            requestId: string;
            heureServeur: Date;
        }[];
        pagination: import("../../common/interfaces/response.interface").PaginationMeta;
    }>;
}
