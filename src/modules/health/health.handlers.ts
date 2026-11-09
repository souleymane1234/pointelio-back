import type { Request, RequestHandler, Response } from "express";
import type Redis from "ioredis";
import type { PrismaService } from "../../infra/prisma/prisma.service";

export const HEALTH_LIVE_PATH = "/api/v1/health/live";
export const HEALTH_READY_PATH = "/api/v1/health/ready";

const CHECK_TIMEOUT_MS = 2_000;

type CheckStatus = "up" | "down" | "skipped";

type HealthDependencies = {
  prisma: PrismaService;
  redis: Redis | null;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

async function check(run: () => Promise<unknown>): Promise<CheckStatus> {
  try {
    await withTimeout(run(), CHECK_TIMEOUT_MS);
    return "up";
  } catch {
    return "down";
  }
}

/**
 * Routes Express montées avant le routeur Nest : elles échappent aux guards
 * (JWT, en-têtes mobiles, throttle) et aux middlewares (maintenance, version),
 * pour que l'orchestrateur et le load balancer puissent toujours les appeler.
 */
export function createHealthHandlers({ prisma, redis }: HealthDependencies): {
  live: RequestHandler;
  ready: RequestHandler;
  markShuttingDown: () => void;
} {
  let shuttingDown = false;

  const live: RequestHandler = (_req: Request, res: Response) => {
    res
      .status(200)
      .json({ status: "ok", uptimeSec: Math.round(process.uptime()) });
  };

  const ready: RequestHandler = (_req: Request, res: Response) => {
    void (async () => {
      if (shuttingDown) {
        res.status(503).json({ status: "shutting_down" });
        return;
      }

      const [database, cache] = await Promise.all([
        check(() => prisma.$queryRaw`SELECT 1`),
        redis
          ? check(() => redis.ping())
          : Promise.resolve<CheckStatus>("skipped"),
      ]);
      const healthy = database === "up" && cache !== "down";

      res.status(healthy ? 200 : 503).json({
        status: healthy ? "ok" : "error",
        checks: { database, redis: cache },
      });
    })();
  };

  return {
    live,
    ready,
    markShuttingDown: () => {
      shuttingDown = true;
    },
  };
}
