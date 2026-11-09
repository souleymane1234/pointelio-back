import type { Response } from "express";
import { type AuthedRequest } from "../../../common/types/request-context";
import { PointerSurveillantDto } from "../dto/pointage.dto";
import { SurveillantService } from "./surveillant.service";
export declare class SurveillantController {
    private readonly surveillant;
    constructor(surveillant: SurveillantService);
    employes(req: AuthedRequest): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
        dernierPointageJour: {
            id: string;
            type: import("@prisma/client").$Enums.TypePointage;
            heureServeur: Date;
            statutValidation: import("@prisma/client").$Enums.StatutValidation;
        } | null;
        id: number;
        matricule: string | null;
        nom: string;
        prenom: string;
        poste: string | null;
        photoUrl: string | null;
    }[]>>;
    pointer(req: AuthedRequest, dto: PointerSurveillantDto, res: Response): Promise<import("../../../common/interfaces/response.interface").SuccessResponse<{
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
        anomalies: import("../anomalies.constants").AnomalieType[];
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
    }>>;
    private locale;
}
