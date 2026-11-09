export declare class SendEmailDto {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
    fromEmail?: string;
    fromName?: string;
    headers?: Record<string, string>;
}
