import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { normalizeLocale, translate } from "../i18n";
import { validationErrorResponse } from "../utils/response.util";

/**
 * Spec API mobile : Accept obligatoire.
 * Le header `language` est optionnel (fallback locale par défaut côté API).
 * Swagger, assets docs et uploads multipart exclus (clients souvent sans
 * `Accept: application/json`).
 */
@Injectable()
export class MobileApiHeadersMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MobileApiHeadersMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const path =
      req.path ||
      (req.originalUrl && req.originalUrl.split("?")[0]) ||
      req.url.split("?")[0];

    if (this.isDocsOrOpenApiPath(path)) {
      return next();
    }

    if (!this.hasMatchingRoute(req, path)) {
      return next();
    }

    const locale = normalizeLocale(req.headers.language as string);

    const accept = req.headers.accept;
    const acceptOk = this.isAcceptHeaderValid(accept);

    const errors: string[] = [];
    if (
      !acceptOk &&
      !this.isUploadMultipartPath(path) &&
      !this.isAdminLoginDecisionPath(path)
    ) {
      errors.push(translate(locale, "acceptRequired"));
    }

    if (errors.length > 0) {
      this.logger.warn(
        `${req.method} ${path} - 422 invalid headers: ${errors.join(" | ")}`,
      );
      return res
        .status(422)
        .json(validationErrorResponse(errors, undefined, locale));
    }

    req.locale = locale;
    next();
  }

  /**
   * Le middleware est global; on n'applique la validation d'headers
   * que si une route API existe réellement pour la requête.
   * Sinon on laisse Nest retourner un 404 standard.
   */
  private hasMatchingRoute(req: Request, path: string): boolean {
    const method = req.method.toLowerCase();
    const stack = ((req.app as any)?._router?.stack ??
      (req.app as any)?.router?.stack ??
      []) as Array<any>;

    if (!Array.isArray(stack) || stack.length === 0) {
      // Si l'introspection du routeur échoue, conserver le comportement strict.
      return true;
    }

    return this.stackHasMatch(stack, path, method);
  }

  private stackHasMatch(
    stack: Array<any>,
    path: string,
    method: string,
  ): boolean {
    for (const layer of stack) {
      if (!layer) continue;

      if (layer.route) {
        if (this.isCatchAllRoutePath(layer.route.path)) {
          continue;
        }

        const methods = layer.route.methods as
          Record<string, boolean> | undefined;
        const methodAllowed = methods?.[method] || methods?.all;
        if (!methodAllowed) continue;

        if (typeof layer.match === "function" && layer.match(path)) {
          return true;
        }
        continue;
      }

      const nestedStack = layer.handle?.stack as Array<any> | undefined;
      if (nestedStack && this.stackHasMatch(nestedStack, path, method)) {
        return true;
      }
    }

    return false;
  }

  private isCatchAllRoutePath(routePath: unknown): boolean {
    const values = Array.isArray(routePath) ? routePath : [routePath];
    return values.some((value) => {
      if (typeof value !== "string") return false;
      return value === "*" || value === "/*" || value === "/(.*)";
    });
  }

  private isDocsOrOpenApiPath(path: string): boolean {
    return (
      path.startsWith("/api/v1/docs") ||
      path === "/api/v1/docs-json" ||
      path.endsWith("/docs")
    );
  }

  /** Lien e-mail Approuver / Rejeter : le navigateur envoie text/html, pas application/json. */
  private isAdminLoginDecisionPath(path: string): boolean {
    return path.includes("/auth/admin/login/decision");
  }

  /** POST multipart /uploads/* : ne pas exiger Accept: application/json. */
  private isUploadMultipartPath(path: string): boolean {
    return /\/uploads\//.test(path);
  }

  /**
   * Autorise :
   * - application/json
   * - application/json; charset=utf-8
   * - wildcard any/any (Swagger / certains clients HTTP)
   */
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
      return (
        token === "application/json" || token.startsWith("application/json;")
      );
    });
  }
}
