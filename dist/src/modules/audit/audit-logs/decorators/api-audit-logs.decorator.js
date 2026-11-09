"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiListAuditLogs = ApiListAuditLogs;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_schemas_dto_1 = require("../../../../common/dto/response-schemas.dto");
const audit_log_response_dto_1 = require("../dto/audit-log-response.dto");
const audit_logs_swagger_examples_1 = require("../dto/audit-logs.swagger-examples");
function ApiListAuditLogs() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: "Lister les logs d'audit (paginé)",
        description: "Journal des actions tracées (authentification, opérations admin, exports…). " +
            "Un admin d'entreprise ne voit que les logs de son entreprise ; l'équipe Pointelio voit tout et peut filtrer par `entrepriseId`. " +
            "Format `PaginatedResponse`. Statut **206 Partial Content** (spec API mobile).",
    }), (0, swagger_1.ApiExtraModels)(audit_log_response_dto_1.AuditLogsPaginatedResponseSchemaDto, response_schemas_dto_1.ErrorResponseSchemaDto), (0, swagger_1.ApiResponse)({
        status: 206,
        description: "Page de logs d'audit récupérée.",
        content: {
            "application/json": {
                schema: {
                    $ref: (0, swagger_1.getSchemaPath)(audit_log_response_dto_1.AuditLogsPaginatedResponseSchemaDto),
                },
                examples: audit_logs_swagger_examples_1.AUDIT_LOGS_LIST_RESPONSE_SWAGGER_EXAMPLES,
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Non authentifié",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Accès refusé",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }), (0, swagger_1.ApiResponse)({
        status: 422,
        description: "Paramètres invalides",
        schema: { $ref: (0, swagger_1.getSchemaPath)(response_schemas_dto_1.ErrorResponseSchemaDto) },
    }));
}
//# sourceMappingURL=api-audit-logs.decorator.js.map