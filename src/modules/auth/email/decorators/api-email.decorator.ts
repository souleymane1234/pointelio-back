import { ApiDocumentation } from "../../../../common/decorators/api-documentation.decorator";
import { ErrorResponseSchemaDto } from "../../../../common/dto/response-schemas.dto";
import { AuthRegisterLoginResponseSchemaDto } from "../../session/dto/auth-response.dto";

export function ApiEmailLogin() {
  return ApiDocumentation({
    operation: {
      summary: "E-mail — connexion",
      description:
        "Connexion avec `email` + `password`. Pas d'OTP. Un mot de passe oublié est réinitialisé par un administrateur (`PATCH /admin/users/:id`).",
    },
    responses: [
      {
        status: 200,
        description: "Connexion réussie",
        schema: AuthRegisterLoginResponseSchemaDto,
      },
      {
        status: 401,
        description: "Identifiants incorrects ou compte désactivé",
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
