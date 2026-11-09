import type { Locale } from "./locale";
import fr from "./locales/fr.json";
export type MessageKey = keyof typeof fr;
export declare function translate(locale: Locale, key: MessageKey, params?: Record<string, string | number>): string;
export declare const t: typeof translate;
