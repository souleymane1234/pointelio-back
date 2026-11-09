import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import type { Request } from "express";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import {
  perfProfilingEnabled,
  perfRequestStore,
  type RequestDbStats,
} from "./perf-metrics";

/**
 * Attribue le temps DB (nb requêtes, ms SQL, requêtes lentes) à CHAQUE requête
 * HTTP via AsyncLocalStorage, et log une ligne [PERF-REQ] pour les requêtes
 * lentes (> PERF_REQ_LOG_MS) ou faisant de nombreuses requêtes SQL.
 * Actif uniquement si PERF_PROFILING=1.
 */
@Injectable()
export class PerfRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger("PERF-REQ");
  private readonly logThresholdMs = Number(process.env.PERF_REQ_LOG_MS ?? 500);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (!perfProfilingEnabled() || context.getType() !== "http") {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const url = req.originalUrl ?? req.url;
    const store: RequestDbStats = { queries: 0, dbMs: 0, slow: 0 };
    const start = Date.now();

    // Le store ALS doit être actif pendant l'exécution du handler (et ses awaits),
    // donc on souscrit au handler à l'intérieur de perfRequestStore.run().
    return new Observable((subscriber) => {
      perfRequestStore.run(store, () => {
        const inner = next
          .handle()
          .pipe(
            finalize(() => {
              const totalMs = Date.now() - start;
              if (totalMs >= this.logThresholdMs || store.queries >= 5) {
                const otherMs = Math.max(0, totalMs - store.dbMs);
                this.logger.log(
                  `${method} ${url} total=${totalMs}ms db=${store.dbMs.toFixed(0)}ms ` +
                    `q=${store.queries} slow=${store.slow} nonDb=${otherMs.toFixed(0)}ms`,
                );
              }
            }),
          )
          .subscribe({
            next: (value) => subscriber.next(value),
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete(),
          });
        return () => inner.unsubscribe();
      });
    });
  }
}
