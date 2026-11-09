import type { Locale } from "../../../common/i18n";
import type { EmailTemplatePayload } from "./brand.constants";
export type GenerateGenericMessageEmailParams = {
    locale: Locale;
    subject: string;
    heading: string;
    message: string;
    action?: {
        label: string;
        href: string;
    };
    supportContact?: string;
};
export declare function generateGenericMessageEmail(params: GenerateGenericMessageEmailParams): EmailTemplatePayload;
