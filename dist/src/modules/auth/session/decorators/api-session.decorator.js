"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAdminLogin = ApiAdminLogin;
exports.ApiRefreshToken = ApiRefreshToken;
exports.ApiLogout = ApiLogout;
const api_documentation_decorator_1 = require("../../../../common/decorators/api-documentation.decorator");
const auth_response_dto_1 = require("../dto/auth-response.dto");
const response_schemas_dto_1 = require("../../../../common/dto/response-schemas.dto");
function ApiAdminLogin() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "Connexion admin",
            description: "**Back-office employeur / Pointellio.** Ne pas utiliser depuis l'application mobile (employé / surveillant : `POST /auth/phone/login`).",
        },
        responses: [
            {
                status: 200,
                description: "Connexion réussie",
                schema: auth_response_dto_1.AuthRegisterLoginResponseSchemaDto,
            },
            {
                status: 401,
                description: "Identifiants admin incorrects",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 422,
                description: "Données invalides",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
function ApiRefreshToken() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "Rafraîchir les tokens",
            description: "Commun au mobile et au back-office. Envoie `refresh_token` pour obtenir de nouveaux jetons.",
        },
        responses: [
            {
                status: 200,
                description: "Nouveaux tokens générés",
                schema: auth_response_dto_1.AuthRefreshResponseSchemaDto,
            },
            {
                status: 422,
                description: "Token manquant, invalide ou expiré",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
function ApiLogout() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "Déconnexion",
            description: "Invalide le token d’accès (Authorization Bearer) et, si fourni, le `refresh_token`. " +
                "Les tokens révoqués ne peuvent plus être utilisés pour les requêtes API ni le rafraîchissement.",
        },
        responses: [
            {
                status: 200,
                description: "Déconnexion réussie",
            },
            {
                status: 401,
                description: "Non authentifié ou token manquant",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
//# sourceMappingURL=api-session.decorator.js.map