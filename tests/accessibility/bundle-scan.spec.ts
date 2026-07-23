import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { globby } from "globby";
import { loadForbiddenTerms } from "./_forbidden-terms";

const FORBIDDEN = loadForbiddenTerms();

test("Built production bundles are clean and use the approved MAAX Studio identity", async () => {
  const globs = existsSync(".vercel/output")
    ? [".vercel/output/**/*.{html,js,mjs}", "!.vercel/output/**/_libs/**"]
    : existsSync(".output")
      ? [".output/**/*.{html,js,mjs}", "!.output/**/_libs/**"]
      : ["dist/**/*.{html,js,mjs}"];
  const files = await globby(globs);
  test.skip(files.length === 0, "No production build artifacts found (run `bun run build` first).");

  const offenders: string[] = [];
  let hasStudio = false;
  for (const file of files) {
    const content = await readFile(file, "utf8");
    if (/MAAX Runtime/.test(content)) offenders.push(`Retired MAAX Runtime label → ${file}`);
    if (/MAAX Studio/.test(content)) hasStudio = true;
    for (const { label, pattern } of FORBIDDEN) {
      if (pattern.test(content)) offenders.push(`${label} → ${file}`);
    }
  }
  expect(offenders, offenders.join("\n")).toEqual([]);
  expect(hasStudio, "MAAX Studio missing from built bundles").toBe(true);
});
