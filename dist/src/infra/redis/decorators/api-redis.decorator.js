"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAdminRedisFlushCache = ApiAdminRedisFlushCache;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_schemas_dto_1 = require("../../../common/dto/response-schemas.dto");
function ApiAdminRedisFlushCache() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(response_schemas_dto_1.ErrorResponseSchemaDto), (0, swagger_1.ApiOperation)({
        summary: "Vider le cache Redis",
        description: "Vide le cache Keyv (`keyv::*` via cache-manager) ainsi que les clés directes (`<REDIS_KEY_PREFIX>:*` verrous, `throttler:*`). Incrémente les générations de cache en mémoire. Réservé aux administrateurs.",
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Cache Redis vidé",
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
        description: "Redis indisponible",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }));
}
//# sourceMappingURL=api-redis.decorator.js.map