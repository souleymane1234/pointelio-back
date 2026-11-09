import type { Response } from "express";
import { type AuthedRequest } from "../../common/types/request-context";
import { AnomaliesService } from "./anomalies.service";
import { CorrectionsService } from "./corrections.service";
import { AnomaliesQueryDto, CorrigerPointageDto, PointagesQueryDto, PointerQrDto } from "./dto/pointage.dto";
import { PointagesService } from "./pointages.service";
export declare class PointagesController {
    private readonly pointages;
    private readonly anomalies;
    private readonly corrections;
    constructor(pointages: PointagesService, anomalies: AnomaliesService, corrections: CorrectionsService);
    findAll(req: AuthedRequest, query: PointagesQueryDto): Promise<import("../../common/interfaces/response.interface").PaginatedResponse<{
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
    }>>;
    findAnomalies(req: AuthedRequest, query: AnomaliesQueryDto): Promise<import("../../common/interfaces/response.interface").PaginatedResponse<{
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
    }>>;
    pointerQr(req: AuthedRequest, dto: PointerQrDto, res: Response): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    findOne(req: AuthedRequest, idParam: string): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    listCorrections(req: AuthedRequest, idParam: string): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }[]>>;
    corriger(req: AuthedRequest, idParam: string, dto: CorrigerPointageDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    private locale;
}
