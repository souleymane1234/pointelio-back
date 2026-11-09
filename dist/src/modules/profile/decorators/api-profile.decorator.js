"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiProfileMe = ApiProfileMe;
exports.ApiChangePassword = ApiChangePassword;
exports.ApiUpdateProfile = ApiUpdateProfile;
const api_documentation_decorator_1 = require("../../../common/decorators/api-documentation.decorator");
const response_schemas_dto_1 = require("../../../common/dto/response-schemas.dto");
const profile_response_dto_1 = require("../dto/profile-response.dto");
function ApiProfileMe() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "Mon profil",
            description: "Profil de l'utilisateur authentifié (mobile et back-office).",
        },
        responses: [
            {
                status: 200,
                description: "Profil récupéré",
                schema: profile_response_dto_1.ProfileMeResponseSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifié",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
function ApiChangePassword() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "Modifier mon mot de passe",
            description: "Vérifie le mot de passe actuel puis le remplace. EMPLOYE / SURVEILLANT : nouveau PIN de 4 chiffres (ou 8 caractères min.) ; autres rôles : 8 caractères min.",
        },
        responses: [
            { status: 200, description: "Mot de passe modifié" },
            {
                status: 401,
                description: "Non authentifié",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 422,
                description: "Mot de passe actuel incorrect, nouveau mot de passe non conforme ou identique",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
function ApiUpdateProfile() {
    return (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: "Mettre à jour mon profil",
            description: "Met à jour son propre profil : nom, prenom, email, photoUrl (tous facultatifs). Le mot de passe / PIN se change via `PATCH /profile/me/password`. Téléphone, rôle et rattachement sont gérés par un administrateur.",
        },
        responses: [
            {
                status: 200,
                description: "Profil mis à jour",
                schema: profile_response_dto_1.ProfileMeResponseSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifié",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 422,
                description: "Données invalides (validation / email déjà utilisé)",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
//# sourceMappingURL=api-profile.decorator.js.map