import { AsyncLocalStorage } from "node:async_hooks";
import { performance } from "node:perf_hooks";
import type { Pool } from "mariadb";

/**
 * Instrumentation de performance TEMPORAIRE (audit de charge).
 * Activée uniquement si PERF_PROFILING=1|true. Zéro coût sinon.
 * À retirer / laisser désactivée en production après l'audit.
 */
export function perfProfilingEnabled(): boolean {
  const v = process.env.PERF_PROFILING;
  return v === "1" || v === "true";
}

/** Seuil (ms) au-delà duquel une requête SQL est comptée comme "lente". */
export const PERF_SLOW_QUERY_MS = Number(process.env.PERF_SLOW_QUERY_MS ?? 200);

/** Stats DB accumulées pour UNE requête HTTP (via AsyncLocalStorage). */
export interface RequestDbStats {
  queries: number;
  dbMs: number;
  slow: number;
}

export const perfRequestStore = new AsyncLocalStorage<RequestDbStats>();

/** Fenêtre glissante globale, vidée à chaque flush du sampler. */
export const perfGlobalDb = {
  queries: 0,
  dbMs: 0,
  maxMs: 0,
  slow: 0,
};

export function resetPerfGlobalDb(): void {
  perfGlobalDb.queries = 0;
  perfGlobalDb.dbMs = 0;
  perfGlobalDb.maxMs = 0;
  perfGlobalDb.slow = 0;
}

function recordDbQuery(durationMs: number): void {
  perfGlobalDb.queries += 1;
  perfGlobalDb.dbMs += durationMs;
  if (durationMs > perfGlobalDb.maxMs) perfGlobalDb.maxMs = durationMs;

  const slow = durationMs >= PERF_SLOW_QUERY_MS;
  if (slow) perfGlobalDb.slow += 1;

  const store = perfRequestStore.getStore();
  if (store) {
    store.queries += 1;
    store.dbMs += durationMs;
    if (slow) store.slow += 1;
  }
}

/**
 * Enrobe `pool.query` et `pool.execute` pour chronométrer chaque requête SQL.
 * Le timing est mesuré dans la continuation async de l'appelant,
 * donc l'attribution par requête HTTP (ALS) reste correcte.
 * Note: ne couvre pas les requêtes émises via une connexion "checked-out"
 * (transactions Prisma) — non utilisées sur les routes du benchmark lecture.
 */
export function instrumentDbPool(pool: Pool): void {
  const anyPool = pool as unknown as Record<
    "query" | "execute",
    (...args: unknown[]) => Promise<unknown>
  > & { __perfInstrumented?: boolean };
  if (anyPool.__perfInstrumented) return;
  anyPool.__perfInstrumented = true;

  for (const method of ["query", "execute"] as const) {
    const original = anyPool[method].bind(pool);
    anyPool[method] = (...args: unknown[]): Promise<unknown> => {
      const start = performance.now();
      return original(...args).then(
        (res) => {
          recordDbQuery(performance.now() - start);
          return res;
        },
        (err: unknown) => {
          recordDbQuery(performance.now() - start);
          throw err;
        },
      );
    };
  }
}
