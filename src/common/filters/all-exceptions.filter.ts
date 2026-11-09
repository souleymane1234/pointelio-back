import { Prisma } from "@prisma/client";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response, Request } from "express";
import { normalizeLocale, translate } from "../i18n";
import { localizeValidationBody } from "../utils/validation.util";
import {
  errorResponse,
  forbiddenResponse,
  serverErrorResponse,
  validationErrorResponse,
} from "../utils/response.util";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  private readonly colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    gray: "\x1b[90m",
  };

  private readonly sensitiveKeyMatchers: RegExp[] = [
    /password/i,
    /authorization/i,
    /bearer/i,
    /refresh[_-]?token/i,
    /access[_-]?token/i,
    /jwt/i,
    /token/i,
  ];

  private isSensitiveKey(key: string): boolean {
    return this.sensitiveKeyMatchers.some((re) => re.test(key));
  }

  private redactValue(value: unknown): unknown {
    if (value == null) return value;

    if (typeof value !== "object") {
      // string/number/boolean/bigint
      return value;
    }

    if (value instanceof Date) return value;

    // Avoid dumping huge/binary request bodies.
    if (Buffer.isBuffer(value)) return "[REDACTED]";

    if (Array.isArray(value)) {
      return value.map((v) => this.redactValue(v));
    }

    if (value instanceof RegExp) return value.toString();

    const asRecord = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const [k, v] of Object.entries(asRecord)) {
      if (this.isSensitiveKey(k)) {
        result[k] = "[REDACTED]";
        continue;
      }
      result[k] = this.redactValue(v);
    }

    return result;
  }

  private logError(
    message: string,
    statusCode: number,
    stack?: string,
    context?: any,
  ) {
    const timestamp = new Date().toISOString();
    const isServerError = statusCode >= 500;

    // Choisir la couleur selon le type d'erreur
    const color = isServerError ? this.colors.red : this.colors.yellow;
    const errorType = isServerError ? "✗ SERVER ERROR" : "⚠ CLIENT ERROR";
    const errorHeader = `${color}═══════════════════════════════════════════════════════════${this.colors.reset}`;
    const errorFooter = `${color}═══════════════════════════════════════════════════════════${this.colors.reset}`;

    console.error(`\n${errorHeader}`);
    console.error(
      `${color}${errorType}${this.colors.reset} ${this.colors.gray}[${timestamp}]${this.colors.reset}`,
    );
    console.error(
      `${color}Status:${this.colors.reset} ${color}${statusCode}${this.colors.reset}`,
    );
    console.error(
      `${color}Message:${this.colors.reset} ${this.colors.yellow}${message}${this.colors.reset}`,
    );

    if (stack && isServerError) {
      console.error(`${color}Stack Trace:${this.colors.reset}`);
      console.error(`${this.colors.gray}${stack}${this.colors.reset}`);
    }

    if (context) {
      console.error(`${this.colors.cyan}Context:${this.colors.reset}`);
      console.error(
        `${this.colors.gray}${JSON.stringify(context, null, 2)}${this.colors.reset}`,
      );
    }

    console.error(`${errorFooter}\n`);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const locale = normalizeLocale(
      req.locale ?? (req.headers.language as string),
    );
    const isProd = process.env.NODE_ENV === "production";
    const logPayloads = process.env.LOG_PAYLOADS === "true";
    const shouldLogRequestData = !isProd || logPayloads;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const error = exception as Error;
      const rawResponse = exception.getResponse();
      const exceptionResponse =
        status === HttpStatus.UNPROCESSABLE_ENTITY
          ? localizeValidationBody(locale, rawResponse)
          : rawResponse;
      const errorMessage =
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : (exceptionResponse as any)?.message ||
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

      // 503 levée volontairement (dépendance indisponible) : message conservé, pas de stack.
      const isUnexpectedServerError =
        status >= HttpStatus.INTERNAL_SERVER_ERROR &&
        status !== HttpStatus.SERVICE_UNAVAILABLE;

      // Logger toutes les erreurs >= 400 avec des couleurs
      if (status >= HttpStatus.BAD_REQUEST) {
        this.logError(
          errorMessage,
          status,
          isUnexpectedServerError ? error.stack : undefined,
          context,
        );

        // Log avec NestJS logger selon le niveau
        if (isUnexpectedServerError) {
          this.logger.error(
            `${req.method} ${req.url} - ${errorMessage}`,
            error.stack,
            "AllExceptionsFilter",
          );
        } else {
          this.logger.warn(
            `${req.method} ${req.url} - ${status} - ${errorMessage}`,
            "AllExceptionsFilter",
          );
        }
      }

      if (status === HttpStatus.SERVICE_UNAVAILABLE) {
        return res.status(status).json(errorResponse(String(errorMessage)));
      }

      if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(serverErrorResponse(undefined, locale));
      }

      if (status === HttpStatus.FORBIDDEN) {
        return res.status(status).json(forbiddenResponse(undefined, locale));
      }

      if (status === HttpStatus.UNAUTHORIZED) {
        const errors = Array.isArray(errorMessage)
          ? errorMessage.map(String)
          : [String(errorMessage)];
        const specificMessages = [
          translate(locale, "accountInactive"),
          translate(locale, "invalidCredentials"),
          translate(locale, "invalidPin"),
        ];
        const specificMessage = errors.find((error) =>
          specificMessages.includes(error),
        );
        return res.status(status).json({
          success: false,
          message: specificMessage ?? translate(locale, "unauthorizedSummary"),
          errors: specificMessage ? [specificMessage] : errors,
        });
      }

      if (status === HttpStatus.TOO_MANY_REQUESTS) {
        return res
          .status(status)
          .json(errorResponse(translate(locale, "tooManyRequests")));
      }

      // Retourner la réponse formatée pour les autres erreurs (4xx)
      const payload =
        typeof exceptionResponse === "string"
          ? errorResponse(exceptionResponse)
          : exceptionResponse;

      return res.status(status).json(payload);
    }

    const bodyParserStatus = this.bodyParserErrorStatus(exception);
    if (bodyParserStatus) {
      const tooLarge = bodyParserStatus === HttpStatus.PAYLOAD_TOO_LARGE;
      this.logger.warn(
        `${req.method} ${req.url} - ${bodyParserStatus} - ${(exception as Error).message}`,
        "AllExceptionsFilter",
      );
      return res
        .status(bodyParserStatus)
        .json(
          errorResponse(
            translate(
              locale,
              tooLarge ? "requestBodyTooLarge" : "requestBodyInvalid",
            ),
          ),
        );
    }

    // Erreur non-HTTP (inattendue)
    const error = exception as Error;
    if (this.isUniqueConstraintError(exception)) {
      const payload = validationErrorResponse(
        [translate(locale, "uniqueConstraintViolation")],
        translate(locale, "validationSummary"),
        locale,
      );
      this.logError(
        payload.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
        undefined,
        {
          method: req.method,
          url: req.url,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          timestamp: new Date().toISOString(),
        },
      );
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(payload);
    }
    const context = {
      method: req.method,
      url: req.url,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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

    this.logError(
      error?.message || "Unexpected error occurred",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error?.stack,
      context,
    );

    // Log avec NestJS logger
    this.logger.error(
      `Unexpected error: ${error?.message || "Unknown error"}`,
      error?.stack,
      "AllExceptionsFilter",
    );

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(serverErrorResponse(undefined, locale));
  }

  /** Erreurs `body-parser` (corps trop gros, JSON invalide…) : `type` = `entity.*`, statut 4xx. */
  private bodyParserErrorStatus(exception: unknown): number | null {
    if (exception == null || typeof exception !== "object") return null;
    const { type, status } = exception as { type?: unknown; status?: unknown };
    if (typeof type !== "string" || !type.startsWith("entity.")) return null;
    if (typeof status !== "number" || status < 400 || status >= 500)
      return null;
    return status === HttpStatus.PAYLOAD_TOO_LARGE
      ? HttpStatus.PAYLOAD_TOO_LARGE
      : HttpStatus.BAD_REQUEST;
  }

  /** Contrainte d'unicité Prisma (P2002) non interceptée par le service : 422 plutôt que 500. */
  private isUniqueConstraintError(exception: unknown): boolean {
    if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === "P2002"
    ) {
      return true;
    }
    return (
      exception instanceof Error &&
      /Unique constraint failed/i.test(exception.message)
    );
  }
}
