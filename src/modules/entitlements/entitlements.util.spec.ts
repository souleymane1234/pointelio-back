import { StatutEntreprise } from "@prisma/client";
import { PACK_MODULES } from "../../common/constants/pack-modules.constants";
import { isAbonnementBloque } from "../../common/utils/abonnement.util";
import { computeEntitlements, withinLimit } from "./entitlements.util";

const pack = {
  id: 1,
  code: "STARTER",
  nom: "Starter",
  maxEmployes: 10,
  maxSites: 3,
  modules: [PACK_MODULES.QR, PACK_MODULES.GPS, "INCONNU"],
};

const entreprise = {
  id: 7,
  statut: StatutEntreprise.ACTIF,
  dateEcheance: null,
  maxSitesOverride: null,
  maxEmployesOverride: null,
  modulesOverride: null,
  pack,
};

describe("computeEntitlements", () => {
  it("reprend le pack et ignore les modules inconnus", () => {
    const result = computeEntitlements(entreprise);
    expect(result.modules).toEqual([PACK_MODULES.QR, PACK_MODULES.GPS]);
    expect(result.limites.maxEmployes).toBe(10);
  });

  it("limite à un site sans le module MULTI_SITES", () => {
    expect(computeEntitlements(entreprise).limites.maxSites).toBe(1);
  });

  it("applique les surcharges de l'entreprise en priorité", () => {
    const result = computeEntitlements({
      ...entreprise,
      maxEmployesOverride: 25,
      maxSitesOverride: 5,
      modulesOverride: [PACK_MODULES.MULTI_SITES],
    });
    expect(result.limites).toEqual({ maxEmployes: 25, maxSites: 5 });
    expect(result.modules).toEqual([PACK_MODULES.MULTI_SITES]);
  });

  it("garde l'illimité (null) avec MULTI_SITES", () => {
    const result = computeEntitlements({
      ...entreprise,
      pack: {
        ...pack,
        maxSites: null,
        maxEmployes: null,
        modules: [PACK_MODULES.MULTI_SITES],
      },
    });
    expect(result.limites).toEqual({ maxEmployes: null, maxSites: null });
  });
});

describe("withinLimit", () => {
  it("refuse le 11e employé d'un pack à 10", () => {
    expect(withinLimit(10, 9)).toBe(true);
    expect(withinLimit(10, 10)).toBe(false);
  });

  it("accepte tout si illimité", () => {
    expect(withinLimit(null, 10_000, 50)).toBe(true);
  });
});

describe("isAbonnementBloque", () => {
  const now = new Date("2026-06-15T12:00:00Z");

  it("bloque une entreprise suspendue ou résiliée", () => {
    expect(isAbonnementBloque(StatutEntreprise.SUSPENDU, null, now)).toBe(true);
    expect(isAbonnementBloque(StatutEntreprise.RESILIE, null, now)).toBe(true);
  });

  it("bloque un essai échu, pas un essai en cours", () => {
    const hier = new Date("2026-06-14T12:00:00Z");
    const demain = new Date("2026-06-16T12:00:00Z");
    expect(isAbonnementBloque(StatutEntreprise.ESSAI, hier, now)).toBe(true);
    expect(isAbonnementBloque(StatutEntreprise.ESSAI, demain, now)).toBe(false);
  });

  it("laisse l'accès en retard de paiement", () => {
    expect(isAbonnementBloque(StatutEntreprise.EN_RETARD, null, now)).toBe(
      false,
    );
  });
});
