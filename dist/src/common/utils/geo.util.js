"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haversineMeters = haversineMeters;
const EARTH_RADIUS_M = 6_371_000;
function toRad(degrees) {
    return (degrees * Math.PI) / 180;
}
function haversineMeters(lat1, lon1, lat2, lon2) {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}
//# sourceMappingURL=geo.util.js.map