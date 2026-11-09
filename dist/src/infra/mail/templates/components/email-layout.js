"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEmailLogoUrl = resolveEmailLogoUrl;
exports.introParagraph = introParagraph;
exports.emailHeader = emailHeader;
exports.emailFooter = emailFooter;
exports.baseEmailLayout = baseEmailLayout;
const i18n_1 = require("../../../../common/i18n");
const brand_constants_1 = require("../brand.constants");
const escape_html_1 = require("../escape-html");
function resolveEmailLogoUrl(explicit) {
    const trimmed = explicit?.trim();
    if (trimmed)
        return trimmed;
    const fromEnv = process.env.EMAIL_LOGO_URL?.trim();
    return fromEnv || undefined;
}
function introParagraph(text) {
    return `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${brand_constants_1.EMAIL_BRAND.textPrimary};">${(0, escape_html_1.escapeHtml)(text)}</p>`;
}
function emailHeader(locale, logoUrl, subtitle) {
    const brand = (0, escape_html_1.escapeHtml)((0, i18n_1.translate)(locale, "emailBrandTitle"));
    const sub = (0, escape_html_1.escapeHtml)(subtitle?.trim() || (0, i18n_1.translate)(locale, "emailBrandSubtitleSupport"));
    const safeLogoSrc = logoUrl ? (0, escape_html_1.escapeHtml)(logoUrl) : "";
    const logoBlock = logoUrl
        ? `
<table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 14px;">
  <tr>
    <td style="padding:0;line-height:0;">
      <img src="${safeLogoSrc}" alt="${brand}" width="168" border="0" style="display:block;max-width:168px;width:168px;height:auto;border:0;outline:none;text-decoration:none;" />
    </td>
  </tr>
</table>`
        : "";
    return `
<tr>
  <td style="background:${brand_constants_1.EMAIL_BRAND.white};padding:22px 28px;text-align:left;border-bottom:1px solid ${brand_constants_1.EMAIL_BRAND.borderLight};">
    ${logoBlock}
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;color:${brand_constants_1.EMAIL_BRAND.blueDeep};letter-spacing:-0.02em;">${brand}</div>
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${brand_constants_1.EMAIL_BRAND.textSecondary};margin-top:6px;">${sub}</div>
  </td>
</tr>`;
}
function emailFooter(locale, supportContact) {
    const trust = (0, escape_html_1.escapeHtml)((0, i18n_1.translate)(locale, "emailFooterTrust"));
    const disclaimer = (0, escape_html_1.escapeHtml)((0, i18n_1.translate)(locale, "emailFooterAutoDisclaimer"));
    const prefix = (0, escape_html_1.escapeHtml)((0, i18n_1.translate)(locale, "emailFooterContactPrefix"));
    const fallback = (0, escape_html_1.escapeHtml)((0, i18n_1.translate)(locale, "emailFooterContactFallback"));
    const contactLine = supportContact
        ? `<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${brand_constants_1.EMAIL_BRAND.textSecondary};">${prefix} ${(0, escape_html_1.escapeHtml)(supportContact)}</p>`
        : `<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${brand_constants_1.EMAIL_BRAND.textSecondary};">${fallback}</p>`;
    return `
<tr>
  <td style="padding:24px 28px 28px;background:${brand_constants_1.EMAIL_BRAND.bgLight};border-top:1px solid ${brand_constants_1.EMAIL_BRAND.borderLight};">
    <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${brand_constants_1.EMAIL_BRAND.textPrimary};font-weight:600;">${trust}</p>
    ${contactLine}
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:${brand_constants_1.EMAIL_BRAND.textSecondary};">${disclaimer}</p>
  </td>
</tr>`;
}
function baseEmailLayout(params) {
    const { locale, heading, introHtml, bodyHtml, supportContact, logoUrl, subtitle, } = params;
    const h = (0, escape_html_1.escapeHtml)(heading);
    const lang = locale === "en" ? "en" : "fr";
    const resolvedLogo = resolveEmailLogoUrl(logoUrl);
    const innerCard = `
<!--[if mso]><table role="presentation" width="600" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:${brand_constants_1.EMAIL_BRAND.white};border-radius:12px;overflow:hidden;border:1px solid ${brand_constants_1.EMAIL_BRAND.borderLight};">
  ${emailHeader(locale, resolvedLogo, subtitle)}
  <tr>
    <td style="padding:28px 28px 8px;">
      <h1 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.25;color:${brand_constants_1.EMAIL_BRAND.blueDeep};font-weight:800;">${h}</h1>
      ${introHtml}
      ${bodyHtml}
    </td>
  </tr>
  ${emailFooter(locale, supportContact)}
</table>
<!--[if mso]></td></tr></table><![endif]-->`;
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${h}</title>
</head>
<body style="margin:0;padding:0;background:${brand_constants_1.EMAIL_BRAND.bgLight};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${brand_constants_1.EMAIL_BRAND.bgLight};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        ${innerCard}
      </td>
    </tr>
  </table>
</body>
</html>`;
}
//# sourceMappingURL=email-layout.js.map