import { UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, StatutCompte } from "@prisma/client";
import { TokenService } from "./token.service";

const JWT_SECRET = "test-secret-at-least-32-characters-long";

function createRevocationStore() {
  const revoked = new Set<string>();
  return {
    revoke: jest.fn(async (token: string) => {
      revoked.add(token);
    }),
    isRevoked: jest.fn(async (token: string) => revoked.has(token)),
    consume: jest.fn(async (token: string) => {
      if (revoked.has(token)) return false;
      revoked.add(token);
      return true;
    }),
  };
}

function createService(userOverrides: Record<string, unknown> = {}) {
  const jwtService = new JwtService({ secret: JWT_SECRET });
  const user = {
    id: 1,
    role: Role.EMPLOYE,
    statut: StatutCompte.ACTIF,
    entrepriseId: 7,
    ...userOverrides,
  };
  const prisma = {
    utilisateur: { findUnique: jest.fn().mockResolvedValue(user) },
  };
  const auditActions = { authRefreshToken: jest.fn() };
  const tokenRevocation = createRevocationStore();
  const authUserSession = { touchLastLoginAt: jest.fn() };
  const service = new TokenService(
    jwtService,
    prisma as any,
    auditActions as any,
    tokenRevocation as any,
    authUserSession as any,
  );
  return { service, jwtService, prisma, tokenRevocation };
}

describe("TokenService", () => {
  describe("signTokenPair", () => {
    it("émet des jetons distincts même dans la même seconde", () => {
      const { service } = createService();
      const a = service.signTokenPair(1, Role.EMPLOYE);
      const b = service.signTokenPair(1, Role.EMPLOYE);
      expect(a.refreshToken).not.toBe(b.refreshToken);
      expect(a.accessToken).not.toBe(b.accessToken);
    });
  });

  describe("refresh", () => {
    it("renvoie une nouvelle paire et refuse le rejeu de l'ancien refresh token", async () => {
      const { service } = createService();
      const { refreshToken } = service.signTokenPair(1, Role.EMPLOYE);

      const rotated = await service.refresh(refreshToken, "fr");
      expect(rotated.refreshToken).not.toBe(refreshToken);

      await expect(service.refresh(refreshToken, "fr")).rejects.toBeInstanceOf(
        UnprocessableEntityException,
      );
      await expect(
        service.refresh(rotated.refreshToken, "fr"),
      ).resolves.toBeDefined();
    });

    it("n'accepte qu'un seul refresh concurrent avec le même jeton", async () => {
      const { service } = createService();
      const { refreshToken } = service.signTokenPair(1, Role.EMPLOYE);

      const results = await Promise.allSettled([
        service.refresh(refreshToken, "fr"),
        service.refresh(refreshToken, "fr"),
      ]);
      expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    });

    it("refuse un access token présenté comme refresh token", async () => {
      const { service } = createService();
      const { accessToken } = service.signTokenPair(1, Role.EMPLOYE);
      await expect(service.refresh(accessToken, "fr")).rejects.toBeInstanceOf(
        UnprocessableEntityException,
      );
    });

    it("refuse un compte suspendu", async () => {
      const { service } = createService({ statut: StatutCompte.SUSPENDU });
      const { refreshToken } = service.signTokenPair(1, Role.EMPLOYE);
      await expect(service.refresh(refreshToken, "fr")).rejects.toBeInstanceOf(
        UnprocessableEntityException,
      );
    });
  });

  describe("verifyAccessTokenDiagnose", () => {
    it("retourne le rôle en base, pas celui embarqué dans le JWT", async () => {
      const { service } = createService({ role: Role.EMPLOYE });
      const { accessToken } = service.signTokenPair(1, Role.ADMIN_CLIENT);
      const result = await service.verifyAccessTokenDiagnose(accessToken);
      expect(result).toEqual({
        ok: true,
        user: { id: 1, role: Role.EMPLOYE, entrepriseId: 7 },
      });
    });
  });
});
