import { Prisma, StatutValidation, TypePointage } from "@prisma/client";
import {
  isoWeekdayInZone,
  zonedDayBounds,
} from "../../common/utils/zoned-time.util";
import { horaireDuJour, parseHorairesJours } from "../sites/site-horaires.util";
import { ANOMALIE, type AnomalieType } from "./anomalies.constants";
import {
  isLateArrival,
  minutesLate,
  type HoraireRef,
} from "./pointage-sequence.util";

const PERSONNE_SELECT = {
  id: true,
  nom: true,
  prenom: true,
  matricule: true,
} satisfies Prisma.UtilisateurSelect;

export const POINTAGE_SELECT = {
  id: true,
  entrepriseId: true,
  employeId: true,
  siteId: true,
  pointeParId: true,
  type: true,
  methode: true,
  latitude: true,
  longitude: true,
  precisionM: true,
  distanceM: true,
  statutValidation: true,
  motifStatut: true,
  mockDetecte: true,
  requestId: true,
  heureServeur: true,
  createdAt: true,
  employe: {
    select: {
      ...PERSONNE_SELECT,
      salaireJournalier: true,
      horaire: {
        select: {
          heureDebut: true,
          heureFin: true,
          toleranceMin: true,
          joursTravail: true,
        },
      },
    },
  },
  site: {
    select: {
      id: true,
      nom: true,
      toleranceMin: true,
      horairesJours: true,
    },
  },
  pointePar: { select: PERSONNE_SELECT },
} satisfies Prisma.PointageSelect;

export type PointageRow = Prisma.PointageGetPayload<{
  select: typeof POINTAGE_SELECT;
}>;

export const CORRECTION_SELECT = {
  id: true,
  pointageId: true,
  auteurId: true,
  motif: true,
  avant: true,
  apres: true,
  createdAt: true,
  auteur: { select: PERSONNE_SELECT },
} satisfies Prisma.PointageCorrectionSelect;

export type CorrectionRow = Prisma.PointageCorrectionGetPayload<{
  select: typeof CORRECTION_SELECT;
}>;

export type JourneeFlags = {
  hasArrivee: boolean;
  hasDepart: boolean;
};

function joursTravail(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((j): j is number => typeof j === "number")
    : [];
}

function horaireRef(
  horaire: PointageRow["employe"]["horaire"],
): HoraireRef | null {
  if (!horaire) return null;
  return {
    heureDebut: horaire.heureDebut,
    heureFin: horaire.heureFin,
    toleranceMin: horaire.toleranceMin,
    joursTravail: joursTravail(horaire.joursTravail),
  };
}

/** Plage du jour : horaires du site en priorité, sinon horaire de l'employé. */
export function resolveHoraireJour(
  row: Pick<PointageRow, "heureServeur" | "site" | "employe">,
  timeZone: string,
): HoraireRef | null {
  const weekday = isoWeekdayInZone(row.heureServeur, timeZone);
  const duJour = horaireDuJour(
    parseHorairesJours(row.site.horairesJours),
    weekday,
  );
  if (duJour) {
    return {
      heureDebut: duJour.heureDebut,
      heureFin: duJour.heureFin,
      toleranceMin: row.site.toleranceMin ?? 0,
      joursTravail: [weekday],
    };
  }
  return horaireRef(row.employe.horaire);
}

export function snapshotPointage(row: PointageRow) {
  return {
    type: row.type,
    siteId: row.siteId,
    heureServeur: row.heureServeur.toISOString(),
    statutValidation: row.statutValidation,
    motifStatut: row.motifStatut,
    latitude: row.latitude !== null ? Number(row.latitude) : null,
    longitude: row.longitude !== null ? Number(row.longitude) : null,
    precisionM: row.precisionM,
    distanceM: row.distanceM,
  };
}

export function classifyAnomalies(
  row: PointageRow,
  timeZone: string,
  flags: JourneeFlags,
  now: Date,
): AnomalieType[] {
  const result: AnomalieType[] = [];
  if (row.statutValidation === StatutValidation.HORS_ZONE) {
    result.push(ANOMALIE.HORS_ZONE);
  } else if (row.statutValidation === StatutValidation.A_VERIFIER) {
    result.push(ANOMALIE.A_VERIFIER);
  }

  const horaire = resolveHoraireJour(row, timeZone);
  if (
    row.type === TypePointage.ARRIVEE &&
    horaire &&
    horaire.joursTravail.includes(
      isoWeekdayInZone(row.heureServeur, timeZone),
    ) &&
    isLateArrival(row.heureServeur, horaire, timeZone)
  ) {
    result.push(ANOMALIE.RETARD);
  }

  const dayEnd = zonedDayBounds(row.heureServeur, timeZone).end;
  if (
    row.type === TypePointage.ARRIVEE &&
    !flags.hasDepart &&
    now.getTime() >= dayEnd.getTime()
  ) {
    result.push(ANOMALIE.OUBLI_DEPART);
  }

  return result;
}

export function normalizePointage(
  row: PointageRow,
  timeZone: string,
  flags: JourneeFlags = { hasArrivee: true, hasDepart: true },
  now = new Date(),
) {
  const { employe, pointePar, site, ...pointage } = row;
  const { horaire: _horaire, salaireJournalier, ...employePublic } = employe;
  const horaire = resolveHoraireJour(row, timeZone);
  const retardMinutes =
    row.type === TypePointage.ARRIVEE && horaire
      ? minutesLate(
          row.heureServeur,
          horaire.heureDebut,
          horaire.toleranceMin,
          timeZone,
        )
      : null;
  const paieValidee = flags.hasArrivee && flags.hasDepart;
  return {
    ...pointage,
    id: String(row.id),
    latitude: row.latitude !== null ? Number(row.latitude) : null,
    longitude: row.longitude !== null ? Number(row.longitude) : null,
    employe: { ...employePublic, salaireJournalier },
    site: { id: site.id, nom: site.nom },
    pointePar,
    retardMinutes,
    paieValidee,
    montantJour: paieValidee ? (salaireJournalier ?? 0) : 0,
    anomalies: classifyAnomalies(row, timeZone, flags, now),
  };
}

export function normalizeCorrection(row: CorrectionRow) {
  return {
    ...row,
    pointageId: String(row.pointageId),
    avant:
      row.avant && typeof row.avant === "object" && !Array.isArray(row.avant)
        ? (row.avant as Record<string, unknown>)
        : {},
    apres:
      row.apres && typeof row.apres === "object" && !Array.isArray(row.apres)
        ? (row.apres as Record<string, unknown>)
        : {},
  };
}
