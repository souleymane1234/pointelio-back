"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractValidationMessages = exports.DEFAULT_VALIDATION_MESSAGE = void 0;
exports.validationMessage = validationMessage;
exports.localizeValidationMessage = localizeValidationMessage;
exports.localizeValidationBody = localizeValidationBody;
const i18n_1 = require("../i18n");
const fr_json_1 = __importDefault(require("../i18n/locales/fr.json"));
exports.DEFAULT_VALIDATION_MESSAGE = "Les données fournies sont invalides";
function validationMessage(key) {
    return (args) => {
        const constraint = args.constraints?.[0];
        return typeof constraint === "number" ? `${key}:${constraint}` : key;
    };
}
function localizeValidationMessage(locale, message) {
    const match = /^([A-Za-z0-9]+):(-?\d+(?:\.\d+)?)$/.exec(message);
    const key = match?.[1] ?? message;
    if (!(key in fr_json_1.default))
        return message;
    const params = match ? { max: Number(match[2]) } : undefined;
    return (0, i18n_1.translate)(locale, key, params);
}
function localizeValidationBody(locale, body) {
    if (!body || typeof body !== "object")
        return body;
    const record = body;
    if (!Array.isArray(record.errors))
        return body;
    const errors = record.errors.map((item) => localizeValidationMessage(locale, String(item)));
    const rawMessage = typeof record.message === "string"
        ? localizeValidationMessage(locale, record.message)
        : record.message;
    const frenchSummary = (0, i18n_1.translate)("fr", "validationSummary");
    const message = rawMessage === frenchSummary
        ? (0, i18n_1.translate)(locale, "validationSummary")
        : rawMessage;
    return { ...record, errors, message };
}
const buildConstraintMessage = (error, parentPath) => {
    const fieldPath = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;
    const constraints = error.constraints ? Object.values(error.constraints) : [];
    const messages = constraints.length
        ? constraints
        : error.children?.length
            ? error.children.flatMap((child) => buildConstraintMessage(child, fieldPath))
            : [`Le champ "${fieldPath}" est invalide`];
    return messages;
};
const extractValidationMessages = (errors) => {
    const formatted = errors.flatMap((error) => buildConstraintMessage(error));
    return formatted.length
        ? Array.from(new Set(formatted))
        : [exports.DEFAULT_VALIDATION_MESSAGE];
};
exports.extractValidationMessages = extractValidationMessages;
//# sourceMappingURL=validation.util.js.map