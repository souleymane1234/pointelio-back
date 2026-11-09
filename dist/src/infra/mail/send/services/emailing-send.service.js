"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailingSendService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailingSendService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = require("nodemailer");
const emailing_smtp_config_1 = require("../config/emailing-smtp.config");
const emailing_validation_service_1 = require("./emailing-validation.service");
let EmailingSendService = EmailingSendService_1 = class EmailingSendService {
    config;
    validation;
    logger = new common_1.Logger(EmailingSendService_1.name);
    smtpConfig;
    transporter = null;
    constructor(config, validation) {
        this.config = config;
        this.validation = validation;
        this.smtpConfig = (0, emailing_smtp_config_1.resolveEmailingSmtpConfig)((key) => this.config.get(key));
    }
    async onModuleInit() {
        this.smtpConfig = (0, emailing_smtp_config_1.resolveEmailingSmtpConfig)((key) => this.config.get(key));
        if (!this.smtpConfig.enabled) {
            this.logger.log("SMTP disabled (SMTP_ENABLED=false).");
            return;
        }
        if (!this.smtpConfig.valid) {
            this.logger.warn("SMTP not configured. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL.");
            return;
        }
        this.transporter = (0, nodemailer_1.createTransport)({
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
            this.logger.log(`SMTP ready on ${this.smtpConfig.host}:${this.smtpConfig.port}.`);
        }
        catch (error) {
            this.logger.error("SMTP verification failed. Emailing disabled for this process.", error instanceof Error ? error.stack : String(error));
            this.transporter = null;
        }
    }
    isEnabled() {
        return this.transporter != null;
    }
    async send(payload) {
        this.validation.validateSendPayload(payload);
        if (!this.transporter) {
            throw new common_1.ServiceUnavailableException("Emailing service is not configured or unavailable.");
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
        const mailOptions = {
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
    normalizeAddresses(values) {
        return values
            .map((value) => {
            if (typeof value === "string")
                return value;
            if (value &&
                typeof value === "object" &&
                "address" in value &&
                typeof value.address === "string") {
                return value.address;
            }
            return "";
        })
            .filter(Boolean);
    }
};
exports.EmailingSendService = EmailingSendService;
exports.EmailingSendService = EmailingSendService = EmailingSendService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        emailing_validation_service_1.EmailingValidationService])
], EmailingSendService);
//# sourceMappingURL=emailing-send.service.js.map