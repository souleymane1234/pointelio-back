import { haversineMeters } from "./geo.util";

describe("haversineMeters", () => {
  it("retourne 0 pour un même point", () => {
    expect(haversineMeters(5.3197, -4.0168, 5.3197, -4.0168)).toBe(0);
  });

  it("mesure ~30 m vers le nord (1° lat ≈ 111 320 m)", () => {
    const originLat = 5.3197;
    const originLon = -4.0168;
    const deltaLat = 30 / 111_320;
    const distance = haversineMeters(
      originLat,
      originLon,
      originLat + deltaLat,
      originLon,
    );
    expect(distance).toBeGreaterThan(29);
    expect(distance).toBeLessThan(31);
  });

  it("mesure une distance connue Abidjan → Paris (ordre de grandeur)", () => {
    const km = haversineMeters(5.36, -4.0083, 48.8566, 2.3522) / 1000;
    expect(km).toBeGreaterThan(4700);
    expect(km).toBeLessThan(5000);
  });
});
