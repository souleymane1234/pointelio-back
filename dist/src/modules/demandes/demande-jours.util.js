"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMANDE_MAX_SPAN_DAYS = void 0;
exports.parseCivilDate = parseCivilDate;
exports.formatCivilDate = formatCivilDate;
exports.dateToCivil = dateToCivil;
exports.civilToDate = civilToDate;
exports.isoWeekdayCivil = isoWeekdayCivil;
exports.countWorkingDays = countWorkingDays;
exports.spanDays = spanDays;
exports.datesOverlap = datesOverlap;
const CIVIL_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DEFAULT_JOURS_TRAVAIL = [1, 2, 3, 4, 5];
const MAX_SPAN_DAYS = 366;
function parseCivilDate(iso) {
    const match = CIVIL_DATE.exec(iso.trim());
    if (!match)
        return null;
    const y = Number(match[1]);
    const m = Number(match[2]);
    const d = Number(match[3]);
    const probe = new Date(Date.UTC(y, m - 1, d));
    if (probe.getUTCFullYear() !== y ||
        probe.getUTCMonth() + 1 !== m ||
        probe.getUTCDate() !== d) {
        return null;
    }
    return { y, m, d };
}
function formatCivilDate(date) {
    return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
}
function dateToCivil(value) {
    if (typeof value === "string") {
        return value.slice(0, 10);
    }
    return formatCivilDate({
        y: value.getUTCFullYear(),
        m: value.getUTCMonth() + 1,
        d: value.getUTCDate(),
    });
}
function civilToDate(iso) {
    const parsed = parseCivilDate(iso);
    if (!parsed) {
        throw new Error(`Invalid civil date: ${iso}`);
    }
    return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
}
function isoWeekdayCivil(date) {
    const wd = new Date(Date.UTC(date.y, date.m - 1, date.d)).getUTCDay();
    return wd === 0 ? 7 : wd;
}
function addOneDay(date) {
    const next = new Date(Date.UTC(date.y, date.m - 1, date.d + 1));
    return {
        y: next.getUTCFullYear(),
        m: next.getUTCMonth() + 1,
        d: next.getUTCDate(),
    };
}
function joursOuverts(joursTravail) {
    const valid = joursTravail.filter((j) => j >= 1 && j <= 7);
    return new Set(valid.length > 0 ? valid : DEFAULT_JOURS_TRAVAIL);
}
function countWorkingDays(dateDebut, dateFin, joursTravail = DEFAULT_JOURS_TRAVAIL) {
    const start = parseCivilDate(dateDebut);
    const end = parseCivilDate(dateFin);
    if (!start || !end || dateDebut > dateFin)
        return 0;
    const work = joursOuverts(joursTravail);
    let count = 0;
    let cursor = start;
    for (let i = 0; i < MAX_SPAN_DAYS; i++) {
        if (work.has(isoWeekdayCivil(cursor)))
            count += 1;
        if (cursor.y === end.y && cursor.m === end.m && cursor.d === end.d) {
            return count;
        }
        cursor = addOneDay(cursor);
    }
    return count;
}
function spanDays(dateDebut, dateFin) {
    const start = parseCivilDate(dateDebut);
    const end = parseCivilDate(dateFin);
    if (!start || !end)
        return Number.POSITIVE_INFINITY;
    const ms = Date.UTC(end.y, end.m - 1, end.d) - Date.UTC(start.y, start.m - 1, start.d);
    return Math.floor(ms / 86_400_000) + 1;
}
exports.DEMANDE_MAX_SPAN_DAYS = MAX_SPAN_DAYS;
function datesOverlap(aDebut, aFin, bDebut, bFin) {
    return aDebut <= bFin && aFin >= bDebut;
}
//# sourceMappingURL=demande-jours.util.js.map