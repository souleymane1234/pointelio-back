import { ApiDocumentation } from "../../../../common/decorators/api-documentation.decorator";
import { ErrorResponseSchemaDto } from "../../../../common/dto/response-schemas.dto";

export function ApiDeactivateAccount() {
  return ApiDocumentation({
    operation: {
      summary: "Désactiver mon compte",
      description:
        "Réservé à l'utilisateur authentifié (Authorization Bearer). Aucun corps. " +
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
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 404,
        description: "Compte introuvable",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 422,
        description: "Compte déjà désactivé",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}
