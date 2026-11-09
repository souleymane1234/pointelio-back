import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { monitorEventLoopDelay, type IntervalHistogram } from "node:perf_hooks";
import { PrismaService } from "../../infra/prisma/prisma.service";
import {
  perfGlobalDb,
  perfProfilingEnabled,
  resetPerfGlobalDb,
} from "./perf-metrics";

/**
 * Échantillonneur périodique (audit de charge). Log une ligne [PERF] toutes
 * les PERF_SAMPLE_MS ms avec: lag event-loop, saturation du pool DB, débit SQL.
 * Actif uniquement si PERF_PROFILING=1.
 */
@Injectable()
export class PerfProfilingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("PERF");
  private timer?: NodeJS.Timeout;
  private loop?: IntervalHistogram;
  private readonly intervalMs = Number(process.env.PERF_SAMPLE_MS ?? 2000);

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit(): void {
    if (!perfProfilingEnabled()) return;

    this.loop = monitorEventLoopDelay({ resolution: 20 });
    this.loop.enable();

    this.timer = setInterval(() => this.flush(), this.intervalMs);
    this.timer.unref?.();

    this.logger.warn(
      `Profiling ACTIF (sample=${this.intervalMs}ms). PERF_PROFILING=1 — à désactiver après l'audit.`,
    );
  }

  private flush(): void {
    const toMs = (ns: number): number => ns / 1e6;
    const meanLag = this.loop ? toMs(this.loop.mean) : 0;
    const p99Lag = this.loop ? toMs(this.loop.percentile(99)) : 0;
    const maxLag = this.loop ? toMs(this.loop.max) : 0;
    this.loop?.reset();

    const pool = this.prisma.pool;
    const total = pool.totalConnections();
    const idle = pool.idleConnections();
    const waiting = pool.taskQueueSize();

    const db = { ...perfGlobalDb };
    resetPerfGlobalDb();
    const qps = db.queries / (this.intervalMs / 1000);
    const avgMs = db.queries > 0 ? db.dbMs / db.queries : 0;

    this.logger.log(
      `loopLagMs mean=${meanLag.toFixed(1)} p99=${p99Lag.toFixed(1)} max=${maxLag.toFixed(1)} | ` +
        `dbPool total=${total} idle=${idle} waiting=${waiting} | ` +
        `db q/s=${qps.toFixed(0)} avgMs=${avgMs.toFixed(1)} maxMs=${db.maxMs.toFixed(1)} slow=${db.slow}`,
    );
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.loop?.disable();
  }
}
