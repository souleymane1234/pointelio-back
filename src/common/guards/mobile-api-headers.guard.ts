import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from "@nestjs/common";
import type { Request } from "express";
import { normalizeLocale, translate } from "../i18n";
import { validationErrorResponse } from "../utils/response.util";

/**
 * Routes appelées hors client applicatif (upload multipart, webhooks, liens d'e-mail) :
 * l'en-tête `Accept` n'y est pas exigé.
 */
const ACCEPT_HEADER_EXEMPT_PATHS: readonly RegExp[] = [/\/uploads\//];

@Injectable()
export class MobileApiHeadersGuard implements CanActivate {
  private readonly logger = new Logger(MobileApiHeadersGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const path =
      req.path ||
      (req.originalUrl && req.originalUrl.split("?")[0]) ||
      req.url.split("?")[0];

    if (this.isDocsOrOpenApiPath(path)) {
      return true;
    }

    const locale = normalizeLocale(req.headers.language as string);
    const errors: string[] = [];

    if (
      !this.isAcceptHeaderValid(req.headers.accept) &&
      !this.isAcceptHeaderExemptPath(path)
    ) {
      errors.push(translate(locale, "acceptRequired"));
    }

    if (errors.length > 0) {
      this.logger.warn(
        `${req.method} ${path} - 422 invalid headers: ${errors.join(" | ")}`,
      );
      throw new UnprocessableEntityException(
        validationErrorResponse(errors, undefined, locale),
      );
    }

    req.locale = locale;
    return true;
  }

  private isDocsOrOpenApiPath(path: string): boolean {
    return (
      path.startsWith("/api/v1/docs") ||
      path === "/api/v1/docs-json" ||
      path.endsWith("/docs")
    );
  }

  private isAcceptHeaderExemptPath(path: string): boolean {
    return ACCEPT_HEADER_EXEMPT_PATHS.some((pattern) => pattern.test(path));
  }

  private isAcceptHeaderValid(acceptHeader: unknown): boolean {
    if (typeof acceptHeader !== "string" || acceptHeader.trim() === "") {
      return false;
    }

    const tokens = acceptHeader
      .split(",")
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean);

    return tokens.some((token) => {
      if (token === "*/*") return true;
      if (
        token === "application/json" ||
        token.startsWith("application/json;") ||
        token === "application/pdf" ||
        token.startsWith("application/pdf;") ||
        token === "image/png" ||
        token.startsWith("image/png;") ||
        token === "text/html" ||
        token.startsWith("text/html;")
      ) {
        return true;
      }
      return false;
    });
  }
}
