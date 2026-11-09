import { Role } from "@prisma/client";
import {
  ADMIN_APP_USER_PASSWORD_MESSAGE,
  adminUserPasswordErrorMessage,
  isAdminUserPasswordValid,
} from "./auth-validation.constants";

describe("app user password", () => {
  it("accepts a 4-digit PIN, including leading zeros", () => {
    expect(isAdminUserPasswordValid("1234", Role.EMPLOYE)).toBe(true);
    expect(isAdminUserPasswordValid("0012", Role.SURVEILLANT)).toBe(true);
  });

  it("accepts an 8+ character password for mobile roles", () => {
    expect(isAdminUserPasswordValid("MotDePasse1", Role.EMPLOYE)).toBe(true);
  });

  it("rejects short or non-numeric 4-character values", () => {
    for (const value of ["abcd", "12ab", "123", "12 3", "abcdefg"]) {
      expect(isAdminUserPasswordValid(value, Role.EMPLOYE)).toBe(false);
    }
    expect(adminUserPasswordErrorMessage(Role.EMPLOYE)).toBe(
      ADMIN_APP_USER_PASSWORD_MESSAGE,
    );
  });

  it("requires 8 characters for backoffice roles", () => {
    expect(isAdminUserPasswordValid("ExemplePass8", Role.ADMIN_CLIENT)).toBe(
      true,
    );
    expect(isAdminUserPasswordValid("1234", Role.MANAGER)).toBe(false);
  });
});
