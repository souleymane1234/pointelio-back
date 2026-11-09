import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";

/** Nécessite PostgreSQL (DATABASE_URL) : `docker compose up -d` puis `npm run test:e2e`. */
describe("App (e2e)", () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("refuse une route admin sans JWT", () => {
    return request(app.getHttpServer())
      .get("/api/v1/admin/examples")
      .set("Accept", "application/json")
      .set("language", "fr")
      .expect(401);
  });

  it("exige l'en-tête Accept", () => {
    return request(app.getHttpServer())
      .post("/api/v1/auth/admin/login")
      .set("Accept", "")
      .send({ email: "admin@app.local", password: "x" })
      .expect(422);
  });
});
