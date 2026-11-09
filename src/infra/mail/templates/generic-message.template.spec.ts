import { generateGenericMessageEmail } from "./generic-message.template";

describe("generateGenericMessageEmail", () => {
  it("échappe le message et inclut le bouton d'action", () => {
    const email = generateGenericMessageEmail({
      locale: "fr",
      subject: "Bienvenue",
      heading: "Bonjour",
      message: "<script>alert(1)</script>",
      action: { label: "Ouvrir", href: "https://app.example.com" },
    });

    expect(email.subject).toBe("Bienvenue");
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("https://app.example.com");
    expect(email.text).toContain("Ouvrir: https://app.example.com");
  });

  it("omet le bouton sans action", () => {
    const email = generateGenericMessageEmail({
      locale: "en",
      subject: "Hello",
      heading: "Hello",
      message: "Plain message",
    });

    expect(email.text).not.toContain("http");
  });
});
