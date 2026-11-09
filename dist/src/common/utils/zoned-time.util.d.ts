export declare const DEFAULT_TIMEZONE = "Africa/Abidjan";
export declare function zonedCivilToUtc(year: number, month: number, day: number, hour: number, minute: number, second: number, timeZone: string): Date;
export declare function zonedDayBounds(date: Date, timeZone: string): {
    start: Date;
    end: Date;
};
export declare function minutesInZone(date: Date, timeZone: string): number;
export declare function isoWeekdayInZone(date: Date, timeZone: string): number;
export declare function safeTimeZone(timeZone: string | null | undefined): string;
export declare function parseHeureMinutes(heure: string): number;
