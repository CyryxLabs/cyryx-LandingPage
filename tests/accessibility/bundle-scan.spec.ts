import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { globby } from "globby";
import { loadForbiddenTerms } from "./_forbidden-terms";

const FORBIDDEN = loadForbiddenTerms();

test("Built production bundles are clean and never ship the discontinued MAAX name", async () => {
  const globs = existsSync(".vercel/output")
    ? [".vercel/output/**/*.{html,js,mjs}", "!.vercel/output/**/_libs/**"]
    : existsSync(".output")
      ? [".output/**/*.{html,js,mjs}", "!.output/**/_libs/**"]
      : ["dist/**/*.{html,js,mjs}"];
  const files = await globby(globs);
  test.skip(files.length === 0, "No production build artifacts found (run `bun run build` first).");

  const offenders: string[] = [];
  const maaxFiles: string[] = [];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    // MAAX (Studio, Runtime or any other label) is discontinued: no public
    // bundle may carry the name. (The lowercase /products/maax-studio redirect
    // path is expected and deliberately not matched.)
    if (/MAAX/.test(content)) maaxFiles.push(file);
    for (const { label, pattern } of FORBIDDEN) {
      if (pattern.test(content)) offenders.push(`${label} → ${file}`);
    }
  }
  expect(offenders, offenders.join("\n")).toEqual([]);
  expect(maaxFiles, `Discontinued MAAX name found in:\n${maaxFiles.join("\n")}`).toEqual([]);
});
