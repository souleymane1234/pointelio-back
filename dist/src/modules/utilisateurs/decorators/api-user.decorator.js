"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiListUsers = ApiListUsers;
exports.ApiGetUser = ApiGetUser;
exports.ApiCreateUser = ApiCreateUser;
exports.ApiUpdateUser = ApiUpdateUser;
exports.ApiReaffecterUser = ApiReaffecterUser;
exports.ApiSuspendreUser = ApiSuspendreUser;
exports.ApiReactiverUser = ApiReactiverUser;
exports.ApiRenvoyerUser = ApiRenvoyerUser;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_schemas_dto_1 = require("../../../common/dto/response-schemas.dto");
const create_user_dto_1 = require("../dto/create-user.dto");
const create_user_swagger_examples_1 = require("../dto/create-user.swagger-examples");
const rh_actions_dto_1 = require("../dto/rh-actions.dto");
const update_user_dto_1 = require("../dto/update-user.dto");
const update_user_swagger_examples_1 = require("../dto/update-user.swagger-examples");
const user_response_dto_1 = require("../dto/user-response.dto");
function buildDecorator(config) {
    const schemaModels = config.responses
        .filter((r) => r.schema)
        .map((r) => r.schema);
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: config.summary, description: config.description }), ...(schemaModels.length > 0 ? [(0, swagger_1.ApiExtraModels)(...schemaModels)] : []), ...(config.queries ?? []).map((q) => (0, swagger_1.ApiQuery)({
        name: q.name,
        required: q.required ?? false,
        description: q.description,
        ...(q.enum && { enum: q.enum }),
    })), ...config.responses.map((r) => (0, swagger_1.ApiResponse)({
        status: r.status,
        description: r.description,
        ...(r.schema && {
            schema: { $ref: (0, swagger_1.getSchemaPath)(r.schema) },
        }),
    })));
}
function ApiListUsers() {
    return buildDecorator({
        summary: "Lister les utilisateurs",
        description: "Liste paginée des utilisateurs. Un admin d'entreprise ne voit que les comptes de son entreprise ; l'équipe Pointelio voit tout et peut filtrer par `entrepriseId`. Format `PaginatedResponse`, statut **206 Partial Content** (spec API mobile).",
        queries: [
            { name: "page", description: "Numéro de page (≥ 1)." },
            { name: "per_page", description: "Taille de page (1–50)." },
            {
                name: "search",
                description: "Recherche libre : nom, prénom, e-mail, téléphone ou matricule (contient).",
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
                schema: user_response_dto_1.UsersPaginatedResponseSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifié",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 403,
                description: "Accès refusé (rôle non autorisé)",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 422,
                description: "Paramètres invalides",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
function ApiGetUser() {
    return buildDecorator({
        summary: "Détail utilisateur",
        description: "Retourne un utilisateur avec son entreprise, son site et son horaire. 404 si le compte est hors du périmètre de l'acteur.",
        responses: [
            {
                status: 200,
                description: "Utilisateur récupéré",
                schema: user_response_dto_1.UserResponseSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifié",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 403,
                description: "Accès refusé (rôle non autorisé)",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 404,
                description: "Utilisateur introuvable",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
function ApiCreateUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({
        type: create_user_dto_1.CreateUserDto,
        examples: create_user_swagger_examples_1.USER_CREATE_SWAGGER_EXAMPLES,
        description: "Exemples par cas. Dans Swagger UI, ouvrir le menu **Examples** du body pour préremplir le JSON.",
    }), buildDecorator({
        summary: "Créer un utilisateur",
        description: "Crée un compte **actif immédiatement**. Téléphone et mot de passe obligatoires, e-mail facultatif. Aucun e-mail ni SMS n'est envoyé : l'administrateur transmet lui-même les identifiants. EMPLOYE : PIN + salaire journalier + site. Un admin d'entreprise ne crée que dans son entreprise.",
        responses: [
            {
                status: 201,
                description: "Utilisateur créé",
                schema: user_response_dto_1.UserResponseSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifié",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 403,
                description: "Accès refusé (rôle non autorisé)",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 422,
                description: "Données invalides, e-mail / téléphone / matricule déjà utilisé, rattachement invalide",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    }));
}
function ApiUpdateUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
        examples: update_user_swagger_examples_1.USER_UPDATE_SWAGGER_EXAMPLES,
        description: "Exemples : suspension, réactivation, changement de rôle, de rattachement ou de mot de passe — menu **Examples** dans Swagger UI.",
    }), buildDecorator({
        summary: "Modifier un utilisateur",
        description: "Mise à jour partielle. `password` réinitialise le PIN / mot de passe (pas de SMS ni d'OTP). Pour réaffecter, suspendre, réactiver ou renvoyer, préférer les endpoints dédiés.",
        responses: [
            {
                status: 200,
                description: "Utilisateur mis à jour",
                schema: user_response_dto_1.UserResponseSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifié",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 403,
                description: "Accès refusé (rôle non autorisé)",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 404,
                description: "Utilisateur introuvable",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 422,
                description: "Données invalides, corps vide, rattachement invalide ou contrainte d’unicité",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    }));
}
function rhResponses() {
    return [
        {
            status: 200,
            description: "Action effectuée",
            schema: user_response_dto_1.UserResponseSchemaDto,
        },
        {
            status: 401,
            description: "Non authentifié",
            schema: response_schemas_dto_1.ErrorResponseSchemaDto,
        },
        {
            status: 403,
            description: "Accès refusé (rôle non autorisé ou action sur soi-même)",
            schema: response_schemas_dto_1.ErrorResponseSchemaDto,
        },
        {
            status: 404,
            description: "Utilisateur introuvable",
            schema: response_schemas_dto_1.ErrorResponseSchemaDto,
        },
        {
            status: 422,
            description: "Compte déjà désactivé, rattachement invalide ou données invalides",
            schema: response_schemas_dto_1.ErrorResponseSchemaDto,
        },
    ];
}
function ApiReaffecterUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({ type: rh_actions_dto_1.ReaffecterEmployeDto }), buildDecorator({
        summary: "Réaffecter un employé",
        description: "Change le site de rattachement (et optionnellement l'horaire). Impossible sur son propre compte ou un compte déjà renvoyé.",
        responses: rhResponses(),
    }));
}
function ApiSuspendreUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({ type: rh_actions_dto_1.MotifRhDto, required: false }), buildDecorator({
        summary: "Suspendre un employé",
        description: "Passe le compte à SUSPENDU (plus de connexion). Le motif est enregistré dans l'audit. Impossible sur soi-même ou un compte renvoyé.",
        responses: rhResponses(),
    }));
}
function ApiReactiverUser() {
    return buildDecorator({
        summary: "Réactiver un employé",
        description: "Passe le compte à ACTIF. Un employé renvoyé (DESACTIVE) ne peut pas être réactivé depuis ici.",
        responses: rhResponses(),
    });
}
function ApiRenvoyerUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({ type: rh_actions_dto_1.MotifRhDto, required: false }), buildDecorator({
        summary: "Renvoyer un employé",
        description: "Passe le compte à DESACTIVE : plus de connexion, le poste n'est plus décompté dans le pack. Le motif est enregistré dans l'audit. Action définitive côté RH (pas de réactivation ici).",
        responses: rhResponses(),
    }));
}
//# sourceMappingURL=api-user.decorator.js.map