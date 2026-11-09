import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendEmailDto } from "../dto/send-email.dto";
import { EmailingValidationService } from "./emailing-validation.service";
export type SendEmailResult = {
    messageId: string;
    accepted: string[];
    rejected: string[];
};
export type EmailAttachmentInput = {
    filename: string;
    content: Buffer | string;
    contentType?: string;
};
export type SendEmailInput = SendEmailDto & {
    attachments?: EmailAttachmentInput[];
};
export declare class EmailingSendService implements OnModuleInit {
    private readonly config;
    private readonly validation;
    private readonly logger;
    private smtpConfig;
    private transporter;
    constructor(config: ConfigService, validation: EmailingValidationService);
    onModuleInit(): Promise<void>;
    isEnabled(): boolean;
    send(payload: SendEmailInput): Promise<SendEmailResult>;
    private normalizeAddresses;
}
