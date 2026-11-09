"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDocumentation = ApiDocumentation;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function ApiDocumentation(config) {
    const schemaModels = config.responses
        .filter((r) => r.schema)
        .map((r) => r.schema);
    const decorators = [
        (0, swagger_1.ApiOperation)(config.operation),
        ...(schemaModels.length > 0 ? [(0, swagger_1.ApiExtraModels)(...schemaModels)] : []),
        ...config.responses.map((response) => (0, swagger_1.ApiResponse)({
            status: response.status,
            description: response.description,
            ...(response.schema && {
                schema: { $ref: (0, swagger_1.getSchemaPath)(response.schema) },
            }),
        })),
    ];
    if (config.headers && config.headers.length > 0) {
        decorators.push((0, swagger_1.ApiHeaders)(config.headers));
    }
    if (config.extra) {
        decorators.push(config.extra);
    }
    return (0, common_1.applyDecorators)(...decorators);
}
//# sourceMappingURL=api-documentation.decorator.js.map