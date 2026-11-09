import { ApiDocumentation } from "../../../../common/decorators/api-documentation.decorator";
import { AuthRegisterLoginResponseSchemaDto } from "../../session/dto/auth-response.dto";
import { ErrorResponseSchemaDto } from "../../../../common/dto/response-schemas.dto";

export function ApiLogin() {
  return ApiDocumentation({
    operation: {
      summary: "Téléphone — connexion",
      description:
        "**Application mobile client.** Connexion avec `phone_number` et `secret_code` (PIN à 4 chiffres). Pas de SMS ni d'OTP : un PIN oublié est réinitialisé par un admin RH (`PATCH /admin/users/:id`).",
    },
    responses: [
      {
        status: 200,
        description: "Connexion réussie",
        schema: AuthRegisterLoginResponseSchemaDto,
      },
      {
        status: 401,
        description: "Identifiants incorrects",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 422,
        description: "Données invalides",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}
