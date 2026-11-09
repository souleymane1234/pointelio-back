import {
  hasDuplicateJours,
  horaireDuJour,
  parseHorairesJours,
} from "./site-horaires.util";

describe("parseHorairesJours", () => {
  it("garde les plages valides et déduplique par jour", () => {
    expect(
      parseHorairesJours([
        { jour: 1, heureDebut: "08:00", heureFin: "17:00" },
        { jour: 1, heureDebut: "09:00", heureFin: "12:00" },
        { jour: 6, heureDebut: "08:00", heureFin: "13:00" },
        { jour: 8, heureDebut: "08:00", heureFin: "17:00" },
        { invalide: true },
      ]),
    ).toEqual([
      { jour: 1, heureDebut: "09:00", heureFin: "12:00" },
      { jour: 6, heureDebut: "08:00", heureFin: "13:00" },
    ]);
  });

  it("accepte un JSON vide", () => {
    expect(parseHorairesJours([])).toEqual([]);
    expect(parseHorairesJours(null)).toEqual([]);
  });
});

describe("horaireDuJour / hasDuplicateJours", () => {
  const jours = parseHorairesJours([
    { jour: 1, heureDebut: "08:00", heureFin: "17:00" },
    { jour: 6, heureDebut: "08:00", heureFin: "13:00" },
  ]);

  it("trouve le lundi, pas le dimanche", () => {
    expect(horaireDuJour(jours, 1)?.heureDebut).toBe("08:00");
    expect(horaireDuJour(jours, 7)).toBeNull();
  });

  it("détecte un jour en double", () => {
    expect(hasDuplicateJours([{ jour: 1 }, { jour: 2 }])).toBe(false);
    expect(hasDuplicateJours([{ jour: 1 }, { jour: 1 }])).toBe(true);
  });
});
