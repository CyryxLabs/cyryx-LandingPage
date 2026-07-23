#!/usr/bin/env node
// Renders a Lighthouse CI config with thresholds substituted from env vars.
// Usage: node scripts/render-lhci-config.mjs <template.json> <out.json>
import { readFileSync, writeFileSync } from "node:fs";

const [, , template, out] = process.argv;
if (!template || !out) {
  console.error("Usage: render-lhci-config.mjs <template> <out>");
  process.exit(1);
}

const defaults = {
  LH_PERF_MIN: 0.85,
  LH_A11Y_MIN: 0.95,
  LH_SEO_MIN: 0.95,
  LH_LCP_MAX_MOBILE: 3500,
  LH_LCP_MAX_DESKTOP: 2500,
  LH_CLS_MAX: 0.1,
  LH_TBT_MAX_MOBILE: 300,
  LH_TBT_MAX_DESKTOP: 200,
  LH_INP_MAX_MOBILE: 200,
};

let raw = readFileSync(template, "utf8");
const active = {};
for (const [key, fallback] of Object.entries(defaults)) {
  const value = process.env[key] ?? String(fallback);
  active[key] = { value, source: process.env[key] != null ? "env" : "default" };
  raw = raw.replaceAll(`"${key}"`, value);
}
writeFileSync(out, raw);
console.log(`Wrote ${out}`);
console.log(`Active Lighthouse budgets:`);
for (const [k, { value, source }] of Object.entries(active)) {
  console.log(`  ${k.padEnd(22)} = ${value}  (${source})`);
}