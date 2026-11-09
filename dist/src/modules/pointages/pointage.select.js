"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORRECTION_SELECT = exports.POINTAGE_SELECT = void 0;
exports.resolveHoraireJour = resolveHoraireJour;
exports.snapshotPointage = snapshotPointage;
exports.classifyAnomalies = classifyAnomalies;
exports.normalizePointage = normalizePointage;
exports.normalizeCorrection = normalizeCorrection;
const client_1 = require("@prisma/client");
const zoned_time_util_1 = require("../../common/utils/zoned-time.util");
const site_horaires_util_1 = require("../sites/site-horaires.util");
const anomalies_constants_1 = require("./anomalies.constants");
const pointage_sequence_util_1 = require("./pointage-sequence.util");
const PERSONNE_SELECT = {
    id: true,
    nom: true,
    prenom: true,
    matricule: true,
};
exports.POINTAGE_SELECT = {
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
};
exports.CORRECTION_SELECT = {
    id: true,
    pointageId: true,
    auteurId: true,
    motif: true,
    avant: true,
    apres: true,
    createdAt: true,
    auteur: { select: PERSONNE_SELECT },
};
function joursTravail(value) {
    return Array.isArray(value)
        ? value.filter((j) => typeof j === "number")
        : [];
}
function horaireRef(horaire) {
    if (!horaire)
        return null;
    return {
        heureDebut: horaire.heureDebut,
        heureFin: horaire.heureFin,
        toleranceMin: horaire.toleranceMin,
        joursTravail: joursTravail(horaire.joursTravail),
    };
}
function resolveHoraireJour(row, timeZone) {
    const weekday = (0, zoned_time_util_1.isoWeekdayInZone)(row.heureServeur, timeZone);
    const duJour = (0, site_horaires_util_1.horaireDuJour)((0, site_horaires_util_1.parseHorairesJours)(row.site.horairesJours), weekday);
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
function snapshotPointage(row) {
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
function classifyAnomalies(row, timeZone, flags, now) {
    const result = [];
    if (row.statutValidation === client_1.StatutValidation.HORS_ZONE) {
        result.push(anomalies_constants_1.ANOMALIE.HORS_ZONE);
    }
    else if (row.statutValidation === client_1.StatutValidation.A_VERIFIER) {
        result.push(anomalies_constants_1.ANOMALIE.A_VERIFIER);
    }
    const horaire = resolveHoraireJour(row, timeZone);
    if (row.type === client_1.TypePointage.ARRIVEE &&
        horaire &&
        horaire.joursTravail.includes((0, zoned_time_util_1.isoWeekdayInZone)(row.heureServeur, timeZone)) &&
        (0, pointage_sequence_util_1.isLateArrival)(row.heureServeur, horaire, timeZone)) {
        result.push(anomalies_constants_1.ANOMALIE.RETARD);
    }
    const dayEnd = (0, zoned_time_util_1.zonedDayBounds)(row.heureServeur, timeZone).end;
    if (row.type === client_1.TypePointage.ARRIVEE &&
        !flags.hasDepart &&
        now.getTime() >= dayEnd.getTime()) {
        result.push(anomalies_constants_1.ANOMALIE.OUBLI_DEPART);
    }
    return result;
}
function normalizePointage(row, timeZone, flags = { hasArrivee: true, hasDepart: true }, now = new Date()) {
    const { employe, pointePar, site, ...pointage } = row;
    const { horaire: _horaire, salaireJournalier, ...employePublic } = employe;
    const horaire = resolveHoraireJour(row, timeZone);
    const retardMinutes = row.type === client_1.TypePointage.ARRIVEE && horaire
        ? (0, pointage_sequence_util_1.minutesLate)(row.heureServeur, horaire.heureDebut, horaire.toleranceMin, timeZone)
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
function normalizeCorrection(row) {
    return {
        ...row,
        pointageId: String(row.pointageId),
        avant: row.avant && typeof row.avant === "object" && !Array.isArray(row.avant)
            ? row.avant
            : {},
        apres: row.apres && typeof row.apres === "object" && !Array.isArray(row.apres)
            ? row.apres
            : {},
    };
}
//# sourceMappingURL=pointage.select.js.map