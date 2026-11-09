import { createHash } from "crypto";
import { Injectable } from "@nestjs/common";
import { AUTH_REVOKED_TOKEN_KEY_PREFIX } from "../constants/auth-token-revocation.constants";

@Injectable()
export class AuthTokenRevocationStore {
  private readonly entries = new Map<string, number>();

  private key(token: string): string {
    const hash = createHash("sha256").update(token).digest("hex");
    return `${AUTH_REVOKED_TOKEN_KEY_PREFIX}:${hash}`;
  }

  private prune(now = Date.now()): void {
    for (const [key, expiresAt] of this.entries) {
      if (expiresAt <= now) this.entries.delete(key);
    }
  }

  async revoke(token: string, ttlSec: number): Promise<void> {
    if (ttlSec <= 0) return;
    this.prune();
    this.entries.set(this.key(token), Date.now() + ttlSec * 1000);
  }

  async isRevoked(token: string): Promise<boolean> {
    const now = Date.now();
    const expiresAt = this.entries.get(this.key(token));
    if (!expiresAt) return false;
    if (expiresAt <= now) {
      this.entries.delete(this.key(token));
      return false;
    }
    return true;
  }

  /**
   * Révoque le jeton de façon atomique et indique si cet appel l'a consommé.
   * `false` = déjà révoqué (rejeu ou requêtes concurrentes).
   */
  async consume(token: string, ttlSec: number): Promise<boolean> {
    this.prune();
    const key = this.key(token);
    const now = Date.now();
    const existing = this.entries.get(key);
    if (existing && existing > now) return false;
    this.entries.set(key, now + Math.max(ttlSec, 1) * 1000);
    return true;
  }
}
