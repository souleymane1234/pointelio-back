import { applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiHeaders,
  getSchemaPath,
} from "@nestjs/swagger";

interface ResponseConfig {
  status: number;
  description: string;
  schema?: new (...args: unknown[]) => unknown;
}

interface EndpointDocumentation {
  operation: {
    summary: string;
    description?: string;
  };
  responses: ResponseConfig[];
  headers?: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
  extra?: (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => void;
}

export function ApiDocumentation(config: EndpointDocumentation) {
  const schemaModels = config.responses
    .filter((r) => r.schema)
    .map((r) => r.schema as new (...args: unknown[]) => unknown);

  const decorators = [
    ApiOperation(config.operation),
    ...(schemaModels.length > 0 ? [ApiExtraModels(...schemaModels)] : []),
    ...config.responses.map((response) =>
      ApiResponse({
        status: response.status,
        description: response.description,
        ...(response.schema && {
          schema: { $ref: getSchemaPath(response.schema as never) },
        }),
      }),
    ),
  ];

  if (config.headers && config.headers.length > 0) {
    decorators.push(ApiHeaders(config.headers));
  }

  if (config.extra) {
    decorators.push(config.extra);
  }

  return applyDecorators(...decorators);
}

// Décorateurs pré-configurés pour chaque endpoint
