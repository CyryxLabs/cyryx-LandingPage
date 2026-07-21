import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { globby } from "globby";
import path from "node:path";
import { loadForbiddenTerms } from "./_forbidden-terms";

const FORBIDDEN_PATTERNS = loadForbiddenTerms();

test("Source code is free of forbidden terms", async () => {
  const files = await globby(["src/**/*.{ts,tsx,md,mdx,css}"], { gitignore: true });
  const offenders: string[] = [];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    for (const { label, pattern } of FORBIDDEN_PATTERNS) {
      if (pattern.test(content)) offenders.push(`${label} → ${path.relative(process.cwd(), file)}`);
    }
  }
  expect(offenders, offenders.join("\n")).toEqual([]);
});

test("Rendered landing page is free of forbidden terms", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const text = await page.evaluate(() => document.body.innerText);
  const offenders = FORBIDDEN_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(
    (p) => p.label,
  );
  expect(offenders, offenders.join(", ")).toEqual([]);
});

test("Public product naming is consistent (MAAX Studio + Lyra, no Runtime framing)", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const text = await page.evaluate(() => document.body.innerText);
  expect(text).toMatch(/MAAX Studio/);
  expect(text).toMatch(/Lyra/);
  expect(text).not.toMatch(/MAAX Runtime/);
  // MAAX Studio must never be described as a plugin/extension
  expect(text).not.toMatch(/MAAX Studio[^.]{0,80}\bplug-?in\b/i);
  expect(text).not.toMatch(/MAAX Studio[^.]{0,80}\bextension\b/i);
});
