import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { globby } from "globby";
import { loadForbiddenTerms } from "./_forbidden-terms";

const FORBIDDEN = loadForbiddenTerms();

test("Public production bundles are clean and include MAAX Studio and Lyra", async () => {
  // Scan browser-delivered artifacts. Server dependency bundles and generated CSS
  // contain unrelated library symbols and numeric values that are not public claims.
  const files = await globby([
    ".output*/public/**/*.{html,js,mjs}",
    ".vercel/output/static/**/*.{html,js,mjs}",
    ".vercel/output/functions/**/_ssr/**/*.{js,mjs}",
    "dist/**/*.{html,js,mjs}",
  ]);
  test.skip(
    files.length === 0,
    "No production build artifacts found (run the deployment build first).",
  );

  const offenders: string[] = [];
  let hasStudio = false;
  let hasLyra = false;
  for (const file of files) {
    const content = await readFile(file, "utf8");
    if (/MAAX Studio/.test(content)) hasStudio = true;
    if (/Lyra/.test(content)) hasLyra = true;
    for (const { label, pattern } of FORBIDDEN) {
      if (pattern.test(content)) offenders.push(`${label} → ${file}`);
    }
  }
  expect(offenders, offenders.join("\n")).toEqual([]);
  expect(hasStudio, "MAAX Studio missing from built bundles").toBe(true);
  expect(hasLyra, "Lyra missing from built bundles").toBe(true);
});
