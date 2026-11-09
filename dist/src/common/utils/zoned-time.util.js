"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TIMEZONE = void 0;
exports.zonedCivilToUtc = zonedCivilToUtc;
exports.zonedDayBounds = zonedDayBounds;
exports.minutesInZone = minutesInZone;
exports.isoWeekdayInZone = isoWeekdayInZone;
exports.safeTimeZone = safeTimeZone;
exports.parseHeureMinutes = parseHeureMinutes;
exports.DEFAULT_TIMEZONE = "Africa/Abidjan";
const WEEKDAY_ISO = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
};
function tzParts(date, timeZone) {
    const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "short",
        hourCycle: "h23",
    });
    const out = {};
    for (const part of fmt.formatToParts(date)) {
        if (part.type === "year" ||
            part.type === "month" ||
            part.type === "day" ||
            part.type === "hour" ||
            part.type === "minute" ||
            part.type === "second" ||
            part.type === "weekday") {
            out[part.type] = part.value;
        }
    }
    return {
        year: out.year ?? "",
        month: out.month ?? "",
        day: out.day ?? "",
        hour: out.hour ?? "",
        minute: out.minute ?? "",
        second: out.second ?? "",
        weekday: out.weekday ?? "",
    };
}
function zonedCivilToUtc(year, month, day, hour, minute, second, timeZone) {
    const target = Date.UTC(year, month - 1, day, hour, minute, second);
    let date = new Date(target);
    for (let i = 0; i < 3; i++) {
        const p = tzParts(date, timeZone);
        const actual = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
        date = new Date(date.getTime() + (target - actual));
    }
    return date;
}
function nextCivilDate(year, month, day) {
    const next = new Date(Date.UTC(year, month - 1, day + 1));
    return [next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()];
}
function zonedDayBounds(date, timeZone) {
    const p = tzParts(date, timeZone);
    const y = Number(p.year);
    const m = Number(p.month);
    const d = Number(p.day);
    const start = zonedCivilToUtc(y, m, d, 0, 0, 0, timeZone);
    const [ny, nm, nd] = nextCivilDate(y, m, d);
    const end = zonedCivilToUtc(ny, nm, nd, 0, 0, 0, timeZone);
    return { start, end };
}
function minutesInZone(date, timeZone) {
    const p = tzParts(date, timeZone);
    return Number(p.hour) * 60 + Number(p.minute);
}
function isoWeekdayInZone(date, timeZone) {
    const weekday = tzParts(date, timeZone).weekday;
    return WEEKDAY_ISO[weekday] ?? 1;
}
function safeTimeZone(timeZone) {
    const candidate = timeZone?.trim() || exports.DEFAULT_TIMEZONE;
    try {
        Intl.DateTimeFormat("en-US", { timeZone: candidate }).format(new Date());
        return candidate;
    }
    catch {
        return exports.DEFAULT_TIMEZONE;
    }
}
function parseHeureMinutes(heure) {
    const [h, m] = heure.split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m))
        return 0;
    return h * 60 + m;
}
//# sourceMappingURL=zoned-time.util.js.map