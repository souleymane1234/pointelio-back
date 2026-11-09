"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextTypeAttendu = nextTypeAttendu;
exports.isWorkDay = isWorkDay;
exports.minutesLate = minutesLate;
exports.isLateArrival = isLateArrival;
const client_1 = require("@prisma/client");
const zoned_time_util_1 = require("../../common/utils/zoned-time.util");
function nextTypeAttendu(dernier) {
    if (!dernier || dernier === client_1.TypePointage.DEPART) {
        return client_1.TypePointage.ARRIVEE;
    }
    return client_1.TypePointage.DEPART;
}
function isWorkDay(date, horaire, timeZone) {
    return horaire.joursTravail.includes((0, zoned_time_util_1.isoWeekdayInZone)(date, timeZone));
}
function minutesLate(heureServeur, heureDebut, toleranceMin, timeZone) {
    const actual = (0, zoned_time_util_1.minutesInZone)(heureServeur, timeZone);
    const expected = (0, zoned_time_util_1.parseHeureMinutes)(heureDebut);
    let delta = actual - expected;
    if (delta < -12 * 60)
        delta += 24 * 60;
    return Math.max(0, delta - toleranceMin);
}
function isLateArrival(heureServeur, horaire, timeZone) {
    return (minutesLate(heureServeur, horaire.heureDebut, horaire.toleranceMin, timeZone) > 0);
}
//# sourceMappingURL=pointage-sequence.util.js.map