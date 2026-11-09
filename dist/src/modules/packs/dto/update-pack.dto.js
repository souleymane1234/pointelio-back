"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePackDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_pack_dto_1 = require("./create-pack.dto");
class UpdatePackDto extends (0, swagger_1.PartialType)(create_pack_dto_1.CreatePackDto) {
}
exports.UpdatePackDto = UpdatePackDto;
//# sourceMappingURL=update-pack.dto.js.map