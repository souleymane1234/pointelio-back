/** Fuseau par défaut des entreprises Pointelio (pas d'heure d'été). */
export const DEFAULT_TIMEZONE = "Africa/Abidjan";

const WEEKDAY_ISO: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

type TzParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  weekday: string;
};

function tzParts(date: Date, timeZone: string): TzParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  });
  const out: Partial<TzParts> = {};
  for (const part of fmt.formatToParts(date)) {
    if (
      part.type === "year" ||
      part.type === "month" ||
      part.type === "day" ||
      part.type === "hour" ||
      part.type === "minute" ||
      part.type === "second" ||
      part.type === "weekday"
    ) {
      out[part.type] = part.value;
    }
  }
  return {
    year: out.year ?? "",
    month: out.month ?? "",
    day: out.day ?? "",
    hour: out.hour ?? "",
    minute: out.minute ?? "",
    second: out.second ?? "",
    weekday: out.weekday ?? "",
  };
}

/**
 * Instant UTC correspondant à une date/heure civile dans `timeZone`.
 * Deux itérations suffisent (y compris au changement d'heure).
 */
export function zonedCivilToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
): Date {
  const target = Date.UTC(year, month - 1, day, hour, minute, second);
  let date = new Date(target);
  for (let i = 0; i < 3; i++) {
    const p = tzParts(date, timeZone);
    const actual = Date.UTC(
      Number(p.year),
      Number(p.month) - 1,
      Number(p.day),
      Number(p.hour),
      Number(p.minute),
      Number(p.second),
    );
    date = new Date(date.getTime() + (target - actual));
  }
  return date;
}

function nextCivilDate(
  year: number,
  month: number,
  day: number,
): [number, number, number] {
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return [next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()];
}

/** Minuit (inclus) → minuit suivant (exclu) du jour civil de `date` dans `timeZone`. */
export function zonedDayBounds(
  date: Date,
  timeZone: string,
): { start: Date; end: Date } {
  const p = tzParts(date, timeZone);
  const y = Number(p.year);
  const m = Number(p.month);
  const d = Number(p.day);
  const start = zonedCivilToUtc(y, m, d, 0, 0, 0, timeZone);
  const [ny, nm, nd] = nextCivilDate(y, m, d);
  const end = zonedCivilToUtc(ny, nm, nd, 0, 0, 0, timeZone);
  return { start, end };
}

/** Minutes écoulées depuis minuit civil (0–1439). */
export function minutesInZone(date: Date, timeZone: string): number {
  const p = tzParts(date, timeZone);
  return Number(p.hour) * 60 + Number(p.minute);
}

/** 1 = lundi … 7 = dimanche (ISO), dans `timeZone`. */
export function isoWeekdayInZone(date: Date, timeZone: string): number {
  const weekday = tzParts(date, timeZone).weekday;
  return WEEKDAY_ISO[weekday] ?? 1;
}

export function safeTimeZone(timeZone: string | null | undefined): string {
  const candidate = timeZone?.trim() || DEFAULT_TIMEZONE;
  try {
    Intl.DateTimeFormat("en-US", { timeZone: candidate }).format(new Date());
    return candidate;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

/** Parse `"08:00"` → minutes depuis minuit. */
export function parseHeureMinutes(heure: string): number {
  const [h, m] = heure.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}
