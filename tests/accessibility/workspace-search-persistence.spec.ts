import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * Source-level integration guardrail: the internal /workspace surface is
 * auth-gated, so we assert at the source level the invariants that keep
 * ?w and ?tab consistent when navigating between /workspace/pipeline,
 * /workspace/finance and /workspace/products via the sidebar.
 *
 * Contract:
 *  1. The parent layout route validates and retains ?w and ?tab.
 *  2. Sub-module route files do NOT redefine validateSearch (so they
 *     inherit the parent schema and retention middleware).
 *  3. The shared WorkspaceShell sidebar <Link>s don't pass a `search`
 *     prop (so retainSearchParams keeps existing params on navigation).
 *  4. The 7/30/90d picker uses the functional `search: (prev) => ...`
 *     form so ?tab and other params are preserved when ?w changes.
 */

const PARENT = "src/routes/_authenticated/workspace.tsx";
const SHELL = "src/components/cyryx/workspace/WorkspaceShell.tsx";
const MODULES = [
  "src/routes/_authenticated/workspace.pipeline.tsx",
  "src/routes/_authenticated/workspace.finance.tsx",
  "src/routes/_authenticated/workspace.products.tsx",
];

test("workspace parent route validates and retains ?w and ?tab", () => {
  const src = readFileSync(PARENT, "utf8");
  expect(src, "parent must define validateSearch for ?w/?tab").toMatch(
    /validateSearch\s*:/,
  );
  expect(src, "parent must retain ?w and ?tab across navigation").toMatch(
    /retainSearchParams\(\s*\[\s*["']w["']\s*,\s*["']tab["']\s*\]\s*\)/,
  );
});

test("sub-modules inherit search params (no local validateSearch override)", () => {
  const failures: string[] = [];
  for (const file of MODULES) {
    const src = readFileSync(file, "utf8");
    if (/validateSearch\s*:/.test(src)) {
      failures.push(`${file}: must NOT define validateSearch (inherit from parent)`);
    }
  }
  expect(failures, failures.join("\n")).toEqual([]);
});

test("sidebar Links do not override search (retainSearchParams keeps ?w/?tab)", () => {
  const src = readFileSync(SHELL, "utf8");
  // Any explicit `search=` prop on the sidebar Links would replace the
  // inherited params and break persistence across modules.
  const linkBlocks = src.match(/<Link[\s\S]*?>/g) ?? [];
  const offenders = linkBlocks.filter((l) => /\bsearch\s*=/.test(l));
  expect(offenders, offenders.join("\n---\n")).toEqual([]);
});

test("window picker preserves other params via functional search updater", () => {
  const src = readFileSync(SHELL, "utf8");
  expect(
    src,
    "WsWindowPicker must use `search: (prev) => ({ ...prev, w })` to preserve ?tab",
  ).toMatch(/search\s*:\s*\(\s*prev[^)]*\)\s*=>\s*\(\s*\{\s*\.\.\.prev\s*,\s*w\s*\}\s*\)/);
});