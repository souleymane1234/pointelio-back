import { MethodePointage, Prisma, StatutValidation, TypePointage } from "@prisma/client";
import { type Locale } from "../../common/i18n";
import type { AuthUser } from "../../common/types/request-context";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import { type AnomalieType } from "./anomalies.constants";
import type { AnomaliesQueryDto, PointagesQueryDto, PointerQrDto } from "./dto/pointage.dto";
import { ValidationGpsService } from "./validation-gps.service";
export type CreatePointageInput = {
    entrepriseId: number;
    acteurId: number;
    employeId: number;
    siteId: number;
    pointeParId: number | null;
    type: TypePointage;
    methode: MethodePointage;
    latitude: number | null;
    longitude: number | null;
    precisionM: number | null;
    distanceM: number | null;
    statutValidation: StatutValidation;
    motifStatut: string | null;
    mockDetecte: boolean;
    requestId: string;
};
export declare class PointagesService {
    private readonly prisma;
    private readonly gps;
    private readonly auditActions;
    constructor(prisma: PrismaService, gps: ValidationGpsService, auditActions: AuditActionsService);
    timeZone(entrepriseId: number): Promise<string>;
    pointerQr(user: AuthUser, entrepriseId: number, dto: PointerQrDto, locale: Locale): Promise<{
        replay: false;
        pointage: {
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
            anomalies: AnomalieType[];
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
        };
    } | {
        replay: true;
        pointage: {
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
            anomalies: AnomalieType[];
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
        };
    }>;
    findAll(user: AuthUser, entrepriseId: number, query: PointagesQueryDto): Promise<{
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
            anomalies: AnomalieType[];
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
    findAnomalies(user: AuthUser, entrepriseId: number, query: AnomaliesQueryDto): Promise<{
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
            anomalies: AnomalieType[];
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
    findOne(user: AuthUser, entrepriseId: number, id: bigint, locale: Locale): Promise<{
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
        anomalies: AnomalieType[];
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
    }>;
    findByRequestId(entrepriseId: number, requestId: string): Promise<{
        id: bigint;
        entrepriseId: number;
        siteId: number;
        createdAt: Date;
        site: {
            id: number;
            nom: string;
            toleranceMin: number | null;
            horairesJours: Prisma.JsonValue;
        };
        latitude: Prisma.Decimal | null;
        longitude: Prisma.Decimal | null;
        employe: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
            salaireJournalier: number | null;
            horaire: {
                toleranceMin: number;
                heureDebut: string;
                heureFin: string;
                joursTravail: Prisma.JsonValue;
            } | null;
        };
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
        pointePar: {
            id: number;
            matricule: string | null;
            nom: string;
            prenom: string;
        } | null;
    } | null>;
    assertSequence(entrepriseId: number, employeId: number, type: TypePointage, locale: Locale): Promise<void>;
    createOrReplay(input: CreatePointageInput): Promise<{
        replay: true;
        pointage: {
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
            anomalies: AnomalieType[];
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
        };
    } | {
        replay: false;
        pointage: {
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
            anomalies: AnomalieType[];
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
        };
    }>;
    requireActifEmploye(entrepriseId: number, employeId: number, siteId: number, locale: Locale): Promise<{
        id: number;
        siteId: number | null;
        role: import("@prisma/client").$Enums.Role;
        statut: import("@prisma/client").$Enums.StatutCompte;
    }>;
    actorSiteId(userId: number, entrepriseId: number, locale: Locale): Promise<number>;
    assertCanRead(user: AuthUser, row: {
        employeId: number;
        siteId: number;
    }): void;
    assertCanReadSite(user: AuthUser, entrepriseId: number, siteId: number): Promise<void>;
    private scopeWhere;
    private findComputedAnomalies;
    private normalizeOne;
    private normalizeMany;
    private journeeFlags;
}
