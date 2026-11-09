"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = void 0;
exports.translate = translate;
const locale_1 = require("./locale");
const en_json_1 = __importDefault(require("./locales/en.json"));
const fr_json_1 = __importDefault(require("./locales/fr.json"));
const CATALOGS = {
    fr: fr_json_1.default,
    en: en_json_1.default,
};
function interpolate(template, params) {
    if (!params)
        return template;
    return template.replace(/\{\{(\w+)\}\}/g, (_, name) => params[name] !== undefined ? String(params[name]) : `{{${name}}}`);
}
function translate(locale, key, params) {
    const primary = CATALOGS[locale];
    const fallback = CATALOGS[locale_1.DEFAULT_LOCALE];
    const template = primary[key] ?? fallback[key] ?? String(key);
    return interpolate(template, params);
}
exports.t = translate;
//# sourceMappingURL=translate.js.map