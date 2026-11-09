import { REDIS_KEY_PREFIX } from "../../common/constants/app.constants";

/**
 * Namespace Keyv (@nestjs/cache-manager) : les clés cache sont stockées sous `keyv::keyv:…`.
 * @see src/cache/cache.module.ts
 */
export const REDIS_KEYV_SCAN_PATTERN = "keyv::*";

/** Clés Redis écrites directement via ioredis (sessions, throttling). */
export const REDIS_DIRECT_KEY_PATTERNS = [
  `${REDIS_KEY_PREFIX}:*`,
  "throttler:*",
] as const;
