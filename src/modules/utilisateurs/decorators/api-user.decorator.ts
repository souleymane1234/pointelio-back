import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { ErrorResponseSchemaDto } from "../../../common/dto/response-schemas.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { USER_CREATE_SWAGGER_EXAMPLES } from "../dto/create-user.swagger-examples";
import { MotifRhDto, ReaffecterEmployeDto } from "../dto/rh-actions.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { USER_UPDATE_SWAGGER_EXAMPLES } from "../dto/update-user.swagger-examples";
import {
  UserResponseSchemaDto,
  UsersPaginatedResponseSchemaDto,
} from "../dto/user-response.dto";

interface QueryConfig {
  name: string;
  description: string;
  required?: boolean;
  enum?: string[];
}

function buildDecorator(config: {
  summary: string;
  description?: string;
  queries?: QueryConfig[];
  responses: Array<{
    status: number;
    description: string;
    schema?: new (...args: unknown[]) => unknown;
  }>;
}) {
  const schemaModels = config.responses
    .filter((r) => r.schema)
    .map((r) => r.schema as new (...args: unknown[]) => unknown);

  return applyDecorators(
    ApiOperation({ summary: config.summary, description: config.description }),
    ...(schemaModels.length > 0 ? [ApiExtraModels(...schemaModels)] : []),
    ...(config.queries ?? []).map((q) =>
      ApiQuery({
        name: q.name,
        required: q.required ?? false,
        description: q.description,
        ...(q.enum && { enum: q.enum }),
      }),
    ),
    ...config.responses.map((r) =>
      ApiResponse({
        status: r.status,
        description: r.description,
        ...(r.schema && {
          schema: { $ref: getSchemaPath(r.schema as never) },
        }),
      }),
    ),
  );
}

export function ApiListUsers() {
  return buildDecorator({
    summary: "Lister les utilisateurs",
    description:
      "Liste paginée des utilisateurs. Un admin d'entreprise ne voit que les comptes de son entreprise ; l'équipe Pointelio voit tout et peut filtrer par `entrepriseId`. Format `PaginatedResponse`, statut **206 Partial Content** (spec API mobile).",
    queries: [
      { name: "page", description: "Numéro de page (≥ 1)." },
      { name: "per_page", description: "Taille de page (1–50)." },
      {
        name: "search",
        description:
          "Recherche libre : nom, prénom, e-mail, téléphone ou matricule (contient).",
      },
      { name: "statut", description: "Statut du compte." },
      { name: "role", description: "Rôle utilisateur." },
      { name: "entrepriseId", description: "Équipe Pointelio uniquement." },
      { name: "siteId", description: "Site de rattachement." },
    ],
    responses: [
      {
        status: 206,
        description: "Page récupérée",
        schema: UsersPaginatedResponseSchemaDto,
      },
      {
        status: 401,
        description: "Non authentifié",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 403,
        description: "Accès refusé (rôle non autorisé)",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 422,
        description: "Paramètres invalides",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}

export function ApiGetUser() {
  return buildDecorator({
    summary: "Détail utilisateur",
    description:
      "Retourne un utilisateur avec son entreprise, son site et son horaire. 404 si le compte est hors du périmètre de l'acteur.",
    responses: [
      {
        status: 200,
        description: "Utilisateur récupéré",
        schema: UserResponseSchemaDto,
      },
      {
        status: 401,
        description: "Non authentifié",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 403,
        description: "Accès refusé (rôle non autorisé)",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 404,
        description: "Utilisateur introuvable",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}

export function ApiCreateUser() {
  return applyDecorators(
    ApiBody({
      type: CreateUserDto,
      examples: USER_CREATE_SWAGGER_EXAMPLES,
      description:
        "Exemples par cas. Dans Swagger UI, ouvrir le menu **Examples** du body pour préremplir le JSON.",
    }),
    buildDecorator({
      summary: "Créer un utilisateur",
      description:
        "Crée un compte **actif immédiatement**. Téléphone et mot de passe obligatoires, e-mail facultatif. Aucun e-mail ni SMS n'est envoyé : l'administrateur transmet lui-même les identifiants. EMPLOYE : PIN + salaire journalier + site. Un admin d'entreprise ne crée que dans son entreprise.",
      responses: [
        {
          status: 201,
          description: "Utilisateur créé",
          schema: UserResponseSchemaDto,
        },
        {
          status: 401,
          description: "Non authentifié",
          schema: ErrorResponseSchemaDto,
        },
        {
          status: 403,
          description: "Accès refusé (rôle non autorisé)",
          schema: ErrorResponseSchemaDto,
        },
        {
          status: 422,
          description:
            "Données invalides, e-mail / téléphone / matricule déjà utilisé, rattachement invalide",
          schema: ErrorResponseSchemaDto,
        },
      ],
    }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiBody({
      type: UpdateUserDto,
      examples: USER_UPDATE_SWAGGER_EXAMPLES,
      description:
        "Exemples : suspension, réactivation, changement de rôle, de rattachement ou de mot de passe — menu **Examples** dans Swagger UI.",
    }),
    buildDecorator({
      summary: "Modifier un utilisateur",
      description:
        "Mise à jour partielle. `password` réinitialise le PIN / mot de passe (pas de SMS ni d'OTP). Pour réaffecter, suspendre, réactiver ou renvoyer, préférer les endpoints dédiés.",
      responses: [
        {
          status: 200,
          description: "Utilisateur mis à jour",
          schema: UserResponseSchemaDto,
        },
        {
          status: 401,
          description: "Non authentifié",
          schema: ErrorResponseSchemaDto,
        },
        {
          status: 403,
          description: "Accès refusé (rôle non autorisé)",
          schema: ErrorResponseSchemaDto,
        },
        {
          status: 404,
          description: "Utilisateur introuvable",
          schema: ErrorResponseSchemaDto,
        },
        {
          status: 422,
          description:
            "Données invalides, corps vide, rattachement invalide ou contrainte d’unicité",
          schema: ErrorResponseSchemaDto,
        },
      ],
    }),
  );
}

function rhResponses() {
  return [
    {
      status: 200,
      description: "Action effectuée",
      schema: UserResponseSchemaDto,
    },
    {
      status: 401,
      description: "Non authentifié",
      schema: ErrorResponseSchemaDto,
    },
    {
      status: 403,
      description: "Accès refusé (rôle non autorisé ou action sur soi-même)",
      schema: ErrorResponseSchemaDto,
    },
    {
      status: 404,
      description: "Utilisateur introuvable",
      schema: ErrorResponseSchemaDto,
    },
    {
      status: 422,
      description:
        "Compte déjà désactivé, rattachement invalide ou données invalides",
      schema: ErrorResponseSchemaDto,
    },
  ];
}

export function ApiReaffecterUser() {
  return applyDecorators(
    ApiBody({ type: ReaffecterEmployeDto }),
    buildDecorator({
      summary: "Réaffecter un employé",
      description:
        "Change le site de rattachement (et optionnellement l'horaire). Impossible sur son propre compte ou un compte déjà renvoyé.",
      responses: rhResponses(),
    }),
  );
}

export function ApiSuspendreUser() {
  return applyDecorators(
    ApiBody({ type: MotifRhDto, required: false }),
    buildDecorator({
      summary: "Suspendre un employé",
      description:
        "Passe le compte à SUSPENDU (plus de connexion). Le motif est enregistré dans l'audit. Impossible sur soi-même ou un compte renvoyé.",
      responses: rhResponses(),
    }),
  );
}

export function ApiReactiverUser() {
  return buildDecorator({
    summary: "Réactiver un employé",
    description:
      "Passe le compte à ACTIF. Un employé renvoyé (DESACTIVE) ne peut pas être réactivé depuis ici.",
    responses: rhResponses(),
  });
}

export function ApiRenvoyerUser() {
  return applyDecorators(
    ApiBody({ type: MotifRhDto, required: false }),
    buildDecorator({
      summary: "Renvoyer un employé",
      description:
        "Passe le compte à DESACTIVE : plus de connexion, le poste n'est plus décompté dans le pack. Le motif est enregistré dans l'audit. Action définitive côté RH (pas de réactivation ici).",
      responses: rhResponses(),
    }),
  );
}
