import type { Locale } from "../../../../common/i18n";
import { translate } from "../../../../common/i18n";
import { EMAIL_BRAND } from "../brand.constants";
import { escapeHtml } from "../escape-html";

export type BaseEmailLayoutParams = {
  locale: Locale;
  /** Titre principal sous le header (h1 visuel). */
  heading: string;
  /** Paragraphe d’introduction (HTML échappé si passage par helper introParagraph). */
  introHtml: string;
  /** Corps additionnel : résumés, boutons, alertes. */
  bodyHtml: string;
  /** Ligne optionnelle : coordonnées support dans le pied de page. */
  supportContact?: string;
  /** Sous-titre du header. Par défaut : libellé support. */
  subtitle?: string;
  /**
   * URL absolue du logo (https). Priorité sur `EMAIL_LOGO_URL` si défini.
   * Doit être une image accessible publiquement (PNG/SVG/webp).
   */
  logoUrl?: string;
};

/** Logo par défaut : variable d’environnement `EMAIL_LOGO_URL`. */
export function resolveEmailLogoUrl(explicit?: string): string | undefined {
  const trimmed = explicit?.trim();
  if (trimmed) return trimmed;
  const fromEnv = process.env.EMAIL_LOGO_URL?.trim();
  return fromEnv || undefined;
}

export function introParagraph(text: string): string {
  return `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${EMAIL_BRAND.textPrimary};">${escapeHtml(text)}</p>`;
}

export function emailHeader(
  locale: Locale,
  logoUrl?: string,
  subtitle?: string,
): string {
  const brand = escapeHtml(translate(locale, "emailBrandTitle"));
  const sub = escapeHtml(
    subtitle?.trim() || translate(locale, "emailBrandSubtitleSupport"),
  );
  const safeLogoSrc = logoUrl ? escapeHtml(logoUrl) : "";

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
  <td style="background:${EMAIL_BRAND.white};padding:22px 28px;text-align:left;border-bottom:1px solid ${EMAIL_BRAND.borderLight};">
    ${logoBlock}
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;color:${EMAIL_BRAND.blueDeep};letter-spacing:-0.02em;">${brand}</div>
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${EMAIL_BRAND.textSecondary};margin-top:6px;">${sub}</div>
  </td>
</tr>`;
}

export function emailFooter(locale: Locale, supportContact?: string): string {
  const trust = escapeHtml(translate(locale, "emailFooterTrust"));
  const disclaimer = escapeHtml(translate(locale, "emailFooterAutoDisclaimer"));
  const prefix = escapeHtml(translate(locale, "emailFooterContactPrefix"));
  const fallback = escapeHtml(translate(locale, "emailFooterContactFallback"));

  const contactLine = supportContact
    ? `<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${EMAIL_BRAND.textSecondary};">${prefix} ${escapeHtml(supportContact)}</p>`
    : `<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${EMAIL_BRAND.textSecondary};">${fallback}</p>`;

  return `
<tr>
  <td style="padding:24px 28px 28px;background:${EMAIL_BRAND.bgLight};border-top:1px solid ${EMAIL_BRAND.borderLight};">
    <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${EMAIL_BRAND.textPrimary};font-weight:600;">${trust}</p>
    ${contactLine}
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:${EMAIL_BRAND.textSecondary};">${disclaimer}</p>
  </td>
</tr>`;
}

/**
 * Document HTML complet : fond clair, carte centrée 600px, header, footer.
 */
export function baseEmailLayout(params: BaseEmailLayoutParams): string {
  const {
    locale,
    heading,
    introHtml,
    bodyHtml,
    supportContact,
    logoUrl,
    subtitle,
  } = params;
  const h = escapeHtml(heading);
  const lang = locale === "en" ? "en" : "fr";
  const resolvedLogo = resolveEmailLogoUrl(logoUrl);

  const innerCard = `
<!--[if mso]><table role="presentation" width="600" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:${EMAIL_BRAND.white};border-radius:12px;overflow:hidden;border:1px solid ${EMAIL_BRAND.borderLight};">
  ${emailHeader(locale, resolvedLogo, subtitle)}
  <tr>
    <td style="padding:28px 28px 8px;">
      <h1 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.25;color:${EMAIL_BRAND.blueDeep};font-weight:800;">${h}</h1>
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
<body style="margin:0;padding:0;background:${EMAIL_BRAND.bgLight};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${EMAIL_BRAND.bgLight};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        ${innerCard}
      </td>
    </tr>
  </table>
</body>
</html>`;
}
