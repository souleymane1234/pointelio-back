"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const bcrypt = __importStar(require("bcrypt"));
const mariadb_pool_config_1 = require("../src/infra/prisma/mariadb-pool-config");
const connectionString = process.env.DATABASE_URL;
if (!connectionString)
    throw new Error("DATABASE_URL is not set");
const prisma = new client_1.PrismaClient({
    adapter: new adapter_mariadb_1.PrismaMariaDb((0, mariadb_pool_config_1.mariadbPoolConfigFromUrl)(connectionString)),
});
const SIM_PIN = "0000";
const SIM_TAG = "[SIM]";
const SIM_EMPLOYES = [
    { prenom: "Aya", nom: "Kouassi", poste: "Réceptionniste", salaire: 6000 },
    { prenom: "Moussa", nom: "Traoré", poste: "Agent d'entretien", salaire: 4500 },
    { prenom: "Mariam", nom: "Diallo", poste: "Serveuse", salaire: 5000 },
    { prenom: "Koffi", nom: "N'Guessan", poste: "Cuisinier", salaire: 7000 },
    { prenom: "Fatou", nom: "Bamba", poste: "Caissière", salaire: 5500 },
    { prenom: "Ibrahim", nom: "Coulibaly", poste: "Agent de sécurité", salaire: 5000 },
];
function rng(seed) {
    let t = seed >>> 0;
    return () => {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}
function hash(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
function isoDay(date) {
    return date.toISOString().slice(0, 10);
}
function at(day, hhmm, offsetMin) {
    const [h, m] = hhmm.split(":").map(Number);
    return new Date(Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10), h, m + offsetMin, 0));
}
function isoWeekday(day) {
    const d = new Date(`${day}T12:00:00Z`).getUTCDay();
    return d === 0 ? 7 : d;
}
function jitter(value, metres, random) {
    return value + ((random() - 0.5) * 2 * metres) / 111_000;
}
async function findEntreprise(name) {
    const entreprise = await prisma.entreprise.findFirst({
        where: { OR: [{ raisonSociale: name }, { nomCommercial: name }] },
        select: { id: true, raisonSociale: true },
    });
    if (!entreprise)
        throw new Error(`Entreprise « ${name} » introuvable.`);
    return entreprise;
}
async function reset(entrepriseId) {
    const simEmployes = await prisma.utilisateur.findMany({
        where: { entrepriseId, matricule: { startsWith: "SIM-" } },
        select: { id: true },
    });
    const pointages = await prisma.pointage.deleteMany({
        where: { entrepriseId, requestId: { startsWith: "sim-" } },
    });
    const demandes = await prisma.demande.deleteMany({
        where: { entrepriseId, commentaire: { startsWith: SIM_TAG } },
    });
    const employes = await prisma.utilisateur.deleteMany({
        where: { id: { in: simEmployes.map((e) => e.id) } },
    });
    console.log(`  ✓ Supprimés : ${pointages.count} pointages, ${demandes.count} demandes, ${employes.count} employés simulés`);
}
async function ensureEmployes(entrepriseId, siteId) {
    const pinHash = await bcrypt.hash(SIM_PIN, 10);
    for (const [index, employe] of SIM_EMPLOYES.entries()) {
        const n = String(index + 1).padStart(3, "0");
        const matricule = `SIM-${n}`;
        const telephone = `+225079900${String(entrepriseId).padStart(2, "0")}${n.slice(1)}`;
        const existing = await prisma.utilisateur.findFirst({
            where: { entrepriseId, matricule },
            select: { id: true },
        });
        if (existing)
            continue;
        await prisma.utilisateur.create({
            data: {
                entrepriseId,
                siteId,
                matricule,
                nom: employe.nom,
                prenom: employe.prenom,
                telephone,
                passwordHash: pinHash,
                role: client_1.Role.EMPLOYE,
                statut: client_1.StatutCompte.ACTIF,
                poste: employe.poste,
                salaireJournalier: employe.salaire,
                dateEmbauche: new Date("2026-01-05"),
            },
        });
    }
}
async function simulate(name, jours) {
    const entreprise = await findEntreprise(name);
    const site = await prisma.site.findFirst({
        where: { entrepriseId: entreprise.id, actif: true },
        select: { id: true, nom: true, latitude: true, longitude: true, rayonM: true, horairesJours: true },
        orderBy: { id: "asc" },
    });
    if (!site)
        throw new Error("Aucun site actif dans cette entreprise.");
    console.log(`🧪 Simulation — ${entreprise.raisonSociale} · site « ${site.nom} » · ${jours} jours`);
    await reset(entreprise.id);
    await ensureEmployes(entreprise.id, site.id);
    const employes = await prisma.utilisateur.findMany({
        where: { entrepriseId: entreprise.id, role: client_1.Role.EMPLOYE, statut: client_1.StatutCompte.ACTIF, siteId: site.id },
        select: { id: true, prenom: true, nom: true, matricule: true },
        orderBy: { id: "asc" },
    });
    const plages = new Map(site.horairesJours.map((p) => [p.jour, p]));
    const lat = Number(site.latitude);
    const lng = Number(site.longitude);
    const now = new Date();
    const today = isoDay(now);
    const days = Array.from({ length: jours }, (_, i) => {
        const d = new Date(`${today}T12:00:00Z`);
        d.setUTCDate(d.getUTCDate() - (jours - 1 - i));
        return isoDay(d);
    });
    const workdays = days.filter((day) => plages.has(isoWeekday(day)));
    const simules = employes.filter((e) => e.matricule?.startsWith("SIM-"));
    const conge = simules[0] ? { employe: simules[0], days: workdays.slice(2, 5) } : null;
    const maladie = simules[2] ? { employe: simules[2], days: workdays.slice(-4, -3) } : null;
    const autorisation = simules[4] ? { employe: simules[4], day: workdays.at(-6) } : null;
    const demandes = [];
    if (conge?.days.length) {
        demandes.push({
            entrepriseId: entreprise.id,
            employeId: conge.employe.id,
            type: client_1.TypeDemande.CONGE_ANNUEL,
            dateDebut: new Date(`${conge.days[0]}T00:00:00Z`),
            dateFin: new Date(`${conge.days.at(-1)}T00:00:00Z`),
            nbJours: conge.days.length,
            commentaire: `${SIM_TAG} Congé annuel`,
            statut: client_1.StatutDemande.APPROUVEE,
            decideAt: new Date(`${days[0]}T09:00:00Z`),
        });
    }
    if (maladie?.days.length) {
        demandes.push({
            entrepriseId: entreprise.id,
            employeId: maladie.employe.id,
            type: client_1.TypeDemande.MALADIE,
            dateDebut: new Date(`${maladie.days[0]}T00:00:00Z`),
            dateFin: new Date(`${maladie.days[0]}T00:00:00Z`),
            nbJours: 1,
            commentaire: `${SIM_TAG} Fièvre, certificat à fournir`,
            statut: client_1.StatutDemande.EN_ATTENTE,
        });
    }
    if (autorisation?.day) {
        demandes.push({
            entrepriseId: entreprise.id,
            employeId: autorisation.employe.id,
            type: client_1.TypeDemande.AUTORISATION,
            dateDebut: new Date(`${autorisation.day}T00:00:00Z`),
            dateFin: new Date(`${autorisation.day}T00:00:00Z`),
            nbJours: 0.5,
            commentaire: `${SIM_TAG} Rendez-vous administratif`,
            statut: client_1.StatutDemande.REFUSEE,
            decisionMotif: "Période de forte affluence",
            decideAt: new Date(`${autorisation.day}T08:00:00Z`),
        });
    }
    const justified = new Set([
        ...(conge?.days ?? []).map((day) => `${conge?.employe.id}-${day}`),
        ...(maladie?.days ?? []).map((day) => `${maladie?.employe.id}-${day}`),
    ]);
    const pointages = [];
    const stats = { presences: 0, absences: 0, retards: 0, oublisDepart: 0, horsZone: 0, aVerifier: 0 };
    const point = (employeId, day, type, heure, random) => {
        if (heure > now)
            return;
        const roll = random();
        let statut = client_1.StatutValidation.VALIDE;
        let distance = random() * site.rayonM * 0.7;
        let precision = 5 + random() * 15;
        let motif = null;
        if (roll < 0.04) {
            statut = client_1.StatutValidation.HORS_ZONE;
            distance = site.rayonM + 40 + random() * 300;
            motif = `distance ${Math.round(distance)} m, précision ${Math.round(precision)} m`;
            stats.horsZone += 1;
        }
        else if (roll < 0.1) {
            statut = client_1.StatutValidation.A_VERIFIER;
            distance = site.rayonM * (0.8 + random() * 0.4);
            precision = 35 + random() * 15;
            motif = `précision faible (${Math.round(precision)} m)`;
            stats.aVerifier += 1;
        }
        pointages.push({
            entrepriseId: entreprise.id,
            employeId,
            siteId: site.id,
            type,
            methode: client_1.MethodePointage.QR_GPS,
            latitude: jitter(lat, distance, random).toFixed(7),
            longitude: jitter(lng, distance, random).toFixed(7),
            precisionM: Math.round(precision * 10) / 10,
            distanceM: Math.round(distance * 10) / 10,
            statutValidation: statut,
            motifStatut: motif,
            requestId: `sim-${employeId}-${day}-${type}`,
            heureServeur: heure,
            createdAt: heure,
        });
    };
    for (const day of workdays) {
        const plage = plages.get(isoWeekday(day));
        for (const employe of employes) {
            const random = rng(hash(`${employe.id}-${day}`));
            const key = `${employe.id}-${day}`;
            if (justified.has(key) || random() < 0.07) {
                stats.absences += 1;
                continue;
            }
            const late = random() < 0.16;
            const arriveeOffset = late ? 8 + Math.floor(random() * 50) : -20 + Math.floor(random() * 21);
            if (late)
                stats.retards += 1;
            point(employe.id, day, client_1.TypePointage.ARRIVEE, at(day, plage.heureDebut, arriveeOffset), random);
            stats.presences += 1;
            if (random() < 0.06) {
                stats.oublisDepart += 1;
                continue;
            }
            const departOffset = -10 + Math.floor(random() * 55);
            point(employe.id, day, client_1.TypePointage.DEPART, at(day, plage.heureFin, departOffset), random);
        }
    }
    const created = await prisma.pointage.createMany({ data: pointages, skipDuplicates: true });
    if (demandes.length)
        await prisma.demande.createMany({ data: demandes });
    console.log(`  ✓ ${employes.length} employés actifs sur le site (dont ${SIM_EMPLOYES.length} simulés, PIN ${SIM_PIN})`);
    console.log(`  ✓ ${workdays.length} jours ouvrés du ${days[0]} au ${today}`);
    console.log(`  ✓ ${created.count} pointages, ${demandes.length} demandes`);
    console.log(`    présences ${stats.presences} · absences ${stats.absences} · retards ${stats.retards} · oublis de départ ${stats.oublisDepart} · hors zone ${stats.horsZone} · à vérifier ${stats.aVerifier}`);
}
async function main() {
    const args = process.argv.slice(2);
    const name = args.find((arg) => !arg.startsWith("--")) ?? "Free entreprise";
    const joursArg = args.find((arg) => arg.startsWith("--jours="));
    const jours = joursArg ? Math.max(1, Number(joursArg.split("=")[1])) : 14;
    if (args.includes("--reset")) {
        const entreprise = await findEntreprise(name);
        console.log(`🧹 Suppression de la simulation — ${entreprise.raisonSociale}`);
        await reset(entreprise.id);
        return;
    }
    await simulate(name, jours);
}
main()
    .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=simulate-presence.js.map