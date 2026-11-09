/** Types d'anomalie calculés (le GPS est aussi dans `Pointage.statutValidation`). */
export const ANOMALIE = {
  HORS_ZONE: "HORS_ZONE",
  A_VERIFIER: "A_VERIFIER",
  RETARD: "RETARD",
  OUBLI_DEPART: "OUBLI_DEPART",
} as const;

export type AnomalieType = (typeof ANOMALIE)[keyof typeof ANOMALIE];

export const ANOMALIE_VALUES: readonly AnomalieType[] = Object.values(ANOMALIE);
