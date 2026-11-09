import { StatutValidation } from "@prisma/client";
import { evaluateGps, greyZoneMaxM } from "./validation-gps.service";

const site = {
  latitude: 5.3197,
  longitude: -4.0168,
  rayonM: 30,
  precisionMaxM: 50,
};

function atMetersNorth(meters: number) {
  return {
    latitude: site.latitude + meters / 111_320,
    longitude: site.longitude,
    precisionM: 10,
    mockDetecte: false,
  };
}

describe("greyZoneMaxM", () => {
  it("ajoute au moins 20 m, ou 50 % du rayon", () => {
    expect(greyZoneMaxM(30)).toBe(50);
    expect(greyZoneMaxM(80)).toBe(120);
  });
});

describe("evaluateGps", () => {
  it("VALIDE dans le rayon avec une bonne précision", () => {
    const result = evaluateGps(atMetersNorth(12), site);
    expect(result.statut).toBe(StatutValidation.VALIDE);
    expect(result.distanceM).toBeGreaterThan(11);
    expect(result.distanceM).toBeLessThan(13);
    expect(result.motifStatut).toMatch(/dans le rayon/);
  });

  it("A_VERIFIER si la précision dépasse precisionMaxM", () => {
    const result = evaluateGps({ ...atMetersNorth(8), precisionM: 80 }, site);
    expect(result.statut).toBe(StatutValidation.A_VERIFIER);
    expect(result.motifStatut).toMatch(/précision insuffisante/);
  });

  it("A_VERIFIER en zone grise (juste hors rayon)", () => {
    const result = evaluateGps(atMetersNorth(42), site);
    expect(result.statut).toBe(StatutValidation.A_VERIFIER);
    expect(result.motifStatut).toMatch(/zone grise/);
  });

  it("HORS_ZONE au-delà de la zone grise", () => {
    const result = evaluateGps(atMetersNorth(120), site);
    expect(result.statut).toBe(StatutValidation.HORS_ZONE);
    expect(result.motifStatut).toMatch(/hors zone/);
  });

  it("un mock GPS n'est jamais VALIDE", () => {
    const result = evaluateGps(
      { ...atMetersNorth(5), mockDetecte: true },
      site,
    );
    expect(result.statut).toBe(StatutValidation.A_VERIFIER);
    expect(result.motifStatut).toMatch(/simulée/);
  });

  it("conserve HORS_ZONE même en cas de mock", () => {
    const result = evaluateGps(
      { ...atMetersNorth(200), mockDetecte: true },
      site,
    );
    expect(result.statut).toBe(StatutValidation.HORS_ZONE);
    expect(result.motifStatut).toMatch(/simulée/);
  });
});
