#!/usr/bin/env node
// Reproduces the CI quality job locally:
//   1) validate forbidden-terms config
//   2) build production bundle
//   3) run Playwright a11y + content + SEO + bundle scan
//   4) run Lighthouse CI (mobile + desktop)
//   5) convert axe JSON to SARIF
// Outputs land in the same folder layout as CI:
//   a11y-report/           (axe JSON + HTML + axe.sarif)
//   lighthouse-report/mobile, lighthouse-report/desktop
//   playwright-report/
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const steps = [
  ["Validate forbidden-terms", "bun", ["run", "quality:validate-terms"]],
  ["Build production bundle", "bun", ["run", "build"]],
  ["Playwright (a11y · content · SEO · bundle)", "bun", ["run", "test:a11y:ci"]],
  ["Lighthouse (mobile)", "bun", ["run", "quality:lhci:mobile"]],
  ["Lighthouse (desktop)", "bun", ["run", "quality:lhci:desktop"]],
  ["axe JSON → SARIF", "bun", ["run", "quality:axe-sarif"]],
];

for (const dir of ["a11y-report", "lighthouse-report/mobile", "lighthouse-report/desktop", "playwright-report"]) {
  mkdirSync(dir, { recursive: true });
}

let failed = false;
for (const [label, cmd, args] of steps) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", env: { ...process.env, CI: process.env.CI ?? "1", A11Y_REPORT_DIR: "a11y-report" } });
  if (r.status !== 0) {
    failed = true;
    console.error(`✖ ${label} failed (exit ${r.status}). Continuing so all artifacts are produced.`);
  }
}

console.log(`\nArtifacts:`);
console.log(`  - a11y-report/            (axe JSON + HTML + axe.sarif)`);
console.log(`  - lighthouse-report/mobile, lighthouse-report/desktop`);
console.log(`  - playwright-report/`);
process.exit(failed ? 1 : 0);