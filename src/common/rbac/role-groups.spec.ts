import { Role } from "@prisma/client";
import { canAssignRole, isPlatformRole } from "./role-groups";

describe("role-groups", () => {
  it("distingue l'équipe Pointelio des rôles d'entreprise", () => {
    expect(isPlatformRole(Role.SUPER_ADMIN)).toBe(true);
    expect(isPlatformRole(Role.SUPPORT)).toBe(true);
    expect(isPlatformRole(Role.ADMIN_CLIENT)).toBe(false);
  });

  it("SUPER_ADMIN peut tout attribuer, SUPPORT pas SUPER_ADMIN", () => {
    expect(canAssignRole(Role.SUPER_ADMIN, Role.SUPER_ADMIN)).toBe(true);
    expect(canAssignRole(Role.SUPPORT, Role.SUPER_ADMIN)).toBe(false);
    expect(canAssignRole(Role.SUPPORT, Role.ADMIN_CLIENT)).toBe(true);
  });

  it("un admin d'entreprise n'attribue jamais de rôle plateforme", () => {
    expect(canAssignRole(Role.ADMIN_CLIENT, Role.SUPPORT)).toBe(false);
    expect(canAssignRole(Role.ADMIN_CLIENT, Role.SUPER_ADMIN)).toBe(false);
    expect(canAssignRole(Role.ADMIN_CLIENT, Role.RESPONSABLE_RH)).toBe(true);
  });

  it("un RH gère managers, surveillants et employés uniquement", () => {
    expect(canAssignRole(Role.RESPONSABLE_RH, Role.EMPLOYE)).toBe(true);
    expect(canAssignRole(Role.RESPONSABLE_RH, Role.ADMIN_CLIENT)).toBe(false);
    expect(canAssignRole(Role.RESPONSABLE_RH, Role.RESPONSABLE_RH)).toBe(false);
  });

  it("les rôles opérationnels n'attribuent aucun rôle", () => {
    for (const actor of [Role.MANAGER, Role.SURVEILLANT, Role.EMPLOYE]) {
      expect(canAssignRole(actor, Role.EMPLOYE)).toBe(false);
    }
  });
});
