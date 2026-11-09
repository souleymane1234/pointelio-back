import { ApiDocumentation } from "../../../common/decorators/api-documentation.decorator";
import { ErrorResponseSchemaDto } from "../../../common/dto/response-schemas.dto";
import { ProfileMeResponseSchemaDto } from "../dto/profile-response.dto";

export function ApiProfileMe() {
  return ApiDocumentation({
    operation: {
      summary: "Mon profil",
      description:
        "Profil de l'utilisateur authentifié (mobile et back-office).",
    },
    responses: [
      {
        status: 200,
        description: "Profil récupéré",
        schema: ProfileMeResponseSchemaDto,
      },
      {
        status: 401,
        description: "Non authentifié",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}

export function ApiChangePassword() {
  return ApiDocumentation({
    operation: {
      summary: "Modifier mon mot de passe",
      description:
        "Vérifie le mot de passe actuel puis le remplace. EMPLOYE / SURVEILLANT : nouveau PIN de 4 chiffres (ou 8 caractères min.) ; autres rôles : 8 caractères min.",
    },
    responses: [
      { status: 200, description: "Mot de passe modifié" },
      {
        status: 401,
        description: "Non authentifié",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 422,
        description:
          "Mot de passe actuel incorrect, nouveau mot de passe non conforme ou identique",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}

export function ApiUpdateProfile() {
  return ApiDocumentation({
    operation: {
      summary: "Mettre à jour mon profil",
      description:
        "Met à jour son propre profil : nom, prenom, email, photoUrl (tous facultatifs). Le mot de passe / PIN se change via `PATCH /profile/me/password`. Téléphone, rôle et rattachement sont gérés par un administrateur.",
    },
    responses: [
      {
        status: 200,
        description: "Profil mis à jour",
        schema: ProfileMeResponseSchemaDto,
      },
      {
        status: 401,
        description: "Non authentifié",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 422,
        description: "Données invalides (validation / email déjà utilisé)",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}
