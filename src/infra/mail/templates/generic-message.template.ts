import type { Locale } from "../../../common/i18n";
import { translate } from "../../../common/i18n";
import type { EmailTemplatePayload } from "./brand.constants";
import { actionButton, baseEmailLayout, introParagraph } from "./components";

export type GenerateGenericMessageEmailParams = {
  locale: Locale;
  subject: string;
  heading: string;
  message: string;
  action?: { label: string; href: string };
  supportContact?: string;
};

/**
 * Template de base : titre, message et bouton optionnel.
 * Modèle à copier pour les e-mails métier (même layout, version texte fournie).
 */
export function generateGenericMessageEmail(
  params: GenerateGenericMessageEmailParams,
): EmailTemplatePayload {
  const { locale, subject, heading, message, action, supportContact } = params;

  const html = baseEmailLayout({
    locale,
    heading,
    introHtml: introParagraph(message),
    bodyHtml: action ? actionButton(action) : "",
    supportContact,
  });

  const text = [
    subject,
    "",
    message,
    ...(action ? ["", `${action.label}: ${action.href}`] : []),
    "",
    translate(locale, "emailSignatureTeam"),
    "",
    translate(locale, "emailFooterAutoDisclaimer"),
  ].join("\n");

  return { subject, html, text };
}
