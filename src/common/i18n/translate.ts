import type { Locale } from "./locale";
import { DEFAULT_LOCALE } from "./locale";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

/** Clés dérivées du catalogue de référence (fr). */
export type MessageKey = keyof typeof fr;

const CATALOGS: Record<Locale, Record<string, string>> = {
  fr: fr as Record<string, string>,
  en: en as Record<string, string>,
};

function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) =>
    params[name] !== undefined ? String(params[name]) : `{{${name}}}`,
  );
}

/**
 * Traduction générique : clé + locale + paramètres optionnels (`{{nom}}` dans le JSON).
 */
export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  const primary = CATALOGS[locale];
  const fallback = CATALOGS[DEFAULT_LOCALE];
  const template = primary[key] ?? fallback[key] ?? String(key);
  return interpolate(template, params);
}

/** Alias court de `translate`. */
export const t = translate;
