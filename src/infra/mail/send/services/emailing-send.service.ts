import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, type Transporter } from "nodemailer";
import type { Options as MailOptions } from "nodemailer/lib/mailer";
import {
  resolveEmailingSmtpConfig,
  type EmailingSmtpConfig,
} from "../config/emailing-smtp.config";
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

@Injectable()
export class EmailingSendService implements OnModuleInit {
  private readonly logger = new Logger(EmailingSendService.name);
  private smtpConfig: EmailingSmtpConfig;
  private transporter: Transporter | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly validation: EmailingValidationService,
  ) {
    this.smtpConfig = resolveEmailingSmtpConfig((key) =>
      this.config.get<string>(key),
    );
  }

  async onModuleInit(): Promise<void> {
    this.smtpConfig = resolveEmailingSmtpConfig((key) =>
      this.config.get<string>(key),
    );

    if (!this.smtpConfig.enabled) {
      this.logger.log("SMTP disabled (SMTP_ENABLED=false).");
      return;
    }

    if (!this.smtpConfig.valid) {
      this.logger.warn(
        "SMTP not configured. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL.",
      );
      return;
    }

    this.transporter = createTransport({
      host: this.smtpConfig.host,
      port: this.smtpConfig.port,
      secure: this.smtpConfig.secure,
      requireTLS: this.smtpConfig.requireTls,
      ignoreTLS: !this.smtpConfig.secure && !this.smtpConfig.requireTls,
      auth: {
        user: this.smtpConfig.user,
        pass: this.smtpConfig.password,
      },
    });

    try {
      await this.transporter.verify();

      this.logger.log(
        `SMTP ready on ${this.smtpConfig.host}:${this.smtpConfig.port}.`,
      );
    } catch (error) {
      this.logger.error(
        "SMTP verification failed. Emailing disabled for this process.",
        error instanceof Error ? error.stack : String(error),
      );
      this.transporter = null;
    }
  }

  isEnabled(): boolean {
    return this.transporter != null;
  }

  async send(payload: SendEmailInput): Promise<SendEmailResult> {
    this.validation.validateSendPayload(payload);

    if (!this.transporter) {
      throw new ServiceUnavailableException(
        "Emailing service is not configured or unavailable.",
      );
    }

    const fromEmail = payload.fromEmail || this.smtpConfig.defaultFromEmail;
    const fromName = payload.fromName || this.smtpConfig.defaultFromName;

    const attachments = payload.attachments
      ?.filter((item) => item.filename?.trim() && item.content != null)
      .map((item) => ({
        filename: item.filename.trim(),
        content: item.content,
        ...(item.contentType?.trim()
          ? { contentType: item.contentType.trim() }
          : {}),
      }));

    const mailOptions: MailOptions = {
      from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
      to: payload.to,
      subject: payload.subject,
      ...(payload.cc?.length ? { cc: payload.cc } : {}),
      ...(payload.bcc?.length ? { bcc: payload.bcc } : {}),
      ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
      ...(payload.text?.trim() ? { text: payload.text } : {}),
      ...(payload.html?.trim() ? { html: payload.html } : {}),
      ...(payload.headers ? { headers: payload.headers } : {}),
      ...(attachments?.length ? { attachments } : {}),
    };

    const info = await this.transporter.sendMail(mailOptions);

    return {
      messageId: info.messageId,
      accepted: this.normalizeAddresses(info.accepted),
      rejected: this.normalizeAddresses(info.rejected),
    };
  }

  private normalizeAddresses(values: unknown[]): string[] {
    return values
      .map((value) => {
        if (typeof value === "string") return value;
        if (
          value &&
          typeof value === "object" &&
          "address" in value &&
          typeof (value as { address?: unknown }).address === "string"
        ) {
          return (value as { address: string }).address;
        }
        return "";
      })
      .filter(Boolean);
  }
}
