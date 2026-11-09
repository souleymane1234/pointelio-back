export type EmailingSmtpConfig = {
    enabled: boolean;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    defaultFromEmail: string;
    defaultFromName?: string;
    requireTls: boolean;
    valid: boolean;
};
export declare function resolveEmailingSmtpConfig(get: (key: string) => string | undefined): EmailingSmtpConfig;
