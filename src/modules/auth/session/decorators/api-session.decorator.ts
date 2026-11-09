import { ApiDocumentation } from "../../../../common/decorators/api-documentation.decorator";
import {
  AuthRefreshResponseSchemaDto,
  AuthRegisterLoginResponseSchemaDto,
} from "../dto/auth-response.dto";
import { ErrorResponseSchemaDto } from "../../../../common/dto/response-schemas.dto";

export function ApiAdminLogin() {
  return ApiDocumentation({
    operation: {
      summary: "Connexion admin",
      description:
        "**Back-office employeur / Pointellio.** Ne pas utiliser depuis l'application mobile (employé / surveillant : `POST /auth/phone/login`).",
    },
    responses: [
      {
        status: 200,
        description: "Connexion réussie",
        schema: AuthRegisterLoginResponseSchemaDto,
      },
      {
        status: 401,
        description: "Identifiants admin incorrects",
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

export function ApiRefreshToken() {
  return ApiDocumentation({
    operation: {
      summary: "Rafraîchir les tokens",
      description:
        "Commun au mobile et au back-office. Envoie `refresh_token` pour obtenir de nouveaux jetons.",
    },
    responses: [
      {
        status: 200,
        description: "Nouveaux tokens générés",
        schema: AuthRefreshResponseSchemaDto,
      },
      {
        status: 422,
        description: "Token manquant, invalide ou expiré",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}

export function ApiLogout() {
  return ApiDocumentation({
    operation: {
      summary: "Déconnexion",
      description:
        "Invalide le token d’accès (Authorization Bearer) et, si fourni, le `refresh_token`. " +
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
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}
