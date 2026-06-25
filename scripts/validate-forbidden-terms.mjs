#!/usr/bin/env node
// Validates the forbidden-terms config and prints the active rule set so
// CI logs show exactly which patterns are enforced for this run.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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
  if (typeof t.label !== "string" || !t.label.trim()) errors.push(`${where}.label must be a non-empty string`);
  if (typeof t.pattern !== "string" || !t.pattern) errors.push(`${where}.pattern must be a non-empty string`);
  if (t.flags != null && typeof t.flags !== "string") errors.push(`${where}.flags must be a string`);
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