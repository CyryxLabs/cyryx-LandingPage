import { createHash } from "crypto";

/** Best-effort IP extraction from edge headers, then SHA-256 with daily salt. */
export function clientIpHash(request: Request): string {
  const xff = request.headers.get("x-forwarded-for") ?? "";
  const ip = xff.split(",")[0]?.trim() || request.headers.get("cf-connecting-ip") || "unknown";
  // Daily-rotated salt so the hash is not a persistent identifier.
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`cyryx:${day}:${ip}`).digest("hex").slice(0, 32);
}

export function userAgentHash(request: Request): string {
  const ua = request.headers.get("user-agent") ?? "";
  return createHash("sha256").update(ua).digest("hex").slice(0, 16);
}
