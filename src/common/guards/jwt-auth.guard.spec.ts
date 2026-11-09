import { UnauthorizedException } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, StatutCompte, StatutEntreprise } from "@prisma/client";
import { JwtAuthGuard } from "./jwt-auth.guard";

const JWT_SECRET = "test-secret-at-least-32-characters-long";

function createGuard(options: {
  dbRole?: Role;
  statut?: StatutCompte;
  revoked?: boolean;
}) {
  const jwtService = new JwtService({ secret: JWT_SECRET });
  const reflector = { getAllAndOverride: jest.fn(() => undefined) };
  const prisma = {
    utilisateur: {
      findUnique: jest.fn().mockResolvedValue({
        id: 1,
        role: options.dbRole ?? Role.EMPLOYE,
        statut: options.statut ?? StatutCompte.ACTIF,
        entrepriseId: 7,
        entreprise: { statut: StatutEntreprise.ACTIF, dateEcheance: null },
      }),
    },
  };
  const tokenRevocation = {
    isRevoked: jest.fn().mockResolvedValue(options.revoked ?? false),
  };
  const guard = new JwtAuthGuard(
    jwtService,
    reflector as any,
    prisma as any,
    tokenRevocation as any,
  );
  return { guard, jwtService };
}

function createContext(token: string) {
  const request: Record<string, any> = {
    headers: { authorization: `Bearer ${token}`, language: "fr" },
    path: "/api/v1/admin/users",
    url: "/api/v1/admin/users",
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
  return { context, request };
}

function accessToken(jwtService: JwtService, role: Role) {
  return jwtService.sign({ sub: "1", type: "access", role });
}

describe("JwtAuthGuard", () => {
  it("attache le rôle, l'entreprise et l'abonnement lus en base, même si le JWT annonce un autre rôle", async () => {
    const { guard, jwtService } = createGuard({ dbRole: Role.EMPLOYE });
    const { context, request } = createContext(
      accessToken(jwtService, Role.ADMIN_CLIENT),
    );

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({
      id: 1,
      role: Role.EMPLOYE,
      entrepriseId: 7,
    });
    expect(request.tenant).toEqual({
      entrepriseId: 7,
      statut: StatutEntreprise.ACTIF,
      dateEcheance: null,
    });
  });

  it.each([StatutCompte.SUSPENDU, StatutCompte.DESACTIVE, StatutCompte.INVITE])(
    "refuse un compte au statut %s",
    async (statut) => {
      const { guard, jwtService } = createGuard({ statut });
      const { context } = createContext(accessToken(jwtService, Role.EMPLOYE));

      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    },
  );

  it("refuse un jeton révoqué", async () => {
    const { guard, jwtService } = createGuard({ revoked: true });
    const { context } = createContext(accessToken(jwtService, Role.EMPLOYE));

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("refuse un refresh token utilisé comme access token", async () => {
    const { guard, jwtService } = createGuard({});
    const { context } = createContext(
      jwtService.sign({ sub: "1", type: "refresh" }),
    );

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("refuse un sub non numérique", async () => {
    const { guard, jwtService } = createGuard({});
    const { context } = createContext(
      jwtService.sign({ sub: "cuid-legacy", type: "access" }),
    );

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
