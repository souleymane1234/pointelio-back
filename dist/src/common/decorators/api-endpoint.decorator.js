"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiEndpoint = ApiEndpoint;
const common_1 = require("@nestjs/common");
const response_schemas_dto_1 = require("../dto/response-schemas.dto");
const swagger_tags_1 = require("../swagger/swagger-tags");
const api_audience_decorator_1 = require("./api-audience.decorator");
const api_documentation_decorator_1 = require("./api-documentation.decorator");
const COMMON_ERRORS = [
    {
        status: 401,
        description: "Non authentifié",
        schema: response_schemas_dto_1.ErrorResponseSchemaDto,
    },
    {
        status: 403,
        description: "Accès refusé (rôle, abonnement ou module)",
        schema: response_schemas_dto_1.ErrorResponseSchemaDto,
    },
];
function ApiEndpoint(config) {
    const audiences = config.audience
        ? Array.isArray(config.audience)
            ? config.audience
            : [config.audience]
        : [];
    const note = audiences.map((a) => swagger_tags_1.SWAGGER_AUDIENCE_NOTE[a]).join(" ");
    const description = [note, config.description].filter(Boolean).join("\n\n");
    const docs = (0, api_documentation_decorator_1.ApiDocumentation)({
        operation: {
            summary: config.summary,
            ...(description ? { description } : {}),
        },
        responses: [
            {
                status: config.status ?? 200,
                description: config.summary,
                ...(config.schema ? { schema: config.schema } : {}),
            },
            ...COMMON_ERRORS,
            ...(config.notFound
                ? [
                    {
                        status: 404,
                        description: config.notFound,
                        schema: response_schemas_dto_1.ErrorResponseSchemaDto,
                    },
                ]
                : []),
            ...(config.invalid
                ? [
                    {
                        status: 422,
                        description: config.invalid,
                        schema: response_schemas_dto_1.ErrorResponseSchemaDto,
                    },
                ]
                : []),
        ],
    });
    return audiences.length > 0
        ? (0, common_1.applyDecorators)((0, api_audience_decorator_1.ApiAudience)(...audiences), docs)
        : docs;
}
//# sourceMappingURL=api-endpoint.decorator.js.map