export type Locale = "fr" | "en";

export const SUPPORTED_LOCALES: readonly Locale[] = ["fr", "en"] as const;

export const DEFAULT_LOCALE: Locale = "fr";

/** Normalise le header `language` (ISO / préfixe) vers une locale supportée. */
export function normalizeLocale(header: string | undefined): Locale {
  const l = String(header ?? "")
    .trim()
    .toLowerCase();
  if (l.startsWith("en")) return "en";
  return "fr";
}
