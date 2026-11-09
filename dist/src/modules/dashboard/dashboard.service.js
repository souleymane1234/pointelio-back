"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../common/i18n");
const response_util_1 = require("../../common/utils/response.util");
const zoned_time_util_1 = require("../../common/utils/zoned-time.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const pointage_sequence_util_1 = require("../pointages/pointage-sequence.util");
const site_horaires_util_1 = require("../sites/site-horaires.util");
function civilToday(timeZone) {
    const { start } = (0, zoned_time_util_1.zonedDayBounds)(new Date(), timeZone);
    return start.toISOString().slice(0, 10);
}
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async presence(user, entrepriseId, query) {
        const entreprise = await this.prisma.entreprise.findUnique({
            where: { id: entrepriseId },
            select: { fuseauHoraire: true },
        });
        const tz = (0, zoned_time_util_1.safeTimeZone)(entreprise?.fuseauHoraire);
        const date = query.date ?? civilToday(tz);
        const [y, m, d] = date.split("-").map(Number);
        const start = (0, zoned_time_util_1.zonedCivilToUtc)(y, m, d, 0, 0, 0, tz);
        const end = (0, zoned_time_util_1.zonedCivilToUtc)(...nextDay(y, m, d), 0, 0, 0, tz);
        const weekday = (0, zoned_time_util_1.isoWeekdayInZone)(start, tz);
        let siteId = query.siteId;
        if (user.role === client_1.Role.SURVEILLANT) {
            const actor = await this.prisma.tenant.utilisateur.findFirst({
                where: { id: user.id, entrepriseId },
                select: { siteId: true },
            });
            siteId = actor?.siteId ?? -1;
        }
        const employes = await this.prisma.tenant.utilisateur.findMany({
            where: {
                entrepriseId,
                role: client_1.Role.EMPLOYE,
                statut: client_1.StatutCompte.ACTIF,
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
        const byEmploye = new Map();
        for (const p of pointages) {
            const list = byEmploye.get(p.employeId) ?? [];
            list.push(p);
            byEmploye.set(p.employeId, list);
        }
        const lignes = employes.map((employe) => {
            const site = employe.site;
            const plage = site
                ? (0, site_horaires_util_1.horaireDuJour)((0, site_horaires_util_1.parseHorairesJours)(site.horairesJours), weekday)
                : null;
            const events = byEmploye.get(employe.id) ?? [];
            const arriveeRow = events.find((e) => e.type === client_1.TypePointage.ARRIVEE);
            const departRow = [...events]
                .reverse()
                .find((e) => e.type === client_1.TypePointage.DEPART);
            const retardMinutes = arriveeRow && plage
                ? (0, pointage_sequence_util_1.minutesLate)(arriveeRow.heureServeur, plage.heureDebut, site?.toleranceMin ?? 0, tz)
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
    async presencePeriode(user, entrepriseId, query, locale) {
        const entreprise = await this.prisma.entreprise.findUnique({
            where: { id: entrepriseId },
            select: { fuseauHoraire: true },
        });
        const tz = (0, zoned_time_util_1.safeTimeZone)(entreprise?.fuseauHoraire);
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
        if (user.role === client_1.Role.SURVEILLANT) {
            const actor = await this.prisma.tenant.utilisateur.findFirst({
                where: { id: user.id, entrepriseId },
                select: { siteId: true },
            });
            siteId = actor?.siteId ?? -1;
        }
        const employes = await this.prisma.tenant.utilisateur.findMany({
            where: {
                entrepriseId,
                role: client_1.Role.EMPLOYE,
                statut: client_1.StatutCompte.ACTIF,
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
        const start = (0, zoned_time_util_1.zonedCivilToUtc)(fy, fm, fd, 0, 0, 0, tz);
        const end = (0, zoned_time_util_1.zonedCivilToUtc)(...nextDay(ly, lm, ld), 0, 0, 0, tz);
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
                    statut: client_1.StatutDemande.APPROUVEE,
                    dateDebut: { lte: new Date(`${query.au}T00:00:00Z`) },
                    dateFin: { gte: new Date(`${query.du}T00:00:00Z`) },
                },
                select: { employeId: true, type: true, dateDebut: true, dateFin: true },
            }),
        ]);
        const events = new Map();
        for (const p of pointages) {
            const key = `${p.employeId}|${civilDate(p.heureServeur, tz)}`;
            const entry = events.get(key) ?? { anomalieGps: false };
            if (p.type === client_1.TypePointage.ARRIVEE && !entry.arrivee)
                entry.arrivee = p.heureServeur;
            if (p.type === client_1.TypePointage.DEPART)
                entry.depart = p.heureServeur;
            if (p.statutValidation !== client_1.StatutValidation.VALIDE)
                entry.anomalieGps = true;
            events.set(key, entry);
        }
        const congeDays = new Map();
        for (const c of conges) {
            const from = c.dateDebut.toISOString().slice(0, 10);
            const to = c.dateFin.toISOString().slice(0, 10);
            for (const day of eachDay(from, to))
                congeDays.set(`${c.employeId}|${day}`, c.type);
        }
        const jours = new Map(days.map((day) => [day, { date: day, prevus: 0, presents: 0, retards: 0, masseSalariale: 0 }]));
        const lignes = employes.map((employe) => {
            const horaires = (0, site_horaires_util_1.parseHorairesJours)(employe.site?.horairesJours);
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
            const detail = [];
            for (const day of days) {
                const plage = (0, site_horaires_util_1.horaireDuJour)(horaires, isoWeekdayOf(day));
                const entry = events.get(`${employe.id}|${day}`);
                const conge = congeDays.get(`${employe.id}|${day}`) ?? null;
                const jour = jours.get(day);
                const row = {
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
                    if (jour)
                        jour.prevus += 1;
                }
                if (!entry?.arrivee) {
                    if (plage) {
                        if (conge) {
                            ligne.absencesJustifiees += 1;
                            row.statut = "CONGE";
                        }
                        else {
                            ligne.absences += 1;
                            row.statut = "ABSENT";
                        }
                    }
                    if (withDetail)
                        detail.push(row);
                    continue;
                }
                ligne.joursPresents += 1;
                row.statut = "PRESENT";
                if (jour)
                    jour.presents += 1;
                if (plage) {
                    const late = (0, pointage_sequence_util_1.minutesLate)(entry.arrivee, plage.heureDebut, employe.site?.toleranceMin ?? 0, tz);
                    if (late > 0) {
                        ligne.retards += 1;
                        ligne.retardMinutes += late;
                        row.retardMinutes = late;
                        row.statut = "RETARD";
                        if (jour)
                            jour.retards += 1;
                    }
                }
                if (entry.depart) {
                    ligne.joursPayes += 1;
                    ligne.montant += employe.salaireJournalier ?? 0;
                    row.montant = employe.salaireJournalier ?? 0;
                    if (jour)
                        jour.masseSalariale += employe.salaireJournalier ?? 0;
                }
                else if (day < today) {
                    ligne.oublisDepart += 1;
                    if (row.statut === "PRESENT")
                        row.statut = "SANS_DEPART";
                }
                else if (row.statut === "PRESENT") {
                    row.statut = "EN_POSTE";
                }
                if (withDetail)
                    detail.push(row);
            }
            return withDetail ? { ...ligne, detail } : ligne;
        });
        const sum = (key) => lignes.reduce((total, l) => total + (Number(l[key]) || 0), 0);
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
    invalid(key, locale) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key)], undefined, locale));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
const MAX_PERIODE_JOURS = 62;
function civilDate(date, timeZone) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
}
function eachDay(du, au) {
    const days = [];
    const cursor = new Date(`${du}T12:00:00Z`);
    const last = new Date(`${au}T12:00:00Z`);
    while (cursor <= last) {
        days.push(cursor.toISOString().slice(0, 10));
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return days;
}
function isoWeekdayOf(day) {
    const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
    return weekday === 0 ? 7 : weekday;
}
function nextDay(y, m, d) {
    const next = new Date(Date.UTC(y, m - 1, d + 1));
    return [next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()];
}
//# sourceMappingURL=dashboard.service.js.map