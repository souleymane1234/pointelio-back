import {
  countWorkingDays,
  dateToCivil,
  datesOverlap,
  parseCivilDate,
  spanDays,
} from "./demande-jours.util";

describe("parseCivilDate", () => {
  it("accepte une date réelle", () => {
    expect(parseCivilDate("2026-10-27")).toEqual({ y: 2026, m: 10, d: 27 });
  });

  it("refuse une date calendaire impossible", () => {
    expect(parseCivilDate("2026-02-31")).toBeNull();
    expect(parseCivilDate("27/10/2026")).toBeNull();
  });
});

describe("countWorkingDays", () => {
  const semaine = [1, 2, 3, 4, 5];

  it("compte un mardi isolé", () => {
    expect(countWorkingDays("2026-10-27", "2026-10-27", semaine)).toBe(1);
  });

  it("exclut le week-end d'une semaine complète", () => {
    // lundi 26 → dimanche 1er nov. 2026 = 5 jours ouvrés
    expect(countWorkingDays("2026-10-26", "2026-11-01", semaine)).toBe(5);
  });

  it("retourne 0 pour un samedi–dimanche", () => {
    expect(countWorkingDays("2026-10-24", "2026-10-25", semaine)).toBe(0);
  });

  it("suit un horaire samedi travaillé", () => {
    expect(
      countWorkingDays("2026-10-24", "2026-10-25", [1, 2, 3, 4, 5, 6]),
    ).toBe(1);
  });

  it("retombe sur lun–ven si l'horaire est vide", () => {
    expect(countWorkingDays("2026-10-26", "2026-11-01", [])).toBe(5);
  });
});

describe("datesOverlap / spanDays / dateToCivil", () => {
  it("détecte un chevauchement inclusif", () => {
    expect(
      datesOverlap("2026-10-01", "2026-10-10", "2026-10-10", "2026-10-12"),
    ).toBe(true);
    expect(
      datesOverlap("2026-10-01", "2026-10-05", "2026-10-06", "2026-10-12"),
    ).toBe(false);
  });

  it("compte les jours civils inclusifs", () => {
    expect(spanDays("2026-10-01", "2026-10-01")).toBe(1);
    expect(spanDays("2026-10-01", "2026-10-03")).toBe(3);
  });

  it("sérialise une Date UTC minuit", () => {
    expect(dateToCivil(new Date("2026-10-27T00:00:00.000Z"))).toBe(
      "2026-10-27",
    );
  });
});
