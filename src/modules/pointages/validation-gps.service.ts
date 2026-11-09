import { Injectable } from "@nestjs/common";
import { StatutValidation } from "@prisma/client";
import { haversineMeters } from "../../common/utils/geo.util";

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

/**
 * Bande au-delà du rayon encore considérée comme zone grise (A_VERIFIER) :
 * 50 % du rayon, au minimum 20 m.
 */
export function greyZoneMaxM(rayonM: number): number {
  return rayonM + Math.max(Math.round(rayonM * 0.5), 20);
}

function roundMeters(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Règles (commentaire Prisma `StatutValidation`) :
 * - VALIDE : dans le rayon, précision acceptable, pas de mock
 * - A_VERIFIER : zone grise, précision trop faible, ou mock GPS
 * - HORS_ZONE : au-delà de la zone grise
 */
export function evaluateGps(input: GpsInput, site: SiteGps): GpsValidation {
  const distanceM = roundMeters(
    haversineMeters(
      input.latitude,
      input.longitude,
      site.latitude,
      site.longitude,
    ),
  );
  const greyMax = greyZoneMaxM(site.rayonM);
  const precisionFaible = input.precisionM > site.precisionMaxM;

  let statut: StatutValidation;
  let motifStatut: string;

  if (distanceM <= site.rayonM) {
    if (precisionFaible) {
      statut = StatutValidation.A_VERIFIER;
      motifStatut = `précision insuffisante (${Math.round(input.precisionM)} m > ${site.precisionMaxM} m), distance ${distanceM} m`;
    } else {
      statut = StatutValidation.VALIDE;
      motifStatut = `dans le rayon (${distanceM} m), précision ${Math.round(input.precisionM)} m`;
    }
  } else if (distanceM <= greyMax) {
    statut = StatutValidation.A_VERIFIER;
    motifStatut = `zone grise : distance ${distanceM} m, précision ${Math.round(input.precisionM)} m`;
  } else {
    statut = StatutValidation.HORS_ZONE;
    motifStatut = `hors zone : distance ${distanceM} m (rayon ${site.rayonM} m)`;
  }

  if (input.mockDetecte && statut === StatutValidation.VALIDE) {
    statut = StatutValidation.A_VERIFIER;
    motifStatut = `position simulée détectée, ${motifStatut}`;
  } else if (input.mockDetecte) {
    motifStatut = `position simulée détectée, ${motifStatut}`;
  }

  return { distanceM, statut, motifStatut };
}

@Injectable()
export class ValidationGpsService {
  evaluate(input: GpsInput, site: SiteGps): GpsValidation {
    return evaluateGps(input, site);
  }
}
