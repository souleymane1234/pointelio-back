import { Prisma } from "@prisma/client";
import { type AnomalieType } from "./anomalies.constants";
import { type HoraireRef } from "./pointage-sequence.util";
export declare const POINTAGE_SELECT: {
    id: true;
    entrepriseId: true;
    employeId: true;
    siteId: true;
    pointeParId: true;
    type: true;
    methode: true;
    latitude: true;
    longitude: true;
    precisionM: true;
    distanceM: true;
    statutValidation: true;
    motifStatut: true;
    mockDetecte: true;
    requestId: true;
    heureServeur: true;
    createdAt: true;
    employe: {
        select: {
            salaireJournalier: true;
            horaire: {
                select: {
                    heureDebut: true;
                    heureFin: true;
                    toleranceMin: true;
                    joursTravail: true;
                };
            };
            id: true;
            nom: true;
            prenom: true;
            matricule: true;
        };
    };
    site: {
        select: {
            id: true;
            nom: true;
            toleranceMin: true;
            horairesJours: true;
        };
    };
    pointePar: {
        select: {
            id: true;
            nom: true;
            prenom: true;
            matricule: true;
        };
    };
};
export type PointageRow = Prisma.PointageGetPayload<{
    select: typeof POINTAGE_SELECT;
}>;
export declare const CORRECTION_SELECT: {
    id: true;
    pointageId: true;
    auteurId: true;
    motif: true;
    avant: true;
    apres: true;
    createdAt: true;
    auteur: {
        select: {
            id: true;
            nom: true;
            prenom: true;
            matricule: true;
        };
    };
};
export type CorrectionRow = Prisma.PointageCorrectionGetPayload<{
    select: typeof CORRECTION_SELECT;
}>;
export type JourneeFlags = {
    hasArrivee: boolean;
    hasDepart: boolean;
};
export declare function resolveHoraireJour(row: Pick<PointageRow, "heureServeur" | "site" | "employe">, timeZone: string): HoraireRef | null;
export declare function snapshotPointage(row: PointageRow): {
    type: import("@prisma/client").$Enums.TypePointage;
    siteId: number;
    heureServeur: string;
    statutValidation: import("@prisma/client").$Enums.StatutValidation;
    motifStatut: string | null;
    latitude: number | null;
    longitude: number | null;
    precisionM: number | null;
    distanceM: number | null;
};
export declare function classifyAnomalies(row: PointageRow, timeZone: string, flags: JourneeFlags, now: Date): AnomalieType[];
export declare function normalizePointage(row: PointageRow, timeZone: string, flags?: JourneeFlags, now?: Date): {
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
export declare function normalizeCorrection(row: CorrectionRow): {
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
};
