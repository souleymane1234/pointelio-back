"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDeactivateAccount = ApiDeactivateAccount;
const api_documentation_decorator_1 = require("../../../../common/decorators/api-documentation.decorator");
const response_schemas_dto_1 = require("../../../../common/dto/response-schemas.dto");
function ApiDeactivateAccount() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "Désactiver mon compte",
            description: "Réservé à l'utilisateur authentifié (Authorization Bearer). Aucun corps. " +
                "Désactive son propre compte, révoque le token d'accès courant et refuse tout rafraîchissement ou autre session tant que le compte est inactif.",
        },
        responses: [
            {
                status: 200,
                description: "Compte désactivé",
            },
            {
                status: 401,
                description: "Non authentifié ou token manquant",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 404,
                description: "Compte introuvable",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 422,
                description: "Compte déjà désactivé",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
//# sourceMappingURL=api-account.decorator.js.map