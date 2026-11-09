"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleRequis = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../constants/auth.constants");
const ModuleRequis = (...modules) => (0, common_1.SetMetadata)(auth_constants_1.MODULES_REQUIS_KEY, modules);
exports.ModuleRequis = ModuleRequis;
//# sourceMappingURL=module-requis.decorator.js.map