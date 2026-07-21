#!/usr/bin/env node
// Validates the forbidden-terms config and prints the active rule set so
// CI logs show exactly which patterns are enforced for this run.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { globby } from "globby";

const file = process.env.FORBIDDEN_TERMS_FILE ?? ".quality/forbidden-terms.json";
const path = resolve(file);

function fail(reason, details = []) {
  console.error(`\n❌ Forbidden-terms config invalid.`);
  console.error(`   file: ${file}`);
  console.error(`   resolved: ${path}`);
  console.error(`   reason: ${reason}`);
  if (details.length) {
    console.error(`   details:`);
    for (const d of details) console.error(`     - ${d}`);
  }
  console.error(
    `\n   Fix: ensure the file exists and matches { "terms": [ { "label": string, "pattern": string, "flags"?: string } ] }.`,
  );
  console.error(`   Override path with FORBIDDEN_TERMS_FILE=path/to/file.json.\n`);
  process.exit(1);
}

if (!existsSync(path)) {
  fail("file does not exist at the resolved path");
}

let parsed;
try {
  parsed = JSON.parse(readFileSync(path, "utf8"));
} catch (err) {
  fail(`file is not valid JSON: ${err.message}`);
}

const errors = [];
if (!parsed || typeof parsed !== "object") errors.push("root must be an object");
if (!Array.isArray(parsed.terms)) errors.push("`terms` must be an array");

const seen = new Set();
(parsed.terms ?? []).forEach((t, i) => {
  const where = `terms[${i}]`;
  if (!t || typeof t !== "object") return errors.push(`${where} must be an object`);
  if (typeof t.label !== "string" || !t.label.trim())
    errors.push(`${where}.label must be a non-empty string`);
  if (typeof t.pattern !== "string" || !t.pattern)
    errors.push(`${where}.pattern must be a non-empty string`);
  if (t.flags != null && typeof t.flags !== "string")
    errors.push(`${where}.flags must be a string`);
  try {
    new RegExp(t.pattern, t.flags ?? "");
  } catch (err) {
    errors.push(`${where} invalid regex: ${err.message}`);
  }
  if (t.label && seen.has(t.label)) errors.push(`${where} duplicate label "${t.label}"`);
  seen.add(t.label);
});

if (errors.length) {
  fail("schema validation failed", errors);
}

console.log(`✅ ${file} valid — ${parsed.terms.length} active forbidden-term rule(s):`);
for (const t of parsed.terms) {
  console.log(`   • ${t.label.padEnd(28)} /${t.pattern}/${t.flags ?? ""}`);
}

// Optional: when a build directory is present, report which compiled files match
// each pattern (or explicitly state no matches). This makes the validator's
// output actionable BEFORE the bundle-scan test reports a failure.
// Match the browser-delivered scope enforced by bundle-scan.spec.ts. Generated
// CSS may legitimately contain numeric percentages and server dependency
// bundles may contain unrelated library symbols; neither is a public claim.
const scanGlobs = [
  ".output*/public/**/*.{html,js,mjs}",
  ".vercel/output/static/**/*.{html,js,mjs}",
  ".vercel/output/functions/**/_ssr/**/*.{js,mjs}",
  "dist/**/*.{html,js,mjs}",
];
const files = await globby(scanGlobs);
if (files.length === 0) {
  console.log(
    `\nℹ️  No compiled bundles found (looked under .output*/, .vercel/output, and dist/). Skipping match preview.`,
  );
  process.exit(0);
}

console.log(`\n🔍 Scanning ${files.length} compiled file(s) for active patterns:`);
const contents = files.map((f) => [f, readFileSync(f, "utf8")]);
let anyMatch = false;
for (const t of parsed.terms) {
  const flags = (t.flags ?? "").replace("g", "");
  const matches = contents.filter(([, c]) => new RegExp(t.pattern, flags).test(c)).map(([f]) => f);
  const preview = `/${t.pattern}/${t.flags ?? ""}`;
  if (matches.length === 0) {
    console.log(`   ✓ ${t.label.padEnd(28)} ${preview} — no matches`);
  } else {
    anyMatch = true;
    console.log(`   ✗ ${t.label.padEnd(28)} ${preview} — matched in:`);
    for (const m of matches) console.log(`       - ${m}`);
  }
}
if (anyMatch) {
  console.error(
    `\n❌ Forbidden terms present in compiled output. See bundle-scan test for assertion details.`,
  );
  process.exit(1);
}
