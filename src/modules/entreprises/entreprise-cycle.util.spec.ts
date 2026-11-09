import { StatutEntreprise } from "@prisma/client";
import { nextStatut } from "./entreprise-cycle.util";

describe("nextStatut", () => {
  it("suspend une entreprise active, en essai ou en retard", () => {
    for (const statut of [
      StatutEntreprise.ACTIF,
      StatutEntreprise.ESSAI,
      StatutEntreprise.EN_RETARD,
    ]) {
      expect(nextStatut("suspendre", statut)).toBe(StatutEntreprise.SUSPENDU);
    }
  });

  it("ne réactive qu'une entreprise suspendue", () => {
    expect(nextStatut("reactiver", StatutEntreprise.SUSPENDU)).toBe(
      StatutEntreprise.ACTIF,
    );
    expect(nextStatut("reactiver", StatutEntreprise.RESILIE)).toBeNull();
  });

  it("une résiliation est définitive", () => {
    expect(nextStatut("cloturer", StatutEntreprise.ACTIF)).toBe(
      StatutEntreprise.RESILIE,
    );
    expect(nextStatut("cloturer", StatutEntreprise.RESILIE)).toBeNull();
    expect(nextStatut("suspendre", StatutEntreprise.RESILIE)).toBeNull();
  });
});
