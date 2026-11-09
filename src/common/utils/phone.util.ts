/** E.164 : indicatif + numéro national, 8 à 15 chiffres au total. */
const E164_MIN_DIGITS = 8;
const E164_MAX_DIGITS = 15;

/** Retire espaces, tirets et points pour correspondre au stockage / recherche. */
export function normalizePhoneInput(raw: string): string {
  return raw.trim().replace(/[\s\-.]/g, "");
}

/**
 * Convertit un numéro international (`+33612345678` ou `0033612345678`) au format E.164.
 * Retourne null si l'indicatif est absent ou si la longueur est invalide.
 */
export function normalizePhoneE164(raw: string): string | null {
  let phone = normalizePhoneInput(raw);
  if (phone.startsWith("00")) phone = `+${phone.slice(2)}`;
  if (!phone.startsWith("+")) return null;

  const digits = phone.slice(1);
  if (!/^[1-9]\d+$/.test(digits)) return null;
  if (digits.length < E164_MIN_DIGITS || digits.length > E164_MAX_DIGITS) {
    return null;
  }
  return `+${digits}`;
}

/**
 * Variantes d'un numéro pour une recherche (avec ou sans `+`).
 * Les termes trop courts sont ignorés pour éviter les faux positifs.
 */
export function phoneSearchContainsTerms(raw: string): string[] {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed || /[a-zA-Z@]/.test(trimmed)) return [];
  const digits = normalizePhoneInput(trimmed).replace(/\D/g, "");
  if (digits.length < E164_MIN_DIGITS) return [];
  return [digits];
}

/**
 * Terme de recherche utilisateur.
 * Un email ou un nom conserve points, @ et espaces.
 * Un numéro est normalisé (espaces, tirets, points retirés).
 */
export function resolveUserSearchTerm(raw: string): string {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return "";
  if (/[a-zA-Z@]/.test(trimmed)) return trimmed;
  return normalizePhoneInput(trimmed);
}
