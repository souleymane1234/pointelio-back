export type CivilDate = {
    y: number;
    m: number;
    d: number;
};
export declare function parseCivilDate(iso: string): CivilDate | null;
export declare function formatCivilDate(date: CivilDate): string;
export declare function dateToCivil(value: Date | string): string;
export declare function civilToDate(iso: string): Date;
export declare function isoWeekdayCivil(date: CivilDate): number;
export declare function countWorkingDays(dateDebut: string, dateFin: string, joursTravail?: number[]): number;
export declare function spanDays(dateDebut: string, dateFin: string): number;
export declare const DEMANDE_MAX_SPAN_DAYS = 366;
export declare function datesOverlap(aDebut: string, aFin: string, bDebut: string, bFin: string): boolean;
