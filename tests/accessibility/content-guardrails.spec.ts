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

test("Homepage never mentions the discontinued MAAX product", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const text = await page.evaluate(() => document.body.innerText);
  expect(text).not.toMatch(/MAAX/i);
  const maaxLinks = await page.locator('a[href*="maax" i]').count();
  expect(maaxLinks).toBe(0);
});
