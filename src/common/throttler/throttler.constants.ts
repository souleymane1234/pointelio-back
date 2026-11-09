/**
 * Limites sur les routes `auth/*` (anti brute-force).
 * Configurable via AUTH_THROTTLE_LIMIT / AUTH_THROTTLE_TTL_MS.
 * En dev : limite élevée par défaut pour les tests k6. En prod : 15/min/IP.
 */
function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === "") {
    return fallback;
  }
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback;
}

function defaultAuthThrottleLimit(): number {
  return process.env.NODE_ENV === "production" ? 15 : 100_000;
}

export const authThrottleOptions = () => ({
  default: {
    limit: parsePositiveInt(
      process.env.AUTH_THROTTLE_LIMIT,
      defaultAuthThrottleLimit(),
    ),
    ttl: parsePositiveInt(process.env.AUTH_THROTTLE_TTL_MS, 60_000),
  },
});
