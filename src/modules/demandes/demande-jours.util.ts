const CIVIL_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DEFAULT_JOURS_TRAVAIL = [1, 2, 3, 4, 5];
const MAX_SPAN_DAYS = 366;

export type CivilDate = { y: number; m: number; d: number };

export function parseCivilDate(iso: string): CivilDate | null {
  const match = CIVIL_DATE.exec(iso.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (
    probe.getUTCFullYear() !== y ||
    probe.getUTCMonth() + 1 !== m ||
    probe.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

export function formatCivilDate(date: CivilDate): string {
  return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
}

/** Date Prisma `@db.Date` → `YYYY-MM-DD` (composantes UTC). */
export function dateToCivil(value: Date | string): string {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  return formatCivilDate({
    y: value.getUTCFullYear(),
    m: value.getUTCMonth() + 1,
    d: value.getUTCDate(),
  });
}

export function civilToDate(iso: string): Date {
  const parsed = parseCivilDate(iso);
  if (!parsed) {
    throw new Error(`Invalid civil date: ${iso}`);
  }
  return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
}

/** 1 = lundi … 7 = dimanche. */
export function isoWeekdayCivil(date: CivilDate): number {
  const wd = new Date(Date.UTC(date.y, date.m - 1, date.d)).getUTCDay();
  return wd === 0 ? 7 : wd;
}

function addOneDay(date: CivilDate): CivilDate {
  const next = new Date(Date.UTC(date.y, date.m - 1, date.d + 1));
  return {
    y: next.getUTCFullYear(),
    m: next.getUTCMonth() + 1,
    d: next.getUTCDate(),
  };
}

function joursOuverts(joursTravail: number[]): Set<number> {
  const valid = joursTravail.filter((j) => j >= 1 && j <= 7);
  return new Set(valid.length > 0 ? valid : DEFAULT_JOURS_TRAVAIL);
}

/**
 * Nombre de jours ouvrés inclusifs entre deux dates civiles `YYYY-MM-DD`.
 * Sans horaire : lundi–vendredi.
 */
export function countWorkingDays(
  dateDebut: string,
  dateFin: string,
  joursTravail: number[] = DEFAULT_JOURS_TRAVAIL,
): number {
  const start = parseCivilDate(dateDebut);
  const end = parseCivilDate(dateFin);
  if (!start || !end || dateDebut > dateFin) return 0;

  const work = joursOuverts(joursTravail);
  let count = 0;
  let cursor = start;
  for (let i = 0; i < MAX_SPAN_DAYS; i++) {
    if (work.has(isoWeekdayCivil(cursor))) count += 1;
    if (cursor.y === end.y && cursor.m === end.m && cursor.d === end.d) {
      return count;
    }
    cursor = addOneDay(cursor);
  }
  return count;
}

export function spanDays(dateDebut: string, dateFin: string): number {
  const start = parseCivilDate(dateDebut);
  const end = parseCivilDate(dateFin);
  if (!start || !end) return Number.POSITIVE_INFINITY;
  const ms =
    Date.UTC(end.y, end.m - 1, end.d) - Date.UTC(start.y, start.m - 1, start.d);
  return Math.floor(ms / 86_400_000) + 1;
}

export const DEMANDE_MAX_SPAN_DAYS = MAX_SPAN_DAYS;

/** Chevauchement inclusif de deux intervalles `[debut, fin]`. */
export function datesOverlap(
  aDebut: string,
  aFin: string,
  bDebut: string,
  bFin: string,
): boolean {
  return aDebut <= bFin && aFin >= bDebut;
}
