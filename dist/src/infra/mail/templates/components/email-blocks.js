"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summaryRow = summaryRow;
exports.summaryBlock = summaryBlock;
exports.actionButton = actionButton;
exports.replyExcerptBox = replyExcerptBox;
exports.alertBox = alertBox;
const brand_constants_1 = require("../brand.constants");
const escape_html_1 = require("../escape-html");
function summaryRow(row) {
    const label = (0, escape_html_1.escapeHtml)(row.label);
    const value = row.valueIsHtml ? row.value : (0, escape_html_1.escapeHtml)(row.value);
    return `
<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${brand_constants_1.EMAIL_BRAND.borderLight};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${brand_constants_1.EMAIL_BRAND.textSecondary};vertical-align:top;width:38%;">${label}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${brand_constants_1.EMAIL_BRAND.borderLight};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${brand_constants_1.EMAIL_BRAND.textPrimary};vertical-align:top;font-weight:500;">${value}</td>
</tr>`;
}
function summaryBlock(title, rows) {
    const safeTitle = (0, escape_html_1.escapeHtml)(title);
    const inner = rows.map(summaryRow).join("");
    return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;border:1px solid ${brand_constants_1.EMAIL_BRAND.borderLight};border-radius:8px;overflow:hidden;">
  <tr>
    <td style="background:${brand_constants_1.EMAIL_BRAND.bgLight};padding:12px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:${brand_constants_1.EMAIL_BRAND.blueDeep};text-transform:uppercase;letter-spacing:0.02em;">${safeTitle}</td>
  </tr>
  <tr>
    <td style="padding:8px 16px 16px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${inner}</table>
    </td>
  </tr>
</table>`;
}
function actionButton({ href, label, variant = "primary", }) {
    const safeHref = (0, escape_html_1.escapeHtml)(href);
    const safeLabel = (0, escape_html_1.escapeHtml)(label);
    const background = variant === "danger" ? brand_constants_1.EMAIL_BRAND.redAlert : brand_constants_1.EMAIL_BRAND.greenPremium;
    return `
<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
  <tr>
    <td align="center">
      <a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 28px;background:${background};color:${brand_constants_1.EMAIL_BRAND.white};text-decoration:none;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">${safeLabel}</a>
    </td>
  </tr>
</table>`;
}
function replyExcerptBox(text) {
    const safe = (0, escape_html_1.escapeHtml)(text);
    return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;">
  <tr>
    <td style="padding:14px 16px;background:#F3F4F6;border-radius:8px;border:1px solid ${brand_constants_1.EMAIL_BRAND.borderLight};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:${brand_constants_1.EMAIL_BRAND.textPrimary};">${safe}</td>
  </tr>
</table>`;
}
function alertBox(variant, message) {
    const isDanger = variant === "danger";
    const bg = isDanger ? "#FEF2F2" : "#FFFBEB";
    const border = isDanger ? "#FECACA" : "#FDE68A";
    const color = isDanger ? "#991B1B" : "#92400E";
    const safe = (0, escape_html_1.escapeHtml)(message);
    return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;">
  <tr>
    <td style="padding:14px 16px;background:${bg};border:1px solid ${border};border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:${color};">${safe}</td>
  </tr>
</table>`;
}
//# sourceMappingURL=email-blocks.js.map