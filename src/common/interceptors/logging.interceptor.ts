import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { Request } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();
    const { method, url, ip } = request;
    const now = Date.now();

    return next.handle().pipe(
      finalize(() => {
        const ms = Date.now() - now;
        if (!response.headersSent) {
          response.setHeader("X-Response-Time", `${ms}ms`);
        }
        this.logger.log(
          `${method} ${this.redactUrl(url)} ${response.statusCode} - ${ms}ms - ${ip}`,
        );
      }),
    );
  }

  private redactUrl(url: string): string {
    return url.replace(/([?&](?:token|request_id)=)[^&]*/gi, "$1[redacted]");
  }
}
