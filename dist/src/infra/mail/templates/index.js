"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGenericMessageEmail = exports.escapeHtml = exports.EMAIL_BRAND = void 0;
var brand_constants_1 = require("./brand.constants");
Object.defineProperty(exports, "EMAIL_BRAND", { enumerable: true, get: function () { return brand_constants_1.EMAIL_BRAND; } });
var escape_html_1 = require("./escape-html");
Object.defineProperty(exports, "escapeHtml", { enumerable: true, get: function () { return escape_html_1.escapeHtml; } });
__exportStar(require("./components"), exports);
var generic_message_template_1 = require("./generic-message.template");
Object.defineProperty(exports, "generateGenericMessageEmail", { enumerable: true, get: function () { return generic_message_template_1.generateGenericMessageEmail; } });
//# sourceMappingURL=index.js.map