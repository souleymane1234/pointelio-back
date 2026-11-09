import { TypePointage } from "@prisma/client";
export type HoraireRef = {
    heureDebut: string;
    heureFin: string;
    toleranceMin: number;
    joursTravail: number[];
};
export declare function nextTypeAttendu(dernier: TypePointage | null | undefined): TypePointage;
export declare function isWorkDay(date: Date, horaire: HoraireRef, timeZone: string): boolean;
export declare function minutesLate(heureServeur: Date, heureDebut: string, toleranceMin: number, timeZone: string): number;
export declare function isLateArrival(heureServeur: Date, horaire: HoraireRef, timeZone: string): boolean;
