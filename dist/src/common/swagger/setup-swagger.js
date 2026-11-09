"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
const app_constants_1 = require("../constants/app.constants");
const swagger_dark_mode_1 = require("./swagger-dark-mode");
const swagger_tags_1 = require("./swagger-tags");
const uiOptions = {
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "none",
        tagsSorter: "alpha",
        operationsSorter: "alpha",
    },
    customCss: swagger_dark_mode_1.swaggerDarkModeCss,
    customJsStr: swagger_dark_mode_1.swaggerDarkModeJs,
};
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle(app_constants_1.APP_NAME)
        .setDescription(swagger_tags_1.SWAGGER_DESCRIPTION)
        .setVersion("1.1")
        .addBearerAuth()
        .addTag(swagger_tags_1.SWAGGER_TAG.mobile, "Application mobile client (employé / surveillant). Contrat à implémenter côté app. Pas de SMS ni d'OTP.")
        .addTag(swagger_tags_1.SWAGGER_TAG.employeur, "Back-office de l'entreprise cliente (web). Sites, RH, présence, validations.")
        .addTag(swagger_tags_1.SWAGGER_TAG.plateforme, "Réservé à l'équipe Pointellio (packs, entreprises, support).")
        .addTag("Auth — Téléphone", "Mobile : POST /auth/phone/login (téléphone + PIN). Pas de SMS ni d'OTP.")
        .addTag("Auth — E-mail", "Back-office : POST /auth/email/login. Pas d'OTP.")
        .addTag("Auth — Session", "refresh-token et logout (mobile et web). admin/login = back-office uniquement.")
        .addTag("Invitations", "Activation de compte par lien e-mail (pas de code SMS).")
        .addTag("Admin — Utilisateurs", "RH : créer, réaffecter, suspendre, renvoyer, réinitialiser le PIN.")
        .addTag("Sites", "Jours travaillés, GPS, tolérance de retard facultative (employeur).")
        .addTag("Dashboard", "Présence, retards et paie du jour.")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(swagger_tags_1.SWAGGER_PATH, app, document, {
        ...uiOptions,
        customSiteTitle: `${app_constants_1.APP_NAME} — Swagger`,
    });
    const mobileDocument = (0, swagger_tags_1.filterOpenApiByTag)(document, swagger_tags_1.SWAGGER_TAG.mobile, {
        titleSuffix: " — Mobile client",
        description: swagger_tags_1.SWAGGER_MOBILE_DESCRIPTION,
    });
    swagger_1.SwaggerModule.setup(swagger_tags_1.SWAGGER_MOBILE_PATH, app, mobileDocument, {
        ...uiOptions,
        customSiteTitle: `${app_constants_1.APP_NAME} — Mobile`,
    });
}
//# sourceMappingURL=setup-swagger.js.map