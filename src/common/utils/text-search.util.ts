/** Comparaison textuelle insensible à la casse et aux accents. */
export function foldSearchText(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

/** Vrai si la requête pliée apparaît dans au moins un champ. */
export function textIncludesQuery(
  query: string,
  ...fields: Array<string | null | undefined>
): boolean {
  const q = foldSearchText(query);
  if (!q) return true;
  return fields.some((field) => foldSearchText(field ?? "").includes(q));
}

/** 100 si un champ commence par la requête, 60 s'il la contient, 0 sinon. */
export function textRelevanceScore(
  query: string,
  ...fields: Array<string | null | undefined>
): number {
  const q = foldSearchText(query);
  if (!q) return 1;
  let best = 0;
  for (const field of fields) {
    const hay = foldSearchText(field ?? "");
    if (!hay) continue;
    if (hay.startsWith(q)) best = Math.max(best, 100);
    else if (hay.includes(q)) best = Math.max(best, 60);
    else if (hay.length >= 3 && q.includes(hay)) best = Math.max(best, 40);
  }
  return best;
}
