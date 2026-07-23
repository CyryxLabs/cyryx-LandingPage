// Pure helpers for department dashboards' time range. Kept out of
// DeptDashboard.tsx so tests and other utilities can consume them
// without pulling in recharts / React.
export type Range = "mtd" | "30d" | "90d" | "ytd";

export const RANGE_OPTIONS: { key: Range; label: string }[] = [
  { key: "mtd", label: "MTD" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "ytd", label: "YTD" },
];

export function rangeBounds(range: Range, now: Date = new Date()): { start: number; end: number } {
  const end = now.getTime();
  if (range === "mtd") return { start: new Date(now.getFullYear(), now.getMonth(), 1).getTime(), end };
  if (range === "ytd") return { start: new Date(now.getFullYear(), 0, 1).getTime(), end };
  const days = range === "30d" ? 30 : 90;
  return { start: end - days * 864e5, end };
}

export function rangeLabel(range: Range): string {
  return RANGE_OPTIONS.find((r) => r.key === range)?.label ?? range;
}

export function isRange(v: unknown): v is Range {
  return v === "mtd" || v === "30d" || v === "90d" || v === "ytd";
}