import { applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { ErrorResponseSchemaDto } from "../../../../common/dto/response-schemas.dto";

export function ApiAdminSendEmail() {
  return applyDecorators(
    ApiExtraModels(ErrorResponseSchemaDto),
    ApiOperation({
      summary: "Envoyer un e-mail (utilisateurs et/ou adresses de test)",
      description:
        "Destinataires : `userIds` (e-mails résolus en base) et/ou `emails` (libres, pour les tests). Au moins un des deux est requis. Le corps du message exige `text` et/ou `html`.",
    }),
    ApiResponse({
      status: 200,
      description: "E-mail accepté par le relais SMTP",
    }),
    ApiResponse({
      status: 400,
      description: "Corps invalide ou utilisateur introuvable",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
    ApiResponse({
      status: 401,
      description: "Non authentifié",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
    ApiResponse({
      status: 403,
      description: "Accès refusé (admin requis)",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
    ApiResponse({
      status: 503,
      description: "Service e-mail indisponible (SMTP non configuré)",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
  );
}
