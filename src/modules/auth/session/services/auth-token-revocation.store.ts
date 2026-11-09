import { createHash } from "crypto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type Redis from "ioredis";
import { REDIS_OTP } from "../../../../infra/redis/redis-otp.constants";
import { AUTH_REVOKED_TOKEN_KEY_PREFIX } from "../constants/auth-token-revocation.constants";

@Injectable()
export class AuthTokenRevocationStore {
  private readonly logger = new Logger(AuthTokenRevocationStore.name);

  constructor(@Inject(REDIS_OTP) private readonly redis: Redis | null) {
    if (!this.redis) {
      this.logger.warn(
        "REDIS_URL absent : logout, désactivation et rotation des refresh tokens ne révoquent aucun JWT.",
      );
    }
  }

  private key(token: string): string {
    const hash = createHash("sha256").update(token).digest("hex");
    return `${AUTH_REVOKED_TOKEN_KEY_PREFIX}:${hash}`;
  }

  async revoke(token: string, ttlSec: number): Promise<void> {
    if (!this.redis || ttlSec <= 0) return;
    await this.redis.set(this.key(token), "1", "EX", ttlSec);
  }

  async isRevoked(token: string): Promise<boolean> {
    if (!this.redis) return false;
    return (await this.redis.exists(this.key(token))) === 1;
  }

  /**
   * Révoque le jeton de façon atomique et indique si cet appel l'a consommé.
   * `false` = déjà révoqué (rejeu ou requêtes concurrentes).
   */
  async consume(token: string, ttlSec: number): Promise<boolean> {
    if (!this.redis) return true;
    const result = await this.redis.set(
      this.key(token),
      "1",
      "EX",
      Math.max(ttlSec, 1),
      "NX",
    );
    return result === "OK";
  }
}
