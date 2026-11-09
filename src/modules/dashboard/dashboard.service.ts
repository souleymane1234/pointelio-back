import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import {
  Role,
  StatutCompte,
  StatutDemande,
  StatutValidation,
  TypeDemande,
  TypePointage,
} from "@prisma/client";
import { translate, type Locale } from "../../common/i18n";
import type { MessageKey } from "../../common/i18n/translate";
import type { AuthUser } from "../../common/types/request-context";
import { validationErrorResponse } from "../../common/utils/response.util";
import {
  isoWeekdayInZone,
  safeTimeZone,
  zonedCivilToUtc,
  zonedDayBounds,
} from "../../common/utils/zoned-time.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { minutesLate } from "../pointages/pointage-sequence.util";
import { horaireDuJour, parseHorairesJours } from "../sites/site-horaires.util";
import type { PresencePeriodeQueryDto, PresenceQueryDto } from "./dto/presence-query.dto";

function civilToday(timeZone: string): string {
  const { start } = zonedDayBounds(new Date(), timeZone);
  return start.toISOString().slice(0, 10);
}

/** Présence et paie du jour : une journée est payée si arrivée + départ. */
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async presence(
    user: AuthUser,
    entrepriseId: number,
    query: PresenceQueryDto,
  ) {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { fuseauHoraire: true },
    });
    const tz = safeTimeZone(entreprise?.fuseauHoraire);
    const date = query.date ?? civilToday(tz);
    const [y, m, d] = date.split("-").map(Number);
    const start = zonedCivilToUtc(y, m, d, 0, 0, 0, tz);
    const end = zonedCivilToUtc(...nextDay(y, m, d), 0, 0, 0, tz);
    const weekday = isoWeekdayInZone(start, tz);

    let siteId = query.siteId;
    if (user.role === Role.SURVEILLANT) {
      const actor = await this.prisma.tenant.utilisateur.findFirst({
        where: { id: user.id, entrepriseId },
        select: { siteId: true },
      });
      siteId = actor?.siteId ?? -1;
    }

    const employes = await this.prisma.tenant.utilisateur.findMany({
      where: {
        entrepriseId,
        role: Role.EMPLOYE,
        statut: StatutCompte.ACTIF,
        ...(siteId ? { siteId } : { siteId: { not: null } }),
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        matricule: true,
        salaireJournalier: true,
        siteId: true,
        site: {
          select: {
            id: true,
            nom: true,
            toleranceMin: true,
            horairesJours: true,
          },
        },
      },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    });

    const pointages = await this.prisma.tenant.pointage.findMany({
      where: {
        entrepriseId,
        employeId: { in: employes.map((e) => e.id) },
        heureServeur: { gte: start, lt: end },
      },
      select: {
        id: true,
        employeId: true,
        type: true,
        heureServeur: true,
        statutValidation: true,
      },
      orderBy: { heureServeur: "asc" },
    });

    const byEmploye = new Map<number, typeof pointages>();
    for (const p of pointages) {
      const list = byEmploye.get(p.employeId) ?? [];
      list.push(p);
      byEmploye.set(p.employeId, list);
    }

    const lignes = employes.map((employe) => {
      const site = employe.site;
      const plage = site
        ? horaireDuJour(parseHorairesJours(site.horairesJours), weekday)
        : null;
      const events = byEmploye.get(employe.id) ?? [];
      const arriveeRow = events.find((e) => e.type === TypePointage.ARRIVEE);
      const departRow = [...events]
        .reverse()
        .find((e) => e.type === TypePointage.DEPART);
      const retardMinutes =
        arriveeRow && plage
          ? minutesLate(
              arriveeRow.heureServeur,
              plage.heureDebut,
              site?.toleranceMin ?? 0,
              tz,
            )
          : null;
      const enRetard = (retardMinutes ?? 0) > 0;
      const paieValidee = Boolean(arriveeRow && departRow);
      const salaire = employe.salaireJournalier;
      return {
        employeId: employe.id,
        nom: employe.nom,
        prenom: employe.prenom,
        matricule: employe.matricule,
        siteId: site?.id ?? employe.siteId ?? 0,
        siteNom: site?.nom ?? "",
        jourOuvre: Boolean(plage),
        heureDebut: plage?.heureDebut ?? null,
        heureFin: plage?.heureFin ?? null,
        toleranceMin: site?.toleranceMin ?? null,
        arrivee: arriveeRow
          ? {
              id: String(arriveeRow.id),
              type: arriveeRow.type,
              heureServeur: arriveeRow.heureServeur,
              statutValidation: arriveeRow.statutValidation,
              retardMinutes,
            }
          : null,
        depart: departRow
          ? {
              id: String(departRow.id),
              type: departRow.type,
              heureServeur: departRow.heureServeur,
              statutValidation: departRow.statutValidation,
              retardMinutes: null,
            }
          : null,
        enRetard,
        paieValidee,
        salaireJournalier: salaire,
        montantJour: paieValidee ? (salaire ?? 0) : 0,
      };
    });

    return {
      date,
      effectif: lignes.length,
      presents: lignes.filter((l) => l.arrivee).length,
      retards: lignes.filter((l) => l.enRetard).length,
      paiesValidees: lignes.filter((l) => l.paieValidee).length,
      masseSalarialeJour: lignes.reduce((sum, l) => sum + l.montantJour, 0),
      employes: lignes,
    };
  }

  /**
   * Cumul par employé sur une période (semaine, mois…). Mêmes règles que la
   * présence du jour ; les jours à venir sont ignorés et un congé approuvé
   * rend l'absence justifiée.
   */
  async presencePeriode(
    user: AuthUser,
    entrepriseId: number,
    query: PresencePeriodeQueryDto,
    locale: Locale,
  ) {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { fuseauHoraire: true },
    });
    const tz = safeTimeZone(entreprise?.fuseauHoraire);
    const today = civilToday(tz);

    if (query.du > query.au) {
      throw this.invalid("presencePeriodeInvalide", locale);
    }
    const allDays = eachDay(query.du, query.au);
    if (allDays.length > MAX_PERIODE_JOURS) {
      throw this.invalid("presencePeriodeTropLongue", locale);
    }
    const days = allDays.filter((day) => day <= today);

    let siteId = query.siteId;
    if (user.role === Role.SURVEILLANT) {
      const actor = await this.prisma.tenant.utilisateur.findFirst({
        where: { id: user.id, entrepriseId },
        select: { siteId: true },
      });
      siteId = actor?.siteId ?? -1;
    }

    const employes = await this.prisma.tenant.utilisateur.findMany({
      where: {
        entrepriseId,
        role: Role.EMPLOYE,
        statut: StatutCompte.ACTIF,
        ...(siteId ? { siteId } : { siteId: { not: null } }),
        ...(query.employeId ? { id: query.employeId } : {}),
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        matricule: true,
        salaireJournalier: true,
        siteId: true,
        site: {
          select: { id: true, nom: true, toleranceMin: true, horairesJours: true },
        },
      },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    });
    const withDetail = Boolean(query.employeId);
    const ids = employes.map((e) => e.id);

    const [fy, fm, fd] = query.du.split("-").map(Number);
    const [ly, lm, ld] = query.au.split("-").map(Number);
    const start = zonedCivilToUtc(fy, fm, fd, 0, 0, 0, tz);
    const end = zonedCivilToUtc(...nextDay(ly, lm, ld), 0, 0, 0, tz);

    const [pointages, conges] = await Promise.all([
      this.prisma.tenant.pointage.findMany({
        where: {
          entrepriseId,
          employeId: { in: ids },
          heureServeur: { gte: start, lt: end },
        },
        select: { employeId: true, type: true, heureServeur: true, statutValidation: true },
        orderBy: { heureServeur: "asc" },
      }),
      this.prisma.tenant.demande.findMany({
        where: {
          entrepriseId,
          employeId: { in: ids },
          statut: StatutDemande.APPROUVEE,
          dateDebut: { lte: new Date(`${query.au}T00:00:00Z`) },
          dateFin: { gte: new Date(`${query.du}T00:00:00Z`) },
        },
        select: { employeId: true, type: true, dateDebut: true, dateFin: true },
      }),
    ]);

    const events = new Map<
      string,
      { arrivee?: Date; depart?: Date; anomalieGps: boolean }
    >();
    for (const p of pointages) {
      const key = `${p.employeId}|${civilDate(p.heureServeur, tz)}`;
      const entry = events.get(key) ?? { anomalieGps: false };
      if (p.type === TypePointage.ARRIVEE && !entry.arrivee) entry.arrivee = p.heureServeur;
      if (p.type === TypePointage.DEPART) entry.depart = p.heureServeur;
      if (p.statutValidation !== StatutValidation.VALIDE) entry.anomalieGps = true;
      events.set(key, entry);
    }

    const congeDays = new Map<string, TypeDemande>();
    for (const c of conges) {
      const from = c.dateDebut.toISOString().slice(0, 10);
      const to = c.dateFin.toISOString().slice(0, 10);
      for (const day of eachDay(from, to)) congeDays.set(`${c.employeId}|${day}`, c.type);
    }

    const jours = new Map(
      days.map((day) => [day, { date: day, prevus: 0, presents: 0, retards: 0, masseSalariale: 0 }]),
    );

    const lignes = employes.map((employe) => {
      const horaires = parseHorairesJours(employe.site?.horairesJours);
      const ligne = {
        employeId: employe.id,
        nom: employe.nom,
        prenom: employe.prenom,
        matricule: employe.matricule,
        siteId: employe.site?.id ?? employe.siteId ?? 0,
        siteNom: employe.site?.nom ?? "",
        salaireJournalier: employe.salaireJournalier,
        joursOuvres: 0,
        joursPresents: 0,
        absences: 0,
        absencesJustifiees: 0,
        retards: 0,
        retardMinutes: 0,
        oublisDepart: 0,
        joursPayes: 0,
        montant: 0,
      };
      const detail: PresenceJourDetail[] = [];

      for (const day of days) {
        const plage = horaireDuJour(horaires, isoWeekdayOf(day));
        const entry = events.get(`${employe.id}|${day}`);
        const conge = congeDays.get(`${employe.id}|${day}`) ?? null;
        const jour = jours.get(day);
        const row: PresenceJourDetail = {
          date: day,
          jourOuvre: Boolean(plage),
          heureDebut: plage?.heureDebut ?? null,
          heureFin: plage?.heureFin ?? null,
          arrivee: entry?.arrivee ?? null,
          depart: entry?.depart ?? null,
          retardMinutes: 0,
          anomalieGps: entry?.anomalieGps ?? false,
          conge,
          statut: "REPOS",
          montant: 0,
        };
        if (plage) {
          ligne.joursOuvres += 1;
          if (jour) jour.prevus += 1;
        }

        if (!entry?.arrivee) {
          if (plage) {
            if (conge) {
              ligne.absencesJustifiees += 1;
              row.statut = "CONGE";
            } else {
              ligne.absences += 1;
              row.statut = "ABSENT";
            }
          }
          if (withDetail) detail.push(row);
          continue;
        }

        ligne.joursPresents += 1;
        row.statut = "PRESENT";
        if (jour) jour.presents += 1;
        if (plage) {
          const late = minutesLate(entry.arrivee, plage.heureDebut, employe.site?.toleranceMin ?? 0, tz);
          if (late > 0) {
            ligne.retards += 1;
            ligne.retardMinutes += late;
            row.retardMinutes = late;
            row.statut = "RETARD";
            if (jour) jour.retards += 1;
          }
        }
        if (entry.depart) {
          ligne.joursPayes += 1;
          ligne.montant += employe.salaireJournalier ?? 0;
          row.montant = employe.salaireJournalier ?? 0;
          if (jour) jour.masseSalariale += employe.salaireJournalier ?? 0;
        } else if (day < today) {
          ligne.oublisDepart += 1;
          if (row.statut === "PRESENT") row.statut = "SANS_DEPART";
        } else if (row.statut === "PRESENT") {
          row.statut = "EN_POSTE";
        }
        if (withDetail) detail.push(row);
      }
      return withDetail ? { ...ligne, detail } : ligne;
    });

    const sum = (key: keyof (typeof lignes)[number]) =>
      lignes.reduce((total, l) => total + (Number(l[key]) || 0), 0);
    const joursOuvres = sum("joursOuvres");

    return {
      du: query.du,
      au: query.au,
      joursCalcules: days.length,
      effectif: lignes.length,
      totaux: {
        joursOuvres,
        joursPresents: sum("joursPresents"),
        absences: sum("absences"),
        absencesJustifiees: sum("absencesJustifiees"),
        retards: sum("retards"),
        oublisDepart: sum("oublisDepart"),
        joursPayes: sum("joursPayes"),
        masseSalariale: sum("montant"),
        tauxPresence: joursOuvres ? Math.round((sum("joursPresents") / joursOuvres) * 1000) / 10 : 0,
      },
      jours: [...jours.values()],
      employes: lignes,
    };
  }

  private invalid(key: MessageKey, locale: Locale) {
    return new UnprocessableEntityException(
      validationErrorResponse([translate(locale, key)], undefined, locale),
    );
  }
}

const MAX_PERIODE_JOURS = 62;

type PresenceJourDetail = {
  date: string;
  jourOuvre: boolean;
  heureDebut: string | null;
  heureFin: string | null;
  arrivee: Date | null;
  depart: Date | null;
  retardMinutes: number;
  anomalieGps: boolean;
  conge: TypeDemande | null;
  statut: "REPOS" | "ABSENT" | "CONGE" | "PRESENT" | "RETARD" | "SANS_DEPART" | "EN_POSTE";
  montant: number;
};

function civilDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function eachDay(du: string, au: string): string[] {
  const days: string[] = [];
  const cursor = new Date(`${du}T12:00:00Z`);
  const last = new Date(`${au}T12:00:00Z`);
  while (cursor <= last) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

function isoWeekdayOf(day: string): number {
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

function nextDay(y: number, m: number, d: number): [number, number, number] {
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return [next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()];
}
