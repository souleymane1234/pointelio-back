import type { OpenAPIObject } from "@nestjs/swagger";
import {
  filterOpenApiByTag,
  SWAGGER_DESCRIPTION,
  SWAGGER_MOBILE_DESCRIPTION,
  SWAGGER_TAG,
} from "./swagger-tags";

function sampleDoc(): OpenAPIObject {
  return {
    openapi: "3.0.0",
    info: { title: "Pointellio API", version: "1.0" },
    paths: {
      "/api/v1/auth/phone/login": {
        post: {
          tags: [SWAGGER_TAG.mobile, "Auth — Téléphone"],
          summary: "Connexion",
          responses: { 200: { description: "ok" } },
        },
      },
      "/api/v1/sites": {
        get: {
          tags: [SWAGGER_TAG.employeur, "Sites"],
          summary: "Lister les sites",
          responses: { 200: { description: "ok" } },
        },
      },
    },
    tags: [
      { name: SWAGGER_TAG.mobile },
      { name: SWAGGER_TAG.employeur },
      { name: "Auth — Téléphone" },
      { name: "Sites" },
    ],
  };
}

describe("filterOpenApiByTag", () => {
  it("ne garde que les opérations mobile et retire le tag d'audience", () => {
    const filtered = filterOpenApiByTag(sampleDoc(), SWAGGER_TAG.mobile, {
      titleSuffix: " — Mobile client",
      description: "doc mobile",
    });

    expect(filtered.info.title).toBe("Pointellio API — Mobile client");
    expect(filtered.paths["/api/v1/auth/phone/login"]).toBeDefined();
    expect(filtered.paths["/api/v1/sites"]).toBeUndefined();
    expect(filtered.paths["/api/v1/auth/phone/login"]?.post?.tags).toEqual([
      "Auth — Téléphone",
    ]);
    expect(filtered.tags?.map((t) => t.name)).toEqual(["Auth — Téléphone"]);
  });
});

describe("documentation Swagger", () => {
  it.each([SWAGGER_DESCRIPTION, SWAGGER_MOBILE_DESCRIPTION])(
    "n'expose plus de parcours SMS / OTP",
    (text) => {
      expect(text).toMatch(/Pas de SMS/);
      expect(text).not.toMatch(/forgot-password/);
      expect(text).not.toMatch(/verify-code/);
      expect(text).toContain("/auth/phone/login");
    },
  );
});
