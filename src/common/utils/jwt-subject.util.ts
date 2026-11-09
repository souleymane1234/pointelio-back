/** Convertit le `sub` JWT (texte) en id `Utilisateur`. Null si le claim est invalide. */
export function parseJwtUserId(sub: unknown): number | null {
  const id = typeof sub === "string" ? Number(sub) : Number.NaN;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
