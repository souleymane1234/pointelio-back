"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGenericMessageEmail = generateGenericMessageEmail;
const i18n_1 = require("../../../common/i18n");
const components_1 = require("./components");
function generateGenericMessageEmail(params) {
    const { locale, subject, heading, message, action, supportContact } = params;
    const html = (0, components_1.baseEmailLayout)({
        locale,
        heading,
        introHtml: (0, components_1.introParagraph)(message),
        bodyHtml: action ? (0, components_1.actionButton)(action) : "",
        supportContact,
    });
    const text = [
        subject,
        "",
        message,
        ...(action ? ["", `${action.label}: ${action.href}`] : []),
        "",
        (0, i18n_1.translate)(locale, "emailSignatureTeam"),
        "",
        (0, i18n_1.translate)(locale, "emailFooterAutoDisclaimer"),
    ].join("\n");
    return { subject, html, text };
}
//# sourceMappingURL=generic-message.template.js.map