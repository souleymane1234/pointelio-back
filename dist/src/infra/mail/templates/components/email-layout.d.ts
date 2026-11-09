import type { Locale } from "../../../../common/i18n";
export type BaseEmailLayoutParams = {
    locale: Locale;
    heading: string;
    introHtml: string;
    bodyHtml: string;
    supportContact?: string;
    subtitle?: string;
    logoUrl?: string;
};
export declare function resolveEmailLogoUrl(explicit?: string): string | undefined;
export declare function introParagraph(text: string): string;
export declare function emailHeader(locale: Locale, logoUrl?: string, subtitle?: string): string;
export declare function emailFooter(locale: Locale, supportContact?: string): string;
export declare function baseEmailLayout(params: BaseEmailLayoutParams): string;
