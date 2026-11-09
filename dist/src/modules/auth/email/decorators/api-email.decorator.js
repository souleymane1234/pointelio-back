"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiEmailLogin = ApiEmailLogin;
const api_documentation_decorator_1 = require("../../../../common/decorators/api-documentation.decorator");
const response_schemas_dto_1 = require("../../../../common/dto/response-schemas.dto");
const auth_response_dto_1 = require("../../session/dto/auth-response.dto");
function ApiEmailLogin() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "E-mail — connexion",
            description: "Connexion avec `email` + `password`. Pas d'OTP. Un mot de passe oublié est réinitialisé par un administrateur (`PATCH /admin/users/:id`).",
        },
        responses: [
            {
                status: 200,
                description: "Connexion réussie",
                schema: auth_response_dto_1.AuthRegisterLoginResponseSchemaDto,
            },
            {
                status: 401,
                description: "Identifiants incorrects ou compte désactivé",
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
//# sourceMappingURL=api-email.decorator.js.map