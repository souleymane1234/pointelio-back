import { applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { ErrorResponseSchemaDto } from "../../../../common/dto/response-schemas.dto";
import { AuditLogsPaginatedResponseSchemaDto } from "../dto/audit-log-response.dto";
import { AUDIT_LOGS_LIST_RESPONSE_SWAGGER_EXAMPLES } from "../dto/audit-logs.swagger-examples";

export function ApiListAuditLogs() {
  return applyDecorators(
    ApiOperation({
      summary: "Lister les logs d'audit (paginé)",
      description:
        "Journal des actions tracées (authentification, opérations admin, exports…). " +
        "Un admin d'entreprise ne voit que les logs de son entreprise ; l'équipe Pointelio voit tout et peut filtrer par `entrepriseId`. " +
        "Format `PaginatedResponse`. Statut **206 Partial Content** (spec API mobile).",
    }),
    ApiExtraModels(AuditLogsPaginatedResponseSchemaDto, ErrorResponseSchemaDto),
    ApiResponse({
      status: 206,
      description: "Page de logs d'audit récupérée.",
      content: {
        "application/json": {
          schema: {
            $ref: getSchemaPath(AuditLogsPaginatedResponseSchemaDto),
          },
          examples: AUDIT_LOGS_LIST_RESPONSE_SWAGGER_EXAMPLES,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: "Non authentifié",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
    ApiResponse({
      status: 403,
      description: "Accès refusé",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
    ApiResponse({
      status: 422,
      description: "Paramètres invalides",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
  );
}
