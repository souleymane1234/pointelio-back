"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePointageId = parsePointageId;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../../common/i18n");
function parsePointageId(raw, locale) {
    if (!/^\d+$/.test(raw)) {
        throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "pointageNotFound"));
    }
    return BigInt(raw);
}
//# sourceMappingURL=parse-pointage-id.js.map