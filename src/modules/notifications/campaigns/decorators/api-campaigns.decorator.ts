import { applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiParam,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { ErrorResponseSchemaDto } from "../../../../common/dto/response-schemas.dto";
import {
  AdminSentNotificationDetailResponseSchemaDto,
  AdminSentNotificationsPaginatedResponseSchemaDto,
} from "../dto/admin-sent-notifications-response.dto";

function withCommonResponses() {
  return [
    ApiResponse({
      status: 200,
      description: "Notification envoyee",
    }),
    ApiResponse({
      status: 401,
      description: "Non authentifie",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
    ApiResponse({
      status: 403,
      description: "Accès refusé (rôle non autorisé)",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
    ApiResponse({
      status: 422,
      description: "Corps invalide",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
  ];
}

export function ApiAdminSendNotificationToUser() {
  return applyDecorators(
    ApiExtraModels(ErrorResponseSchemaDto),
    ApiOperation({
      summary: "Envoyer une notification à un utilisateur",
      description:
        "Notification in-app + temps réel (Socket.IO). Le destinataire doit être actif et, pour un admin d'entreprise, appartenir à son entreprise.",
    }),
    ApiParam({
      name: "userId",
      description: "Identifiant de l'utilisateur destinataire",
      example: 12,
    }),
    ...withCommonResponses(),
    ApiResponse({
      status: 404,
      description: "Utilisateur introuvable",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
  );
}

export function ApiAdminSendNotificationToRole() {
  return applyDecorators(
    ApiExtraModels(ErrorResponseSchemaDto),
    ApiOperation({
      summary: "Envoyer une notification à un rôle",
      description:
        "Notifie les comptes actifs du rôle. Un admin d'entreprise cible uniquement son entreprise ; l'équipe Pointelio peut limiter l'envoi avec `entrepriseId` dans le corps.",
    }),
    ApiParam({
      name: "role",
      enum: Role,
      description: "Role cible",
    }),
    ...withCommonResponses(),
  );
}

export function ApiAdminListSentNotifications() {
  return applyDecorators(
    ApiExtraModels(ErrorResponseSchemaDto),
    ApiOperation({
      summary: "Lister les notifications admin envoyées",
      description:
        "Historique des envois depuis le backoffice (utilisateur ou rôle), lu depuis les logs d'audit `NOTIFICATION_ENVOYEE`. Cloisonné par entreprise pour un admin d'entreprise.",
    }),
    ApiResponse({
      status: 206,
      description: "Liste paginée récupérée.",
      schema: {
        $ref: getSchemaPath(AdminSentNotificationsPaginatedResponseSchemaDto),
      },
    }),
    ...withCommonResponses(),
  );
}

export function ApiAdminGetSentNotification() {
  return applyDecorators(
    ApiExtraModels(ErrorResponseSchemaDto),
    ApiOperation({
      summary: "Détail d'une notification admin envoyée",
      description: "`campaignId` = identifiant du log d'audit de l'envoi.",
    }),
    ApiParam({
      name: "campaignId",
      description: "Identifiant de l'envoi",
      example: "1024",
    }),
    ApiResponse({
      status: 200,
      description: "Détail récupéré.",
      schema: {
        $ref: getSchemaPath(AdminSentNotificationDetailResponseSchemaDto),
      },
    }),
    ...withCommonResponses(),
    ApiResponse({
      status: 404,
      description: "Campagne introuvable (`adminSentNotificationNotFound`).",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
  );
}
