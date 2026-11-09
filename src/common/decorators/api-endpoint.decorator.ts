import { applyDecorators } from "@nestjs/common";
import { ErrorResponseSchemaDto } from "../dto/response-schemas.dto";
import {
  SWAGGER_AUDIENCE_NOTE,
  type SwaggerAudience,
} from "../swagger/swagger-tags";
import { ApiAudience } from "./api-audience.decorator";
import { ApiDocumentation } from "./api-documentation.decorator";

type Schema = new (...args: unknown[]) => unknown;

const COMMON_ERRORS = [
  {
    status: 401,
    description: "Non authentifié",
    schema: ErrorResponseSchemaDto,
  },
  {
    status: 403,
    description: "Accès refusé (rôle, abonnement ou module)",
    schema: ErrorResponseSchemaDto,
  },
];

/**
 * Documentation Swagger d'un endpoint de module métier : succès + erreurs
 * communes (401, 403) + erreurs propres à l'endpoint.
 */
export function ApiEndpoint(config: {
  summary: string;
  description?: string;
  status?: number;
  schema?: Schema;
  notFound?: string;
  invalid?: string;
  audience?: SwaggerAudience | SwaggerAudience[];
}) {
  const audiences = config.audience
    ? Array.isArray(config.audience)
      ? config.audience
      : [config.audience]
    : [];
  const note = audiences.map((a) => SWAGGER_AUDIENCE_NOTE[a]).join(" ");
  const description = [note, config.description].filter(Boolean).join("\n\n");

  const docs = ApiDocumentation({
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
              schema: ErrorResponseSchemaDto,
            },
          ]
        : []),
      ...(config.invalid
        ? [
            {
              status: 422,
              description: config.invalid,
              schema: ErrorResponseSchemaDto,
            },
          ]
        : []),
    ],
  });

  return audiences.length > 0
    ? applyDecorators(ApiAudience(...audiences), docs)
    : docs;
}
