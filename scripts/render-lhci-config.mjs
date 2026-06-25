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
};

let raw = readFileSync(template, "utf8");
for (const [key, fallback] of Object.entries(defaults)) {
  const value = process.env[key] ?? String(fallback);
  raw = raw.replaceAll(`"${key}"`, value);
}
writeFileSync(out, raw);
console.log(`Wrote ${out}`);