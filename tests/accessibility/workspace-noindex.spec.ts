import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { globby } from "globby";

/**
 * Source-level guardrail for the internal /workspace surface.
 *
 * Runtime crawling isn't viable — /workspace and /auth are auth-gated by the
 * managed _authenticated layout — so we assert at the source level that every
 * workspace route (and /auth) uses buildHead() with valid PageMetaInput fields
 * AND appends robots: noindex, nofollow. This keeps typecheck honest (via
 * buildHead's PageMetaInput type) and prevents the internal console from
 * ever leaking into search indexes.
 */
test("workspace + auth routes emit robots noindex and use buildHead()", async () => {
  const files = await globby([
    "src/routes/_authenticated/workspace*.tsx",
    "src/routes/auth.tsx",
  ]);
  expect(files.length).toBeGreaterThan(0);

  const failures: string[] = [];
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    if (!/buildHead\(\s*\{/.test(src)) {
      failures.push(`${file}: missing buildHead({...}) — must use PageMetaInput`);
    }
    if (!/robots["']?\s*,\s*content:\s*["']noindex,\s*nofollow["']/.test(src)) {
      failures.push(`${file}: missing robots: "noindex, nofollow" meta`);
    }
  }
  expect(failures, failures.join("\n")).toEqual([]);
});