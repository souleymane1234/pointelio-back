import { applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { ErrorResponseSchemaDto } from "../../../common/dto/response-schemas.dto";

export function ApiAdminRedisFlushCache() {
  return applyDecorators(
    ApiExtraModels(ErrorResponseSchemaDto),
    ApiOperation({
      summary: "Vider le cache Redis",
      description:
        "Vide le cache Keyv (`keyv::*` via cache-manager) ainsi que les clés directes (`<REDIS_KEY_PREFIX>:*` verrous, `throttler:*`). Incrémente les générations de cache en mémoire. Réservé aux administrateurs.",
    }),
    ApiResponse({
      status: 200,
      description: "Cache Redis vidé",
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
      description: "Redis indisponible",
      schema: { $ref: getSchemaPath(ErrorResponseSchemaDto) },
    }),
  );
}
