import { EMAIL_BRAND } from "../brand.constants";
import { escapeHtml } from "../escape-html";

export type SummaryRowInput = {
  label: string;
  /** Texte brut (échappé) ou fragment HTML déjà sûr (badges). */
  value: string;
  valueIsHtml?: boolean;
};

export function summaryRow(row: SummaryRowInput): string {
  const label = escapeHtml(row.label);
  const value = row.valueIsHtml ? row.value : escapeHtml(row.value);
  return `
<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${EMAIL_BRAND.borderLight};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${EMAIL_BRAND.textSecondary};vertical-align:top;width:38%;">${label}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${EMAIL_BRAND.borderLight};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${EMAIL_BRAND.textPrimary};vertical-align:top;font-weight:500;">${value}</td>
</tr>`;
}

export function summaryBlock(title: string, rows: SummaryRowInput[]): string {
  const safeTitle = escapeHtml(title);
  const inner = rows.map(summaryRow).join("");
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;border:1px solid ${EMAIL_BRAND.borderLight};border-radius:8px;overflow:hidden;">
  <tr>
    <td style="background:${EMAIL_BRAND.bgLight};padding:12px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:${EMAIL_BRAND.blueDeep};text-transform:uppercase;letter-spacing:0.02em;">${safeTitle}</td>
  </tr>
  <tr>
    <td style="padding:8px 16px 16px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${inner}</table>
    </td>
  </tr>
</table>`;
}

export type ActionButtonInput = {
  href: string;
  label: string;
  /** `danger` pour une action de rejet. Défaut : vert premium. */
  variant?: "primary" | "danger";
};

export function actionButton({
  href,
  label,
  variant = "primary",
}: ActionButtonInput): string {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  const background =
    variant === "danger" ? EMAIL_BRAND.redAlert : EMAIL_BRAND.greenPremium;
  return `
<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
  <tr>
    <td align="center">
      <a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 28px;background:${background};color:${EMAIL_BRAND.white};text-decoration:none;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">${safeLabel}</a>
    </td>
  </tr>
</table>`;
}

export type AlertVariant = "danger" | "warning";

/** Bloc extrait de réponse (fond gris clair). */
export function replyExcerptBox(text: string): string {
  const safe = escapeHtml(text);
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;">
  <tr>
    <td style="padding:14px 16px;background:#F3F4F6;border-radius:8px;border:1px solid ${EMAIL_BRAND.borderLight};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:${EMAIL_BRAND.textPrimary};">${safe}</td>
  </tr>
</table>`;
}

export function alertBox(variant: AlertVariant, message: string): string {
  const isDanger = variant === "danger";
  const bg = isDanger ? "#FEF2F2" : "#FFFBEB";
  const border = isDanger ? "#FECACA" : "#FDE68A";
  const color = isDanger ? "#991B1B" : "#92400E";
  const safe = escapeHtml(message);
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;">
  <tr>
    <td style="padding:14px 16px;background:${bg};border:1px solid ${border};border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:${color};">${safe}</td>
  </tr>
</table>`;
}
