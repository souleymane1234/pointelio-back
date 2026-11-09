import {
  isoWeekdayInZone,
  minutesInZone,
  parseHeureMinutes,
  safeTimeZone,
  zonedDayBounds,
} from "./zoned-time.util";

describe("zonedDayBounds", () => {
  it("borne le jour civil UTC à Abidjan (GMT)", () => {
    const { start, end } = zonedDayBounds(
      new Date("2026-10-27T14:30:00.000Z"),
      "Africa/Abidjan",
    );
    expect(start.toISOString()).toBe("2026-10-27T00:00:00.000Z");
    expect(end.toISOString()).toBe("2026-10-28T00:00:00.000Z");
  });

  it("tient compte du décalage (Paris, été UTC+2)", () => {
    const { start, end } = zonedDayBounds(
      new Date("2026-07-01T10:00:00.000Z"),
      "Europe/Paris",
    );
    expect(start.toISOString()).toBe("2026-06-30T22:00:00.000Z");
    expect(end.toISOString()).toBe("2026-07-01T22:00:00.000Z");
  });
});

describe("minutesInZone / isoWeekdayInZone", () => {
  it("lit l'heure civile à Abidjan", () => {
    expect(
      minutesInZone(new Date("2026-10-27T08:15:00.000Z"), "Africa/Abidjan"),
    ).toBe(8 * 60 + 15);
  });

  it("donne le jour ISO (mardi 27 oct. 2026 = 2)", () => {
    expect(isoWeekdayInZone(new Date("2026-10-27T10:00:00.000Z"), "UTC")).toBe(
      2,
    );
  });
});

describe("parseHeureMinutes / safeTimeZone", () => {
  it("parse HH:mm", () => {
    expect(parseHeureMinutes("08:00")).toBe(480);
    expect(parseHeureMinutes("17:30")).toBe(17 * 60 + 30);
  });

  it("retombe sur Africa/Abidjan si le fuseau est invalide", () => {
    expect(safeTimeZone("Not/AZone")).toBe("Africa/Abidjan");
    expect(safeTimeZone("Europe/Paris")).toBe("Europe/Paris");
  });
});
