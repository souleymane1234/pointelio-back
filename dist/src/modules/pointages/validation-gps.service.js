"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationGpsService = void 0;
exports.greyZoneMaxM = greyZoneMaxM;
exports.evaluateGps = evaluateGps;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const geo_util_1 = require("../../common/utils/geo.util");
function greyZoneMaxM(rayonM) {
    return rayonM + Math.max(Math.round(rayonM * 0.5), 20);
}
function roundMeters(value) {
    return Math.round(value * 10) / 10;
}
function evaluateGps(input, site) {
    const distanceM = roundMeters((0, geo_util_1.haversineMeters)(input.latitude, input.longitude, site.latitude, site.longitude));
    const greyMax = greyZoneMaxM(site.rayonM);
    const precisionFaible = input.precisionM > site.precisionMaxM;
    let statut;
    let motifStatut;
    if (distanceM <= site.rayonM) {
        if (precisionFaible) {
            statut = client_1.StatutValidation.A_VERIFIER;
            motifStatut = `précision insuffisante (${Math.round(input.precisionM)} m > ${site.precisionMaxM} m), distance ${distanceM} m`;
        }
        else {
            statut = client_1.StatutValidation.VALIDE;
            motifStatut = `dans le rayon (${distanceM} m), précision ${Math.round(input.precisionM)} m`;
        }
    }
    else if (distanceM <= greyMax) {
        statut = client_1.StatutValidation.A_VERIFIER;
        motifStatut = `zone grise : distance ${distanceM} m, précision ${Math.round(input.precisionM)} m`;
    }
    else {
        statut = client_1.StatutValidation.HORS_ZONE;
        motifStatut = `hors zone : distance ${distanceM} m (rayon ${site.rayonM} m)`;
    }
    if (input.mockDetecte && statut === client_1.StatutValidation.VALIDE) {
        statut = client_1.StatutValidation.A_VERIFIER;
        motifStatut = `position simulée détectée, ${motifStatut}`;
    }
    else if (input.mockDetecte) {
        motifStatut = `position simulée détectée, ${motifStatut}`;
    }
    return { distanceM, statut, motifStatut };
}
let ValidationGpsService = class ValidationGpsService {
    evaluate(input, site) {
        return evaluateGps(input, site);
    }
};
exports.ValidationGpsService = ValidationGpsService;
exports.ValidationGpsService = ValidationGpsService = __decorate([
    (0, common_1.Injectable)()
], ValidationGpsService);
//# sourceMappingURL=validation-gps.service.js.map