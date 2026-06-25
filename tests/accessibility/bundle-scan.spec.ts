import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { globby } from "globby";
import { loadForbiddenTerms } from "./_forbidden-terms";

const FORBIDDEN = loadForbiddenTerms();

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
    for (const { label, pattern } of FORBIDDEN) {
      if (pattern.test(content)) offenders.push(`${label} → ${file}`);
    }
  }
  expect(offenders, offenders.join("\n")).toEqual([]);
  expect(hasRuntime, "MAAX Runtime missing from built bundles").toBe(true);
  expect(hasStudio, "MAAX Studio missing from built bundles").toBe(true);
});