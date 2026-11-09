import { UnauthorizedException } from "@nestjs/common";
import { Role } from "@prisma/client";
import { getUserId, requireUser, requireUserId } from "./request-context";

describe("authed-request", () => {
  const user = { id: 12, role: Role.EMPLOYE, entrepriseId: 1 };

  it("reads the user id from req.user", () => {
    expect(getUserId({ user })).toBe(12);
    expect(getUserId({})).toBeUndefined();
  });

  it("throws 401 when the user id is missing", () => {
    expect(() => requireUserId({})).toThrow(UnauthorizedException);
    expect(requireUserId({ user })).toBe(12);
  });

  it("requires both id and role for requireUser", () => {
    expect(requireUser({ user })).toEqual(user);
    expect(() =>
      requireUser({ user: { id: 12 } as unknown as typeof user }),
    ).toThrow(UnauthorizedException);
  });
});
