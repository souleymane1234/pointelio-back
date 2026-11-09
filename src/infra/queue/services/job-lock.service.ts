import { Inject, Injectable, Logger } from "@nestjs/common";
import type Redis from "ioredis";
import { hostname } from "os";
import { REDIS_KEY_PREFIX } from "../../../common/constants/app.constants";
import { REDIS_OTP } from "../../redis/redis-otp.constants";

const LOCK_KEY_PREFIX = `${REDIS_KEY_PREFIX}:jobs:lock`;
/** Couvre le décalage d'horloge entre instances ; aucun job ne tourne plus d'une fois par minute. */
const SLOT_LOCK_TTL_MS = 10 * 60 * 1000;

/**
 * Garantit qu'un créneau cron n'est exécuté que par une seule instance.
 * La clé porte la minute planifiée (arrondie) et n'est jamais relâchée : une instance
 * dont l'horloge a quelques secondes d'écart retombe sur la même clé et passe son tour.
 */
@Injectable()
export class JobLockService {
  private readonly logger = new Logger(JobLockService.name);
  private readonly instanceId = `${hostname()}:${process.pid}`;

  constructor(@Inject(REDIS_OTP) private readonly redis: Redis | null) {}

  async runOncePerSlot(
    jobName: string,
    run: () => Promise<void>,
    now: Date = new Date(),
  ): Promise<void> {
    if (!this.redis) {
      await run();
      return;
    }

    const slot = Math.round(now.getTime() / 60_000);
    const key = `${LOCK_KEY_PREFIX}:${jobName}:${slot}`;

    let acquired: boolean;
    try {
      acquired =
        (await this.redis.set(
          key,
          this.instanceId,
          "PX",
          SLOT_LOCK_TTL_MS,
          "NX",
        )) === "OK";
    } catch (error) {
      this.logger.error(
        `[${jobName}] skipped: Redis unavailable for job lock (${String(error)})`,
      );
      return;
    }

    if (!acquired) {
      this.logger.debug(
        `[${jobName}] skipped: slot already taken by another instance`,
      );
      return;
    }

    await run();
  }
}
