import { describe, it, expect } from "bun:test";
import { summarizeDiff } from "../src/lib/attribution";
import { rangeBounds, isRange } from "../src/lib/dashboard-range";

function makeResult(overrides: Partial<Parameters<typeof summarizeDiff>[0]> = {}) {
  return {
    diff: [
      { action: "marked_won" as const },
      { action: "marked_won" as const },
      { action: "cleared" as const },
    ],
    marked_won: 2,
    cleared: 1,
    affected_lead_ids: ["l1", "l2", "l3"],
    affected_deal_ids: ["d1", "d2"],
    pipeline_before: 1000,
    pipeline_after: 1500,
    revenue_before: 400,
    revenue_after: 600,
    ...overrides,
  };
}

describe("summarizeDiff", () => {
  it("counts changes, net leads, and computes deltas", () => {
    const s = summarizeDiff(makeResult());
    expect(s.changes).toBe(3);
    expect(s.markedWon).toBe(2);
    expect(s.cleared).toBe(1);
    expect(s.netLeads).toBe(1);
    expect(s.affectedLeads).toBe(3);
    expect(s.affectedDeals).toBe(2);
    expect(s.pipelineDelta).toBe(500);
    expect(s.revenueDelta).toBe(200);
    expect(s.pipelinePct).toBeCloseTo(50, 5);
    expect(s.revenuePct).toBeCloseTo(50, 5);
  });

  it("returns null pct when baseline is zero", () => {
    const s = summarizeDiff(makeResult({ pipeline_before: 0, revenue_before: 0 }));
    expect(s.pipelinePct).toBeNull();
    expect(s.revenuePct).toBeNull();
  });

  it("handles negative deltas (net cleared)", () => {
    const s = summarizeDiff(makeResult({
      diff: [{ action: "cleared" as const }, { action: "cleared" as const }],
      marked_won: 0, cleared: 2,
      pipeline_before: 1000, pipeline_after: 700,
      revenue_before: 500, revenue_after: 300,
    }));
    expect(s.netLeads).toBe(-2);
    expect(s.pipelineDelta).toBe(-300);
    expect(s.revenueDelta).toBe(-200);
    expect(s.pipelinePct).toBeCloseTo(-30, 5);
  });

  it("no changes when diff is empty", () => {
    const s = summarizeDiff(makeResult({
      diff: [], marked_won: 0, cleared: 0,
      affected_lead_ids: [], affected_deal_ids: [],
      pipeline_before: 500, pipeline_after: 500,
      revenue_before: 200, revenue_after: 200,
    }));
    expect(s.changes).toBe(0);
    expect(s.pipelineDelta).toBe(0);
    expect(s.revenueDelta).toBe(0);
    expect(s.pipelinePct).toBe(0);
  });
});

describe("rangeBounds", () => {
  const now = new Date("2026-07-15T12:00:00.000Z");
  it("MTD starts at first day of month", () => {
    const { start, end } = rangeBounds("mtd", now);
    expect(start).toBeLessThan(end);
    expect(new Date(start).getDate()).toBe(1);
    expect(new Date(start).getMonth()).toBe(now.getMonth());
  });
  it("YTD starts at Jan 1", () => {
    const { start } = rangeBounds("ytd", now);
    const d = new Date(start);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(1);
  });
  it("30d spans exactly 30*864e5 ms", () => {
    const { start, end } = rangeBounds("30d", now);
    expect(end - start).toBe(30 * 864e5);
  });
  it("90d spans exactly 90*864e5 ms", () => {
    const { start, end } = rangeBounds("90d", now);
    expect(end - start).toBe(90 * 864e5);
  });
  it("all ranges produce start<end", () => {
    for (const r of ["mtd","30d","90d","ytd"] as const) {
      const { start, end } = rangeBounds(r, now);
      expect(start).toBeLessThan(end);
    }
  });
});

describe("isRange", () => {
  it("accepts valid range keys", () => {
    expect(isRange("mtd")).toBe(true);
    expect(isRange("30d")).toBe(true);
    expect(isRange("90d")).toBe(true);
    expect(isRange("ytd")).toBe(true);
  });
  it("rejects garbage", () => {
    expect(isRange("foo")).toBe(false);
    expect(isRange(undefined)).toBe(false);
    expect(isRange(null)).toBe(false);
    expect(isRange(30)).toBe(false);
  });
});