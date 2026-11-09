import { TypePointage } from "@prisma/client";
import {
  isoWeekdayInZone,
  minutesInZone,
  parseHeureMinutes,
} from "../../common/utils/zoned-time.util";

export type HoraireRef = {
  heureDebut: string;
  heureFin: string;
  toleranceMin: number;
  joursTravail: number[];
};

/** Premier pointage du jour = ARRIVEE ; ensuite on alterne. */
export function nextTypeAttendu(
  dernier: TypePointage | null | undefined,
): TypePointage {
  if (!dernier || dernier === TypePointage.DEPART) {
    return TypePointage.ARRIVEE;
  }
  return TypePointage.DEPART;
}

export function isWorkDay(
  date: Date,
  horaire: HoraireRef,
  timeZone: string,
): boolean {
  return horaire.joursTravail.includes(isoWeekdayInZone(date, timeZone));
}

/**
 * Minutes de retard au-delà de la tolérance (0 si à l'heure).
 * Gère un horaire de nuit (début > fin) en ramenant l'écart sur 24 h.
 */
export function minutesLate(
  heureServeur: Date,
  heureDebut: string,
  toleranceMin: number,
  timeZone: string,
): number {
  const actual = minutesInZone(heureServeur, timeZone);
  const expected = parseHeureMinutes(heureDebut);
  let delta = actual - expected;
  if (delta < -12 * 60) delta += 24 * 60;
  return Math.max(0, delta - toleranceMin);
}

/** Retard d'une ARRIVEE par rapport à `heureDebut + toleranceMin`. */
export function isLateArrival(
  heureServeur: Date,
  horaire: HoraireRef,
  timeZone: string,
): boolean {
  return (
    minutesLate(
      heureServeur,
      horaire.heureDebut,
      horaire.toleranceMin,
      timeZone,
    ) > 0
  );
}
