import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * Spec API mobile : les listes paginées en GET renvoient 206 Partial Content
 * (corps { success, message, data, pagination }). Les suggestions POST (ex. preview)
 * avec `isSuggestions: true` suivent le même format et le même statut.
 */
@Injectable()
export class PaginatedResponseStatusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    return next.handle().pipe(
      map((body: unknown) => {
        // 206 uniquement pour les vraies listes paginées : { data: T[], pagination }.
        // Un détail (objet unique dans `data`) ne doit jamais recevoir 206 même si
        // un champ parasite `pagination` apparaissait sur le corps.
        const b = body as {
          success?: boolean;
          pagination?: unknown;
          data?: unknown;
          isSuggestions?: boolean;
        };
        const isPaginatedSuccess =
          body &&
          typeof body === "object" &&
          b.success === true &&
          b.pagination != null &&
          Array.isArray(b.data);
        if (
          isPaginatedSuccess &&
          (req.method === "GET" || b.isSuggestions === true)
        ) {
          res.status(HttpStatus.PARTIAL_CONTENT);
        }
        return body;
      }),
    );
  }
}
