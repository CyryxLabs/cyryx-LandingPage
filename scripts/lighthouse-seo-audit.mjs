#!/usr/bin/env node
// Runs Lighthouse against the live (or local) URL for both mobile + desktop,
// then prints remaining audit failures grouped by priority.
//
//   node scripts/lighthouse-seo-audit.mjs --url=https://www.cyryxlabs.com/
//
// Requires Chrome/Chromium on PATH. Uses `npx lighthouse` so no global install.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.join("=") || "true"];
  }),
);
const URL = args.url || "https://www.cyryxlabs.com/";
const OUT = args.out || "lighthouse-report/seo-audit";
mkdirSync(OUT, { recursive: true });

const CATEGORIES = ["performance", "accessibility", "seo", "best-practices"];
const PRIORITY = { performance: "P1", seo: "P1", accessibility: "P1", "best-practices": "P2" };

function run(formFactor) {
  const json = join(OUT, `${formFactor}.json`);
  rmSync(json, { force: true });
  const flags = [
    "lighthouse@12",
    URL,
    `--output=json`,
    `--output-path=${json}`,
    `--only-categories=${CATEGORIES.join(",")}`,
    `--chrome-flags=--headless=new --no-sandbox`,
    `--quiet`,
    `--preset=${formFactor === "desktop" ? "desktop" : "perf"}`,
    `--form-factor=${formFactor}`,
    formFactor === "mobile" ? "--screenEmulation.mobile" : "--screenEmulation.disabled",
  ];
  const r = spawnSync("npx", ["--yes", ...flags], { stdio: ["ignore", "inherit", "inherit"] });
  if (r.status !== 0) {
    console.error(`✖ lighthouse (${formFactor}) failed (exit ${r.status})`);
    return null;
  }
  return JSON.parse(readFileSync(json, "utf8"));
}

function summarize(report, formFactor) {
  const cats = report.categories;
  const audits = report.audits;
  const buckets = { P1: [], P2: [], P3: [] };

  for (const cat of Object.values(cats)) {
    for (const ref of cat.auditRefs) {
      const a = audits[ref.id];
      if (!a || a.score === null || a.score >= 0.9) continue;
      const sev = a.score < 0.5 ? "P1" : a.score < 0.9 ? "P2" : "P3";
      const pri = PRIORITY[cat.id] === "P2" && sev === "P1" ? "P2" : sev;
      buckets[pri].push({
        cat: cat.id,
        id: a.id,
        score: a.score,
        title: a.title,
        description: (a.description || "").split("\n")[0].slice(0, 140),
      });
    }
  }

  console.log(`\n=== ${formFactor.toUpperCase()} — ${URL} ===`);
  for (const cat of CATEGORIES) {
    const s = cats[cat]?.score;
    console.log(`  ${cat.padEnd(15)} ${s == null ? "n/a" : Math.round(s * 100)}`);
  }
  for (const pri of ["P1", "P2", "P3"]) {
    const rows = buckets[pri];
    if (!rows.length) continue;
    console.log(`\n  [${pri}] ${rows.length} issue(s)`);
    for (const r of rows.sort((a, b) => a.score - b.score)) {
      console.log(`   - (${r.cat}) ${r.title}  [${Math.round(r.score * 100)}]`);
    }
  }
  return buckets;
}

let failed = false;
for (const ff of ["mobile", "desktop"]) {
  const report = run(ff);
  if (!report) {
    failed = true;
    continue;
  }
  const b = summarize(report, ff);
  if (b.P1.length) failed = true;
}
process.exit(failed ? 1 : 0);
