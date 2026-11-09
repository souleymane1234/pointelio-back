import { ApiDocumentation } from "../../../common/decorators/api-documentation.decorator";
import { ErrorResponseSchemaDto } from "../../../common/dto/response-schemas.dto";
import { EntitlementsResponseSchemaDto } from "../dto/entitlements-response.dto";

export function ApiMyEntitlements() {
  return ApiDocumentation({
    operation: {
      summary: "Mes droits (limites, modules, usage)",
      description:
        "Utilisé par le mobile et le back-office pour afficher ou masquer les fonctions (QR, GPS, congés, surveillant). Accessible même si l'abonnement est bloqué.",
    },
    responses: [
      {
        status: 200,
        description: "Droits récupérés",
        schema: EntitlementsResponseSchemaDto,
      },
      {
        status: 401,
        description: "Non authentifié",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}
