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

/** Generic 1-hour rate-limit: counts rows in a table by ip_hash. */
export async function checkRateLimit(
  supabase: { from: (t: string) => any },
  table: string,
  ipHash: string,
  maxPerHour: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (error) return { allowed: true, remaining: maxPerHour }; // fail-open on counting
  const used = count ?? 0;
  return { allowed: used < maxPerHour, remaining: Math.max(0, maxPerHour - used) };
}