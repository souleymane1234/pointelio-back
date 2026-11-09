import { ForbiddenException } from "@nestjs/common";
import { scopeTenantArgs } from "./tenant.extension";

describe("scopeTenantArgs", () => {
  it("ajoute l'entreprise aux lectures", () => {
    expect(scopeTenantArgs("findMany", { where: { actif: true } }, 7)).toEqual({
      where: { actif: true, entrepriseId: 7 },
    });
    expect(scopeTenantArgs("findUnique", { where: { id: 3 } }, 7)).toEqual({
      where: { id: 3, entrepriseId: 7 },
    });
    expect(scopeTenantArgs("count", undefined, 7)).toEqual({
      where: { entrepriseId: 7 },
    });
  });

  it("écrase un filtre entrepriseId forgé vers une autre entreprise", () => {
    expect(
      scopeTenantArgs("findMany", { where: { entrepriseId: 99 } }, 7),
    ).toEqual({ where: { entrepriseId: 7 } });
  });

  it("injecte l'entreprise à la création", () => {
    expect(scopeTenantArgs("create", { data: { nom: "Siège" } }, 7)).toEqual({
      data: { nom: "Siège", entrepriseId: 7 },
    });
    expect(
      scopeTenantArgs("createMany", { data: [{ nom: "A" }, { nom: "B" }] }, 7),
    ).toEqual({
      data: [
        { nom: "A", entrepriseId: 7 },
        { nom: "B", entrepriseId: 7 },
      ],
    });
  });

  it("refuse une écriture vers une autre entreprise", () => {
    expect(() =>
      scopeTenantArgs("create", { data: { entrepriseId: 99 } }, 7),
    ).toThrow(ForbiddenException);
    expect(() =>
      scopeTenantArgs(
        "update",
        { where: { id: 1 }, data: { entrepriseId: 99 } },
        7,
      ),
    ).toThrow(ForbiddenException);
  });

  it("restreint les mises à jour et suppressions à l'entreprise", () => {
    expect(scopeTenantArgs("delete", { where: { id: 1 } }, 7).where).toEqual({
      id: 1,
      entrepriseId: 7,
    });
    expect(
      scopeTenantArgs("updateMany", { where: {}, data: { actif: false } }, 7),
    ).toEqual({ where: { entrepriseId: 7 }, data: { actif: false } });
  });
});
