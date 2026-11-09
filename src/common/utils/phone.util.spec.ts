import {
  normalizePhoneE164,
  phoneSearchContainsTerms,
  resolveUserSearchTerm,
} from "./phone.util";

describe("normalizePhoneE164", () => {
  it("accepte les formats internationaux", () => {
    expect(normalizePhoneE164("+33 6 12 34 56 78")).toBe("+33612345678");
    expect(normalizePhoneE164("0033612345678")).toBe("+33612345678");
    expect(normalizePhoneE164("+225-07.00.00.00.00")).toBe("+2250700000000");
  });

  it("rejette les numéros sans indicatif ou de longueur invalide", () => {
    expect(normalizePhoneE164("0612345678")).toBeNull();
    expect(normalizePhoneE164("+0612345678")).toBeNull();
    expect(normalizePhoneE164("+1234567")).toBeNull();
    expect(normalizePhoneE164("+1234567890123456")).toBeNull();
    expect(normalizePhoneE164("+33abc")).toBeNull();
  });
});

describe("phoneSearchContainsTerms", () => {
  it("ignore les emails et les termes courts", () => {
    expect(phoneSearchContainsTerms("john@doe.com")).toEqual([]);
    expect(phoneSearchContainsTerms("1234")).toEqual([]);
  });

  it("retourne les chiffres du numéro", () => {
    expect(phoneSearchContainsTerms("+33 6 12 34 56 78")).toEqual([
      "33612345678",
    ]);
  });
});

describe("resolveUserSearchTerm", () => {
  it("conserve les emails et normalise les numéros", () => {
    expect(resolveUserSearchTerm(" john.doe@mail.com ")).toBe(
      "john.doe@mail.com",
    );
    expect(resolveUserSearchTerm("+33 6 12-34")).toBe("+3361234");
  });
});
