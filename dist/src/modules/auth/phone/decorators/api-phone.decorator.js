"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiLogin = ApiLogin;
const api_documentation_decorator_1 = require("../../../../common/decorators/api-documentation.decorator");
const auth_response_dto_1 = require("../../session/dto/auth-response.dto");
const response_schemas_dto_1 = require("../../../../common/dto/response-schemas.dto");
function ApiLogin() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "Téléphone — connexion",
            description: "**Application mobile client.** Connexion avec `phone_number` et `secret_code` (PIN à 4 chiffres). Pas de SMS ni d'OTP : un PIN oublié est réinitialisé par un admin RH (`PATCH /admin/users/:id`).",
        },
        responses: [
            {
                status: 200,
                description: "Connexion réussie",
                schema: auth_response_dto_1.AuthRegisterLoginResponseSchemaDto,
            },
            {
                status: 401,
                description: "Identifiants incorrects",
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
//# sourceMappingURL=api-phone.decorator.js.map