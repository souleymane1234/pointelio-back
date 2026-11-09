import { StatutValidation } from "@prisma/client";
export type GpsInput = {
    latitude: number;
    longitude: number;
    precisionM: number;
    mockDetecte: boolean;
};
export type SiteGps = {
    latitude: number;
    longitude: number;
    rayonM: number;
    precisionMaxM: number;
};
export type GpsValidation = {
    distanceM: number;
    statut: StatutValidation;
    motifStatut: string;
};
export declare function greyZoneMaxM(rayonM: number): number;
export declare function evaluateGps(input: GpsInput, site: SiteGps): GpsValidation;
export declare class ValidationGpsService {
    evaluate(input: GpsInput, site: SiteGps): GpsValidation;
}
