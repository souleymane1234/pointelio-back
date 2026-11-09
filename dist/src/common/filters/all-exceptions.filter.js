"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const i18n_1 = require("../i18n");
const validation_util_1 = require("../utils/validation.util");
const response_util_1 = require("../utils/response.util");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    colors = {
        reset: "\x1b[0m",
        red: "\x1b[31m",
        yellow: "\x1b[33m",
        cyan: "\x1b[36m",
        magenta: "\x1b[35m",
        gray: "\x1b[90m",
    };
    sensitiveKeyMatchers = [
        /password/i,
        /authorization/i,
        /bearer/i,
        /refresh[_-]?token/i,
        /access[_-]?token/i,
        /jwt/i,
        /token/i,
    ];
    isSensitiveKey(key) {
        return this.sensitiveKeyMatchers.some((re) => re.test(key));
    }
    redactValue(value) {
        if (value == null)
            return value;
        if (typeof value !== "object") {
            return value;
        }
        if (value instanceof Date)
            return value;
        if (Buffer.isBuffer(value))
            return "[REDACTED]";
        if (Array.isArray(value)) {
            return value.map((v) => this.redactValue(v));
        }
        if (value instanceof RegExp)
            return value.toString();
        const asRecord = value;
        const result = {};
        for (const [k, v] of Object.entries(asRecord)) {
            if (this.isSensitiveKey(k)) {
                result[k] = "[REDACTED]";
                continue;
            }
            result[k] = this.redactValue(v);
        }
        return result;
    }
    logError(message, statusCode, stack, context) {
        const timestamp = new Date().toISOString();
        const isServerError = statusCode >= 500;
        const color = isServerError ? this.colors.red : this.colors.yellow;
        const errorType = isServerError ? "✗ SERVER ERROR" : "⚠ CLIENT ERROR";
        const errorHeader = `${color}═══════════════════════════════════════════════════════════${this.colors.reset}`;
        const errorFooter = `${color}═══════════════════════════════════════════════════════════${this.colors.reset}`;
        console.error(`\n${errorHeader}`);
        console.error(`${color}${errorType}${this.colors.reset} ${this.colors.gray}[${timestamp}]${this.colors.reset}`);
        console.error(`${color}Status:${this.colors.reset} ${color}${statusCode}${this.colors.reset}`);
        console.error(`${color}Message:${this.colors.reset} ${this.colors.yellow}${message}${this.colors.reset}`);
        if (stack && isServerError) {
            console.error(`${color}Stack Trace:${this.colors.reset}`);
            console.error(`${this.colors.gray}${stack}${this.colors.reset}`);
        }
        if (context) {
            console.error(`${this.colors.cyan}Context:${this.colors.reset}`);
            console.error(`${this.colors.gray}${JSON.stringify(context, null, 2)}${this.colors.reset}`);
        }
        console.error(`${errorFooter}\n`);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const locale = (0, i18n_1.normalizeLocale)(req.locale ?? req.headers.language);
        const isProd = process.env.NODE_ENV === "production";
        const logPayloads = process.env.LOG_PAYLOADS === "true";
        const shouldLogRequestData = !isProd || logPayloads;
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const error = exception;
            const rawResponse = exception.getResponse();
            const exceptionResponse = status === common_1.HttpStatus.UNPROCESSABLE_ENTITY
                ? (0, validation_util_1.localizeValidationBody)(locale, rawResponse)
                : rawResponse;
            const errorMessage = typeof exceptionResponse === "string"
                ? exceptionResponse
                : exceptionResponse?.message ||
                    error.message ||
                    "Unknown error";
            const context = {
                method: req.method,
                url: req.url,
                statusCode: status,
                timestamp: new Date().toISOString(),
                userAgent: req.get("user-agent"),
                ip: req.ip,
                ...(shouldLogRequestData
                    ? {
                        body: this.redactValue(req.body),
                        query: this.redactValue(req.query),
                        params: this.redactValue(req.params),
                    }
                    : {}),
            };
            const isUnexpectedServerError = status >= common_1.HttpStatus.INTERNAL_SERVER_ERROR &&
                status !== common_1.HttpStatus.SERVICE_UNAVAILABLE;
            if (status >= common_1.HttpStatus.BAD_REQUEST) {
                this.logError(errorMessage, status, isUnexpectedServerError ? error.stack : undefined, context);
                if (isUnexpectedServerError) {
                    this.logger.error(`${req.method} ${req.url} - ${errorMessage}`, error.stack, "AllExceptionsFilter");
                }
                else {
                    this.logger.warn(`${req.method} ${req.url} - ${status} - ${errorMessage}`, "AllExceptionsFilter");
                }
            }
            if (status === common_1.HttpStatus.SERVICE_UNAVAILABLE) {
                return res.status(status).json((0, response_util_1.errorResponse)(String(errorMessage)));
            }
            if (status >= common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
                return res
                    .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json((0, response_util_1.serverErrorResponse)(undefined, locale));
            }
            if (status === common_1.HttpStatus.FORBIDDEN) {
                return res.status(status).json((0, response_util_1.forbiddenResponse)(undefined, locale));
            }
            if (status === common_1.HttpStatus.UNAUTHORIZED) {
                const errors = Array.isArray(errorMessage)
                    ? errorMessage.map(String)
                    : [String(errorMessage)];
                const specificMessages = [
                    (0, i18n_1.translate)(locale, "accountInactive"),
                    (0, i18n_1.translate)(locale, "invalidCredentials"),
                    (0, i18n_1.translate)(locale, "invalidPin"),
                ];
                const specificMessage = errors.find((error) => specificMessages.includes(error));
                return res.status(status).json({
                    success: false,
                    message: specificMessage ?? (0, i18n_1.translate)(locale, "unauthorizedSummary"),
                    errors: specificMessage ? [specificMessage] : errors,
                });
            }
            if (status === common_1.HttpStatus.TOO_MANY_REQUESTS) {
                return res
                    .status(status)
                    .json((0, response_util_1.errorResponse)((0, i18n_1.translate)(locale, "tooManyRequests")));
            }
            const payload = typeof exceptionResponse === "string"
                ? (0, response_util_1.errorResponse)(exceptionResponse)
                : exceptionResponse;
            return res.status(status).json(payload);
        }
        const bodyParserStatus = this.bodyParserErrorStatus(exception);
        if (bodyParserStatus) {
            const tooLarge = bodyParserStatus === common_1.HttpStatus.PAYLOAD_TOO_LARGE;
            this.logger.warn(`${req.method} ${req.url} - ${bodyParserStatus} - ${exception.message}`, "AllExceptionsFilter");
            return res
                .status(bodyParserStatus)
                .json((0, response_util_1.errorResponse)((0, i18n_1.translate)(locale, tooLarge ? "requestBodyTooLarge" : "requestBodyInvalid")));
        }
        const error = exception;
        if (this.isUniqueConstraintError(exception)) {
            const payload = (0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "uniqueConstraintViolation")], (0, i18n_1.translate)(locale, "validationSummary"), locale);
            this.logError(payload.message, common_1.HttpStatus.UNPROCESSABLE_ENTITY, undefined, {
                method: req.method,
                url: req.url,
                statusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                timestamp: new Date().toISOString(),
            });
            return res.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY).json(payload);
        }
        const context = {
            method: req.method,
            url: req.url,
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            userAgent: req.get("user-agent"),
            ip: req.ip,
            ...(shouldLogRequestData
                ? {
                    body: this.redactValue(req.body),
                    query: this.redactValue(req.query),
                    params: this.redactValue(req.params),
                }
                : {}),
        };
        this.logError(error?.message || "Unexpected error occurred", common_1.HttpStatus.INTERNAL_SERVER_ERROR, error?.stack, context);
        this.logger.error(`Unexpected error: ${error?.message || "Unknown error"}`, error?.stack, "AllExceptionsFilter");
        return res
            .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json((0, response_util_1.serverErrorResponse)(undefined, locale));
    }
    bodyParserErrorStatus(exception) {
        if (exception == null || typeof exception !== "object")
            return null;
        const { type, status } = exception;
        if (typeof type !== "string" || !type.startsWith("entity."))
            return null;
        if (typeof status !== "number" || status < 400 || status >= 500)
            return null;
        return status === common_1.HttpStatus.PAYLOAD_TOO_LARGE
            ? common_1.HttpStatus.PAYLOAD_TOO_LARGE
            : common_1.HttpStatus.BAD_REQUEST;
    }
    isUniqueConstraintError(exception) {
        if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            exception.code === "P2002") {
            return true;
        }
        return (exception instanceof Error &&
            /Unique constraint failed/i.test(exception.message));
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map