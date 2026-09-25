/**
 * Best-effort in-memory sliding-window limiter for the assistant. Each
 * serverless instance keeps its own window, so this bounds abuse per instance;
 * the per-request turn and length caps bound cost per call.
 */
const windows = new Map<string, number[]>();

export function allowRequest(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): boolean {
  const since = now - windowMs;
  const hits = (windows.get(key) ?? []).filter((t) => t > since);
  if (hits.length >= limit) {
    windows.set(key, hits);
    return false;
  }
  hits.push(now);
  windows.set(key, hits);
  if (windows.size > 5000) {
    for (const [k, v] of windows) {
      if (!v.some((t) => t > since)) windows.delete(k);
    }
  }
  return true;
}

export function resetRateLimits() {
  windows.clear();
}
