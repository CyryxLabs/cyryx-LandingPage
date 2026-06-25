import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { globby } from "globby";

const FORBIDDEN: RegExp[] = [
  /\bSOC\s?2\b/i,
  /\bISO\s?27001\b/i,
  /\bHIPAA\b/i,
  /\b148\+/,
  /\b62%/,
  /\b97\.4%/,
  /\bCursor\b/,
  /\bWindsurf\b/,
  /\bCopilot\b/,
  /\bVS\s?Code\s+plugin\b/i,
];

test("Built production bundles are clean and include MAAX Runtime/Studio", async () => {
  const files = await globby([".output/**/*.{html,js,mjs,css}", "dist/**/*.{html,js,mjs,css}"]);
  test.skip(files.length === 0, "No production build artifacts found (run `bun run build` first).");

  const offenders: string[] = [];
  let hasRuntime = false;
  let hasStudio = false;
  for (const file of files) {
    const content = await readFile(file, "utf8");
    if (/MAAX Runtime/.test(content)) hasRuntime = true;
    if (/MAAX Studio/.test(content)) hasStudio = true;
    for (const pattern of FORBIDDEN) {
      if (pattern.test(content)) offenders.push(`${pattern} → ${file}`);
    }
  }
  expect(offenders, offenders.join("\n")).toEqual([]);
  expect(hasRuntime, "MAAX Runtime missing from built bundles").toBe(true);
  expect(hasStudio, "MAAX Studio missing from built bundles").toBe(true);
});