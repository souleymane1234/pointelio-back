"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAudience = ApiAudience;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_tags_1 = require("../swagger/swagger-tags");
function ApiAudience(...audiences) {
    const unique = [...new Set(audiences)];
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(...unique.map((audience) => swagger_tags_1.SWAGGER_TAG[audience])), (0, swagger_1.ApiExtension)("x-audience", unique));
}
//# sourceMappingURL=api-audience.decorator.js.map