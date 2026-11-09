import {
  generateInvitationToken,
  hashInvitationToken,
} from "./invitation-token.util";

describe("invitation-token.util", () => {
  it("ne stocke que le hash du jeton", () => {
    const { token, tokenHash } = generateInvitationToken();
    expect(tokenHash).not.toContain(token);
    expect(tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(hashInvitationToken(token)).toBe(tokenHash);
  });

  it("génère des jetons uniques et longs", () => {
    const a = generateInvitationToken().token;
    const b = generateInvitationToken().token;
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(43);
  });
});
