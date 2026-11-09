const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;

export type JourHoraire = {
  jour: number;
  heureDebut: string;
  heureFin: string;
};

function isJour(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 7
  );
}

function isHeure(value: unknown): value is string {
  return typeof value === "string" && HEURE.test(value);
}

/** Normalise le JSON `Site.horairesJours` (ignore les entrées invalides, un jour = une plage). */
export function parseHorairesJours(value: unknown): JourHoraire[] {
  if (!Array.isArray(value)) return [];
  const byJour = new Map<number, JourHoraire>();
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const jour = typeof row.jour === "string" ? Number(row.jour) : row.jour;
    if (!isJour(jour) || !isHeure(row.heureDebut) || !isHeure(row.heureFin)) {
      continue;
    }
    byJour.set(jour, {
      jour,
      heureDebut: row.heureDebut,
      heureFin: row.heureFin,
    });
  }
  return [...byJour.values()].sort((a, b) => a.jour - b.jour);
}

export function horaireDuJour(
  jours: JourHoraire[],
  isoWeekday: number,
): JourHoraire | null {
  return jours.find((j) => j.jour === isoWeekday) ?? null;
}

export function hasDuplicateJours(jours: { jour: number }[]): boolean {
  const seen = new Set<number>();
  for (const j of jours) {
    if (seen.has(j.jour)) return true;
    seen.add(j.jour);
  }
  return false;
}
