"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LOCALE = exports.SUPPORTED_LOCALES = void 0;
exports.normalizeLocale = normalizeLocale;
exports.SUPPORTED_LOCALES = ["fr", "en"];
exports.DEFAULT_LOCALE = "fr";
function normalizeLocale(header) {
    const l = String(header ?? "")
        .trim()
        .toLowerCase();
    if (l.startsWith("en"))
        return "en";
    return "fr";
}
//# sourceMappingURL=locale.js.map