"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHorairesJours = parseHorairesJours;
exports.horaireDuJour = horaireDuJour;
exports.hasDuplicateJours = hasDuplicateJours;
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
function isJour(value) {
    return (typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 7);
}
function isHeure(value) {
    return typeof value === "string" && HEURE.test(value);
}
function parseHorairesJours(value) {
    if (!Array.isArray(value))
        return [];
    const byJour = new Map();
    for (const raw of value) {
        if (!raw || typeof raw !== "object")
            continue;
        const row = raw;
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
function horaireDuJour(jours, isoWeekday) {
    return jours.find((j) => j.jour === isoWeekday) ?? null;
}
function hasDuplicateJours(jours) {
    const seen = new Set();
    for (const j of jours) {
        if (seen.has(j.jour))
            return true;
        seen.add(j.jour);
    }
    return false;
}
//# sourceMappingURL=site-horaires.util.js.map