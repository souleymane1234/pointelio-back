"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAdminSendEmail = ApiAdminSendEmail;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_schemas_dto_1 = require("../../../../common/dto/response-schemas.dto");
function ApiAdminSendEmail() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(response_schemas_dto_1.ErrorResponseSchemaDto), (0, swagger_1.ApiOperation)({
        summary: "Envoyer un e-mail (utilisateurs et/ou adresses de test)",
        description: "Destinataires : `userIds` (e-mails résolus en base) et/ou `emails` (libres, pour les tests). Au moins un des deux est requis. Le corps du message exige `text` et/ou `html`.",
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: "E-mail accepté par le relais SMTP",
    }), (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Corps invalide ou utilisateur introuvable",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Non authentifié",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Accès refusé (admin requis)",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }), (0, swagger_1.ApiResponse)({
        status: 503,
        description: "Service e-mail indisponible (SMTP non configuré)",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }));
}
//# sourceMappingURL=api-admin-emailing.decorator.js.map