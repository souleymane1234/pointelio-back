import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { APP_NAME } from "../constants/app.constants";
import { swaggerDarkModeCss, swaggerDarkModeJs } from "./swagger-dark-mode";
import {
  filterOpenApiByTag,
  SWAGGER_DESCRIPTION,
  SWAGGER_MOBILE_DESCRIPTION,
  SWAGGER_MOBILE_PATH,
  SWAGGER_PATH,
  SWAGGER_TAG,
} from "./swagger-tags";

const uiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: "none" as const,
    tagsSorter: "alpha" as const,
    operationsSorter: "alpha" as const,
  },
  customCss: swaggerDarkModeCss,
  customJsStr: swaggerDarkModeJs,
};

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion("1.1")
    .addBearerAuth()
    .addTag(
      SWAGGER_TAG.mobile,
      "Application mobile client (employé / surveillant). Contrat à implémenter côté app. Pas de SMS ni d'OTP.",
    )
    .addTag(
      SWAGGER_TAG.employeur,
      "Back-office de l'entreprise cliente (web). Sites, RH, présence, validations.",
    )
    .addTag(
      SWAGGER_TAG.plateforme,
      "Réservé à l'équipe Pointellio (packs, entreprises, support).",
    )
    .addTag(
      "Auth — Téléphone",
      "Mobile : POST /auth/phone/login (téléphone + PIN). Pas de SMS ni d'OTP.",
    )
    .addTag("Auth — E-mail", "Back-office : POST /auth/email/login. Pas d'OTP.")
    .addTag(
      "Auth — Session",
      "refresh-token et logout (mobile et web). admin/login = back-office uniquement.",
    )
    .addTag(
      "Invitations",
      "Activation de compte par lien e-mail (pas de code SMS).",
    )
    .addTag(
      "Admin — Utilisateurs",
      "RH : créer, réaffecter, suspendre, renvoyer, réinitialiser le PIN.",
    )
    .addTag(
      "Sites",
      "Jours travaillés, GPS, tolérance de retard facultative (employeur).",
    )
    .addTag("Dashboard", "Présence, retards et paie du jour.")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    ...uiOptions,
    customSiteTitle: `${APP_NAME} — Swagger`,
  });

  const mobileDocument = filterOpenApiByTag(document, SWAGGER_TAG.mobile, {
    titleSuffix: " — Mobile client",
    description: SWAGGER_MOBILE_DESCRIPTION,
  });
  SwaggerModule.setup(SWAGGER_MOBILE_PATH, app, mobileDocument, {
    ...uiOptions,
    customSiteTitle: `${APP_NAME} — Mobile`,
  });
}
