import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { globby } from "globby";
import path from "node:path";

const FORBIDDEN_PATTERNS: { label: string; pattern: RegExp }[] = [
  { label: "SOC 2 claim", pattern: /\bSOC\s?2\b/i },
  { label: "ISO 27001 claim", pattern: /\bISO\s?27001\b/i },
  { label: "HIPAA claim", pattern: /\bHIPAA\b/i },
  { label: "Fake metric 148+", pattern: /\b148\+/ },
  { label: "Fake metric 62%", pattern: /\b62%/ },
  { label: "Fake metric 97.4%", pattern: /\b97\.4%/ },
  { label: "Fake metric 24 models", pattern: /\b24\s+models\b/i },
  { label: "Competitor: Cursor", pattern: /\bCursor\b/ },
  { label: "Competitor: Windsurf", pattern: /\bWindsurf\b/ },
  { label: "Competitor: Copilot", pattern: /\bCopilot\b/ },
  { label: "VS Code plugin framing", pattern: /\bVS\s?Code\s+plugin\b/i },
];

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
  const offenders = FORBIDDEN_PATTERNS.filter(({ pattern }) => pattern.test(text)).map((p) => p.label);
  expect(offenders, offenders.join(", ")).toEqual([]);
});

test("MAAX naming is consistent (Runtime + Studio, never 'plugin')", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const text = await page.evaluate(() => document.body.innerText);
  expect(text).toMatch(/MAAX Studio/);
  expect(text).toMatch(/MAAX Runtime/);
  // MAAX Studio must never be described as a plugin/extension
  expect(text).not.toMatch(/MAAX Studio[^.]{0,80}\bplug-?in\b/i);
  expect(text).not.toMatch(/MAAX Studio[^.]{0,80}\bextension\b/i);
});