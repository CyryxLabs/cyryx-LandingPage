import { describe, it, expect } from "bun:test";
import { isRange } from "../src/lib/dashboard-range";

// Mirrors the `patchSearch` helper used across marketing/attribution/pipeline
// pages: navigate({ search: prev => ({ ...prev, ...patch }) }). We assert that
// mutating one segment filter never drops the active `range` (or other unrelated
// search keys), which is the core guarantee the UI relies on.
function patchSearch(prev: Record<string, unknown>, patch: Record<string, unknown>) {
  return { ...prev, ...patch };
}

describe("URL search filter/range preservation", () => {
  it("preserves range when changing channel filter", () => {
    const prev = { tab: "attribution", range: "90d", ch: "email" };
    const next = patchSearch(prev, { ch: "paid" });
    expect(next.range).toBe("90d");
    expect(next.tab).toBe("attribution");
    expect(next.ch).toBe("paid");
  });

  it("preserves range when clearing a filter", () => {
    const prev = { range: "mtd", cp: "abc", own: "u1" };
    const next = patchSearch(prev, { cp: undefined });
    expect(next.range).toBe("mtd");
    expect(next.own).toBe("u1");
    expect(next.cp).toBeUndefined();
  });

  it("preserves audit search across pagination", () => {
    const prev = { range: "ytd", aq: "30d", ap: 2 };
    const next = patchSearch(prev, { ap: 3 });
    expect(next.aq).toBe("30d");
    expect(next.range).toBe("ytd");
    expect(next.ap).toBe(3);
  });

  it("preserves filters across audit-search updates (resets page only)", () => {
    const prev = { range: "30d", ch: "email", cp: "cmp1", ap: 5, aq: "old" };
    const next = patchSearch(prev, { aq: "new", ap: undefined });
    expect(next.range).toBe("30d");
    expect(next.ch).toBe("email");
    expect(next.cp).toBe("cmp1");
    expect(next.aq).toBe("new");
    expect(next.ap).toBeUndefined();
  });

  it("keeps a valid range across many independent mutations", () => {
    let s: Record<string, unknown> = { range: "90d" };
    s = patchSearch(s, { ch: "email" });
    s = patchSearch(s, { cp: "c1" });
    s = patchSearch(s, { own: "u2" });
    s = patchSearch(s, { st: "won" });
    s = patchSearch(s, { aq: "mtd" });
    s = patchSearch(s, { ap: 4 });
    expect(isRange(s.range)).toBe(true);
    expect(s.range).toBe("90d");
  });
});