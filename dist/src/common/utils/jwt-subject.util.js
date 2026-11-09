"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJwtUserId = parseJwtUserId;
function parseJwtUserId(sub) {
    const id = typeof sub === "string" ? Number(sub) : Number.NaN;
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}
//# sourceMappingURL=jwt-subject.util.js.map