import type { Request } from "express";

/**
 * Extrait l'IP publique du client (pour audit / géoloc IP).
 * Ordre : Cloudflare → Akamai → x-real-ip → x-forwarded-for (1ère IP publique)
 * → req.ip → socket.
 *
 * Note : une IP donne une zone (ville/FAI), pas une position GPS exacte.
 */
export function resolveClientIp(req: Request): string | undefined {
  const candidates: string[] = [];

  pushHeader(candidates, req.headers["cf-connecting-ip"]);
  pushHeader(candidates, req.headers["true-client-ip"]);
  pushHeader(candidates, req.headers["x-real-ip"]);

  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    for (const part of forwarded.split(",")) {
      pushCandidate(candidates, part);
    }
  } else if (Array.isArray(forwarded)) {
    for (const entry of forwarded) {
      for (const part of entry.split(",")) {
        pushCandidate(candidates, part);
      }
    }
  }

  if (req.ip) pushCandidate(candidates, req.ip);
  if (req.socket?.remoteAddress) {
    pushCandidate(candidates, req.socket.remoteAddress);
  }

  const publicIp = candidates.find((ip) => isPublicIp(ip));
  if (publicIp) return publicIp;

  // Fallback (dev local : 127.0.0.1 / ::1 — non géolocalisable)
  return candidates[0];
}

function pushHeader(
  candidates: string[],
  value: string | string[] | undefined,
): void {
  if (typeof value === "string") {
    pushCandidate(candidates, value);
  } else if (Array.isArray(value) && value[0]) {
    pushCandidate(candidates, value[0]);
  }
}

function pushCandidate(candidates: string[], raw: string | undefined): void {
  const ip = normalizeIp(raw);
  if (!ip) return;
  if (candidates.includes(ip)) return;
  candidates.push(ip);
}

/** Normalise ::ffff:a.b.c.d → a.b.c.d et retire le suffixe zone IPv6. */
export function normalizeIp(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let ip = raw.trim().toLowerCase();
  if (!ip) return undefined;

  // "[2001:db8::1]:1234" ou "1.2.3.4:5678"
  if (ip.startsWith("[")) {
    const end = ip.indexOf("]");
    if (end > 0) ip = ip.slice(1, end);
  } else if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(ip)) {
    ip = ip.split(":")[0];
  }

  ip = ip.split("%")[0];

  if (ip.startsWith("::ffff:")) {
    ip = ip.slice("::ffff:".length);
  }

  return ip || undefined;
}

/** True si l'IP est routable sur Internet (exploitable pour géoloc IP). */
export function isPublicIp(ip: string): boolean {
  const normalized = normalizeIp(ip);
  if (!normalized) return false;

  if (
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized === "0.0.0.0" ||
    normalized === "::"
  ) {
    return false;
  }

  // IPv4
  if (/^\d+\.\d+\.\d+\.\d+$/.test(normalized)) {
    const [a, b] = normalized.split(".").map(Number);
    if (a === 10) return false; // 10.0.0.0/8
    if (a === 127) return false; // loopback
    if (a === 0) return false;
    if (a === 169 && b === 254) return false; // link-local
    if (a === 172 && b >= 16 && b <= 31) return false; // 172.16.0.0/12
    if (a === 192 && b === 168) return false; // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return false; // CGNAT 100.64.0.0/10
    if (a >= 224) return false; // multicast / reserved
    return true;
  }

  // IPv6 privés / locaux
  if (
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") || // unique local
    normalized.startsWith("fe80:") // link-local
  ) {
    return false;
  }

  return normalized.includes(":");
}
