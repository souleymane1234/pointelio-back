"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAdminSendNotificationToUser = ApiAdminSendNotificationToUser;
exports.ApiAdminSendNotificationToRole = ApiAdminSendNotificationToRole;
exports.ApiAdminListSentNotifications = ApiAdminListSentNotifications;
exports.ApiAdminGetSentNotification = ApiAdminGetSentNotification;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const response_schemas_dto_1 = require("../../../../common/dto/response-schemas.dto");
const admin_sent_notifications_response_dto_1 = require("../dto/admin-sent-notifications-response.dto");
function withCommonResponses() {
    return [
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: "Notification envoyee",
        }),
        (0, swagger_1.ApiResponse)({
            status: 401,
            description: "Non authentifie",
            schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
        }),
        (0, swagger_1.ApiResponse)({
            status: 403,
            description: "Accès refusé (rôle non autorisé)",
            schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
        }),
        (0, swagger_1.ApiResponse)({
            status: 422,
            description: "Corps invalide",
            schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
        }),
    ];
}
function ApiAdminSendNotificationToUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(response_schemas_dto_1.ErrorResponseSchemaDto), (0, swagger_1.ApiOperation)({
        summary: "Envoyer une notification à un utilisateur",
        description: "Notification in-app + temps réel (Socket.IO). Le destinataire doit être actif et, pour un admin d'entreprise, appartenir à son entreprise.",
    }), (0, swagger_1.ApiParam)({
        name: "userId",
        description: "Identifiant de l'utilisateur destinataire",
        example: 12,
    }), ...withCommonResponses(), (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Utilisateur introuvable",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }));
}
function ApiAdminSendNotificationToRole() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(response_schemas_dto_1.ErrorResponseSchemaDto), (0, swagger_1.ApiOperation)({
        summary: "Envoyer une notification à un rôle",
        description: "Notifie les comptes actifs du rôle. Un admin d'entreprise cible uniquement son entreprise ; l'équipe Pointelio peut limiter l'envoi avec `entrepriseId` dans le corps.",
    }), (0, swagger_1.ApiParam)({
        name: "role",
        enum: client_1.Role,
        description: "Role cible",
    }), ...withCommonResponses());
}
function ApiAdminListSentNotifications() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(response_schemas_dto_1.ErrorResponseSchemaDto), (0, swagger_1.ApiOperation)({
        summary: "Lister les notifications admin envoyées",
        description: "Historique des envois depuis le backoffice (utilisateur ou rôle), lu depuis les logs d'audit `NOTIFICATION_ENVOYEE`. Cloisonné par entreprise pour un admin d'entreprise.",
    }), (0, swagger_1.ApiResponse)({
        status: 206,
        description: "Liste paginée récupérée.",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(admin_sent_notifications_response_dto_1.AdminSentNotificationsPaginatedResponseSchemaDto),
        },
    }), ...withCommonResponses());
}
function ApiAdminGetSentNotification() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(response_schemas_dto_1.ErrorResponseSchemaDto), (0, swagger_1.ApiOperation)({
        summary: "Détail d'une notification admin envoyée",
        description: "`campaignId` = identifiant du log d'audit de l'envoi.",
    }), (0, swagger_1.ApiParam)({
        name: "campaignId",
        description: "Identifiant de l'envoi",
        example: "1024",
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Détail récupéré.",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(admin_sent_notifications_response_dto_1.AdminSentNotificationDetailResponseSchemaDto),
        },
    }), ...withCommonResponses(), (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Campagne introuvable (`adminSentNotificationNotFound`).",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }));
}
//# sourceMappingURL=api-campaigns.decorator.js.map