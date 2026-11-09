import type { Request } from "express";

export function extractBearerToken(request: Request): string | undefined {
  const raw = request.headers.authorization?.trim();
  if (!raw) return undefined;
  const [scheme, ...rest] = raw.split(/\s+/);
  if (scheme?.toLowerCase() !== "bearer" || rest.length === 0) return undefined;
  return rest.join(" ");
}
