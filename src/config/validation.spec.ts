import { validateEnv } from "./validation";

const STRONG_SECRET = "x".repeat(48);

const baseProd = {
  NODE_ENV: "production",
  DATABASE_URL: "postgres://db",
  JWT_SECRET: STRONG_SECRET,
  REDIS_URL: "redis://cache",
};

describe("validateEnv", () => {
  it("accepts a complete production configuration", () => {
    expect(validateEnv(baseProd)).toBe(baseProd);
  });

  it("rejects a missing or placeholder JWT secret", () => {
    expect(() => validateEnv({ ...baseProd, JWT_SECRET: "" })).toThrow(
      /JWT_SECRET is required/,
    );
    expect(() =>
      validateEnv({ ...baseProd, JWT_SECRET: "change-me-in-production" }),
    ).toThrow(/placeholder/);
    expect(() => validateEnv({ ...baseProd, JWT_SECRET: "short" })).toThrow(
      /at least 32/,
    );
  });

  it("rejects debug flags in production", () => {
    expect(() =>
      validateEnv({ ...baseProd, INVITATION_RETURN_TOKEN_IN_RESPONSE: "true" }),
    ).toThrow(/INVITATION_RETURN_TOKEN_IN_RESPONSE must not be enabled/);
    expect(() =>
      validateEnv({ ...baseProd, SOCKET_AUTH_ALLOW_PLAIN_USERID: "1" }),
    ).toThrow(/SOCKET_AUTH_ALLOW_PLAIN_USERID/);
  });

  it("requires redis settings in production only", () => {
    const { REDIS_URL: _redis, ...partial } = baseProd;
    expect(() => validateEnv(partial)).toThrow(/REDIS_URL/);
    expect(() =>
      validateEnv({ ...partial, NODE_ENV: "development" }),
    ).not.toThrow();
  });

  it("keeps debug flags allowed outside production", () => {
    expect(() =>
      validateEnv({
        ...baseProd,
        NODE_ENV: "development",
        INVITATION_RETURN_TOKEN_IN_RESPONSE: "true",
      }),
    ).not.toThrow();
  });
});
