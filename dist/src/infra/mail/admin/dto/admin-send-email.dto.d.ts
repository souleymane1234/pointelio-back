export declare class AdminSendEmailDto {
    userIds?: number[];
    emails?: string[];
    subject: string;
    text?: string;
    html?: string;
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    fromEmail?: string;
    fromName?: string;
    headers?: Record<string, string>;
}
