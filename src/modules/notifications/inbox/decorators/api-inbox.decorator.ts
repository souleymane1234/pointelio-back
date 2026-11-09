import { applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { ErrorResponseSchemaDto } from "../../../../common/dto/response-schemas.dto";
import {
  MarkAllNotificationsReadSchemaDto,
  NotificationResponseSchemaDto,
  NotificationsPaginatedResponseSchemaDto,
} from "../dto/notification-response.dto";

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
    .filter((response) => response.schema)
    .map((response) => response.schema as new (...args: unknown[]) => unknown);

  return applyDecorators(
    ApiOperation({ summary: config.summary, description: config.description }),
    ...(schemaModels.length > 0 ? [ApiExtraModels(...schemaModels)] : []),
    ...(config.queries ?? []).map((query) =>
      ApiQuery({
        name: query.name,
        required: query.required ?? false,
        description: query.description,
        ...(query.enum && { enum: query.enum }),
      }),
    ),
    ...config.responses.map((response) =>
      ApiResponse({
        status: response.status,
        description: response.description,
        ...(response.schema && {
          schema: { $ref: getSchemaPath(response.schema as never) },
        }),
      }),
    ),
  );
}

export function ApiListNotifications() {
  return applyDecorators(
    ApiOperation({
      summary: "Lister mes notifications (pagine)",
      description:
        "Retourne la liste paginée des notifications de l'utilisateur authentifié, avec filtres optionnels. Le champ `count` indique le nombre de notifications non lues (badge).",
    }),
    ApiExtraModels(NotificationsPaginatedResponseSchemaDto),
    ApiQuery({
      name: "page",
      required: false,
      description: "Numero de page (>= 1).",
    }),
    ApiQuery({
      name: "per_page",
      required: false,
      description: "Taille de page (1-50).",
    }),
    ApiQuery({
      name: "lu",
      required: false,
      description: "true | false",
      enum: ["true", "false"],
    }),
    ApiQuery({
      name: "type",
      required: false,
      description: "Filtre par type de notification (ex. ADMIN_BROADCAST).",
    }),
    ApiResponse({
      status: 206,
      description: "Page de notifications recuperee",
      content: {
        "application/json": {
          schema: {
            $ref: getSchemaPath(NotificationsPaginatedResponseSchemaDto),
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: "Non authentifie",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
    ApiResponse({
      status: 422,
      description: "Parametres invalides",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
  );
}

export function ApiGetNotification() {
  return buildDecorator({
    summary: "Detail d'une notification",
    description:
      "Retourne une notification appartenant à l'utilisateur authentifié.",
    responses: [
      {
        status: 200,
        description: "Notification recuperee",
        schema: NotificationResponseSchemaDto,
      },
      {
        status: 401,
        description: "Non authentifie",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 404,
        description: "Notification introuvable",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}

export function ApiMarkNotificationRead() {
  return buildDecorator({
    summary: "Marquer une notification comme lue",
    description:
      "Renseigne `luAt` (date de lecture) pour une notification de l'utilisateur authentifié.",
    responses: [
      {
        status: 200,
        description: "Notification marquee comme lue",
        schema: NotificationResponseSchemaDto,
      },
      {
        status: 401,
        description: "Non authentifie",
        schema: ErrorResponseSchemaDto,
      },
      {
        status: 404,
        description: "Notification introuvable",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}

export function ApiMarkAllNotificationsRead() {
  return buildDecorator({
    summary: "Marquer toutes mes notifications comme lues",
    description:
      "Marque toutes les notifications non lues de l'utilisateur authentifie.",
    responses: [
      {
        status: 200,
        description: "Notifications marquees comme lues",
        schema: MarkAllNotificationsReadSchemaDto,
      },
      {
        status: 401,
        description: "Non authentifie",
        schema: ErrorResponseSchemaDto,
      },
    ],
  });
}
