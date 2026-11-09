import {
  bumpAllCacheGenerations,
  createCacheNamespace,
} from "./cache-namespace";

describe("createCacheNamespace", () => {
  it("produit une clé stable quel que soit l'ordre des paramètres", () => {
    const ns = createCacheNamespace<"list">("spec-stable");
    expect(ns.buildKey("list", { a: 1, b: 2 })).toBe(
      ns.buildKey("list", { b: 2, a: 1, c: undefined }),
    );
  });

  it("change la clé après un bump de génération", () => {
    const ns = createCacheNamespace<"list">("spec-bump");
    const before = ns.buildKey("list", { page: 1 });
    ns.bumpGeneration();
    expect(ns.buildKey("list", { page: 1 })).not.toBe(before);
  });

  it("bumpAllCacheGenerations invalide tous les namespaces", () => {
    const a = createCacheNamespace<"x">("spec-all-a");
    const b = createCacheNamespace<"x">("spec-all-b");
    bumpAllCacheGenerations();
    expect(a.getGeneration()).toBe(1);
    expect(b.getGeneration()).toBe(1);
  });
});
