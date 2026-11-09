export type Locale = "fr" | "en";
export declare const SUPPORTED_LOCALES: readonly Locale[];
export declare const DEFAULT_LOCALE: Locale;
export declare function normalizeLocale(header: string | undefined): Locale;
