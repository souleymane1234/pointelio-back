import { TypePointage } from "@prisma/client";
import {
  isLateArrival,
  isWorkDay,
  minutesLate,
  nextTypeAttendu,
} from "./pointage-sequence.util";

const horaire = {
  heureDebut: "08:00",
  heureFin: "17:00",
  toleranceMin: 15,
  joursTravail: [1, 2, 3, 4, 5],
};

describe("nextTypeAttendu", () => {
  it("commence par une arrivée", () => {
    expect(nextTypeAttendu(null)).toBe(TypePointage.ARRIVEE);
    expect(nextTypeAttendu(TypePointage.DEPART)).toBe(TypePointage.ARRIVEE);
  });

  it("alterne après une arrivée", () => {
    expect(nextTypeAttendu(TypePointage.ARRIVEE)).toBe(TypePointage.DEPART);
  });
});

describe("isLateArrival / isWorkDay", () => {
  it("sans tolérance, toute minute après l'heure de début est un retard", () => {
    expect(
      minutesLate(
        new Date("2026-10-27T08:01:00.000Z"),
        "08:00",
        0,
        "Africa/Abidjan",
      ),
    ).toBe(1);
  });

  it("compte les minutes au-delà de la tolérance", () => {
    expect(
      minutesLate(
        new Date("2026-10-27T08:10:00.000Z"),
        "08:00",
        15,
        "Africa/Abidjan",
      ),
    ).toBe(0);
    expect(
      minutesLate(
        new Date("2026-10-27T08:20:00.000Z"),
        "08:00",
        15,
        "Africa/Abidjan",
      ),
    ).toBe(5);
  });

  it("tolère 15 min, signale 08:20", () => {
    expect(
      isLateArrival(
        new Date("2026-10-27T08:10:00.000Z"),
        horaire,
        "Africa/Abidjan",
      ),
    ).toBe(false);
    expect(
      isLateArrival(
        new Date("2026-10-27T08:20:00.000Z"),
        horaire,
        "Africa/Abidjan",
      ),
    ).toBe(true);
  });

  it("reconnaît un jour travaillé (mardi) et pas le dimanche", () => {
    expect(
      isWorkDay(new Date("2026-10-27T10:00:00.000Z"), horaire, "UTC"),
    ).toBe(true);
    expect(
      isWorkDay(new Date("2026-10-25T10:00:00.000Z"), horaire, "UTC"),
    ).toBe(false);
  });
});
