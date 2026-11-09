"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiMyEntitlements = ApiMyEntitlements;
const api_documentation_decorator_1 = require("../../../common/decorators/api-documentation.decorator");
const response_schemas_dto_1 = require("../../../common/dto/response-schemas.dto");
const entitlements_response_dto_1 = require("../dto/entitlements-response.dto");
function ApiMyEntitlements() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "Mes droits (limites, modules, usage)",
            description: "Utilisé par le mobile et le back-office pour afficher ou masquer les fonctions (QR, GPS, congés, surveillant). Accessible même si l'abonnement est bloqué.",
        },
        responses: [
            {
                status: 200,
                description: "Droits récupérés",
                schema: entitlements_response_dto_1.EntitlementsResponseSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifié",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
//# sourceMappingURL=api-entitlements.decorator.js.map