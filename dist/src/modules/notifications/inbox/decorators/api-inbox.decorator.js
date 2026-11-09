"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiListNotifications = ApiListNotifications;
exports.ApiGetNotification = ApiGetNotification;
exports.ApiMarkNotificationRead = ApiMarkNotificationRead;
exports.ApiMarkAllNotificationsRead = ApiMarkAllNotificationsRead;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_schemas_dto_1 = require("../../../../common/dto/response-schemas.dto");
const notification_response_dto_1 = require("../dto/notification-response.dto");
function buildDecorator(config) {
    const schemaModels = config.responses
        .filter((response) => response.schema)
        .map((response) => response.schema);
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: config.summary, description: config.description }), ...(schemaModels.length > 0 ? [(0, swagger_1.ApiExtraModels)(...schemaModels)] : []), ...(config.queries ?? []).map((query) => (0, swagger_1.ApiQuery)({
        name: query.name,
        required: query.required ?? false,
        description: query.description,
        ...(query.enum && { enum: query.enum }),
    })), ...config.responses.map((response) => (0, swagger_1.ApiResponse)({
        status: response.status,
        description: response.description,
        ...(response.schema && {
            schema: { $ref: (0, swagger_1.getSchemaPath)(response.schema) },
        }),
    })));
}
function ApiListNotifications() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: "Lister mes notifications (pagine)",
        description: "Retourne la liste paginée des notifications de l'utilisateur authentifié, avec filtres optionnels. Le champ `count` indique le nombre de notifications non lues (badge).",
    }), (0, swagger_1.ApiExtraModels)(notification_response_dto_1.NotificationsPaginatedResponseSchemaDto), (0, swagger_1.ApiQuery)({
        name: "page",
        required: false,
        description: "Numero de page (>= 1).",
    }), (0, swagger_1.ApiQuery)({
        name: "per_page",
        required: false,
        description: "Taille de page (1-50).",
    }), (0, swagger_1.ApiQuery)({
        name: "lu",
        required: false,
        description: "true | false",
        enum: ["true", "false"],
    }), (0, swagger_1.ApiQuery)({
        name: "type",
        required: false,
        description: "Filtre par type de notification (ex. ADMIN_BROADCAST).",
    }), (0, swagger_1.ApiResponse)({
        status: 206,
        description: "Page de notifications recuperee",
        content: {
            "application/json": {
                schema: {
                    $ref: (0, swagger_1.getSchemaPath)(notification_response_dto_1.NotificationsPaginatedResponseSchemaDto),
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Non authentifie",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }), (0, swagger_1.ApiResponse)({
        status: 422,
        description: "Parametres invalides",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }));
}
function ApiGetNotification() {
    return buildDecorator({
        summary: "Detail d'une notification",
        description: "Retourne une notification appartenant à l'utilisateur authentifié.",
        responses: [
            {
                status: 200,
                description: "Notification recuperee",
                schema: notification_response_dto_1.NotificationResponseSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifie",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 404,
                description: "Notification introuvable",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
function ApiMarkNotificationRead() {
    return buildDecorator({
        summary: "Marquer une notification comme lue",
        description: "Renseigne `luAt` (date de lecture) pour une notification de l'utilisateur authentifié.",
        responses: [
            {
                status: 200,
                description: "Notification marquee comme lue",
                schema: notification_response_dto_1.NotificationResponseSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifie",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
            {
                status: 404,
                description: "Notification introuvable",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
function ApiMarkAllNotificationsRead() {
    return buildDecorator({
        summary: "Marquer toutes mes notifications comme lues",
        description: "Marque toutes les notifications non lues de l'utilisateur authentifie.",
        responses: [
            {
                status: 200,
                description: "Notifications marquees comme lues",
                schema: notification_response_dto_1.MarkAllNotificationsReadSchemaDto,
            },
            {
                status: 401,
                description: "Non authentifie",
                schema: response_schemas_dto_1.ErrorResponseSchemaDto,
            },
        ],
    });
}
//# sourceMappingURL=api-inbox.decorator.js.map