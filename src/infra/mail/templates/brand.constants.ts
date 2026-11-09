/** Palette des e-mails (CSS inline uniquement). À adapter à la charte du projet. */
export const EMAIL_BRAND = {
  blueDeep: "#1F3C88",
  greenPremium: "#2ECC71",
  white: "#FFFFFF",
  bgLight: "#F8FAFC",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  redAlert: "#E74C3C",
  orangeWarn: "#F39C12",
  borderLight: "#E5E7EB",
  greyBadgeBg: "#F3F4F6",
} as const;

export type EmailTemplatePayload = {
  subject: string;
  html: string;
  text: string;
};
