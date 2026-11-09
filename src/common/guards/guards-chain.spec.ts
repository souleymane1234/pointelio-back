import {
  ForbiddenException,
  UnauthorizedException,
  type ExecutionContext,
} from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import { Role, StatutEntreprise } from "@prisma/client";
import {
  ABONNEMENT_INACTIF_AUTORISE_KEY,
  MODULES_REQUIS_KEY,
} from "../constants/auth.constants";
import { PACK_MODULES } from "../constants/pack-modules.constants";
import { getRequestStore, runWithRequestStore } from "../context/request-store";
import { ROLES_KEY } from "../rbac/roles.constants";
import type { AuthedRequest } from "../types/request-context";
import { AbonnementActifGuard } from "./abonnement-actif.guard";
import { ModuleGuard } from "./module.guard";
import { RolesGuard } from "./roles.guard";
import { TenantGuard } from "./tenant.guard";

function context(request: Partial<AuthedRequest>): ExecutionContext {
  const req = { headers: { language: "fr" }, ...request };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
}

function reflector(metadata: Record<string, unknown>): Reflector {
  return {
    getAllAndOverride: (key: string) => metadata[key],
  } as unknown as Reflector;
}

const employe = { id: 1, role: Role.EMPLOYE, entrepriseId: 7 };
const tenantActif = {
  entrepriseId: 7,
  statut: StatutEntreprise.ACTIF,
  dateEcheance: null,
};

describe("TenantGuard", () => {
  const guard = new TenantGuard();

  it("publie l'entreprise dans le contexte de requête", () => {
    runWithRequestStore({}, () => {
      expect(
        guard.canActivate(context({ user: employe, tenant: tenantActif })),
      ).toBe(true);
      expect(getRequestStore()?.entrepriseId).toBe(7);
    });
  });

  it("refuse un compte d'entreprise sans entreprise", () => {
    expect(() =>
      guard.canActivate(context({ user: { ...employe, entrepriseId: null } })),
    ).toThrow(ForbiddenException);
  });

  it("laisse passer l'équipe Pointelio et les routes publiques", () => {
    const admin = { id: 2, role: Role.SUPER_ADMIN, entrepriseId: null };
    expect(guard.canActivate(context({ user: admin }))).toBe(true);
    expect(guard.canActivate(context({}))).toBe(true);
  });
});

describe("AbonnementActifGuard", () => {
  const suspendu = { ...tenantActif, statut: StatutEntreprise.SUSPENDU };

  it("bloque une entreprise suspendue", () => {
    const guard = new AbonnementActifGuard(reflector({}));
    expect(() =>
      guard.canActivate(context({ user: employe, tenant: suspendu })),
    ).toThrow(ForbiddenException);
  });

  it("laisse passer une route marquée @AutoriseAbonnementInactif", () => {
    const guard = new AbonnementActifGuard(
      reflector({ [ABONNEMENT_INACTIF_AUTORISE_KEY]: true }),
    );
    expect(
      guard.canActivate(context({ user: employe, tenant: suspendu })),
    ).toBe(true);
  });

  it("laisse passer une entreprise active", () => {
    const guard = new AbonnementActifGuard(reflector({}));
    expect(
      guard.canActivate(context({ user: employe, tenant: tenantActif })),
    ).toBe(true);
  });
});

describe("RolesGuard", () => {
  it("refuse un rôle non autorisé", () => {
    const guard = new RolesGuard(
      reflector({ [ROLES_KEY]: [Role.ADMIN_CLIENT] }),
    );
    expect(() => guard.canActivate(context({ user: employe }))).toThrow(
      ForbiddenException,
    );
  });

  it("exige un utilisateur quand des rôles sont requis", () => {
    const guard = new RolesGuard(reflector({ [ROLES_KEY]: [Role.EMPLOYE] }));
    expect(() => guard.canActivate(context({}))).toThrow(UnauthorizedException);
  });

  it("laisse passer sans @Roles", () => {
    const guard = new RolesGuard(reflector({}));
    expect(guard.canActivate(context({ user: employe }))).toBe(true);
  });
});

describe("ModuleGuard", () => {
  it("vérifie chaque module requis pour l'entreprise", async () => {
    const entitlements = { assertModule: jest.fn() };
    const guard = new ModuleGuard(
      reflector({ [MODULES_REQUIS_KEY]: [PACK_MODULES.GPS] }),
      entitlements as never,
    );
    await guard.canActivate(context({ user: employe, tenant: tenantActif }));
    expect(entitlements.assertModule).toHaveBeenCalledWith(
      7,
      PACK_MODULES.GPS,
      "fr",
    );
  });

  it("ignore l'équipe Pointelio", async () => {
    const entitlements = { assertModule: jest.fn() };
    const guard = new ModuleGuard(
      reflector({ [MODULES_REQUIS_KEY]: [PACK_MODULES.GPS] }),
      entitlements as never,
    );
    const admin = { id: 2, role: Role.SUPER_ADMIN, entrepriseId: null };
    await expect(guard.canActivate(context({ user: admin }))).resolves.toBe(
      true,
    );
    expect(entitlements.assertModule).not.toHaveBeenCalled();
  });
});
