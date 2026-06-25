#!/usr/bin/env node
// Builds a concise Markdown summary of Lighthouse (mobile+desktop) + axe results
// for posting as a PR comment. Writes to $GITHUB_STEP_SUMMARY and stdout.
import { existsSync, readFileSync, readdirSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

function loadLH(dir) {
  if (!existsSync(dir)) return null;
  const file = readdirSync(dir).find((f) => f.startsWith("lhr-") && f.endsWith(".json"));
  if (!file) return null;
  const lhr = JSON.parse(readFileSync(join(dir, file), "utf8"));
  const a = lhr.audits;
  return {
    lcp: a["largest-contentful-paint"]?.numericValue,
    cls: a["cumulative-layout-shift"]?.numericValue,
    tbt: a["total-blocking-time"]?.numericValue,
    perf: lhr.categories.performance?.score,
    a11y: lhr.categories.accessibility?.score,
    seo: lhr.categories.seo?.score,
  };
}

function loadAxe(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => {
      const r = JSON.parse(readFileSync(join(dir, f), "utf8"));
      return (r.violations || []).map((v) => ({
        project: f.replace(/\.json$/, ""),
        id: v.id,
        impact: v.impact,
        help: v.help,
        targets: v.nodes.map((n) => n.target.join(" ")).slice(0, 3),
      }));
    });
}

function fmt(n, digits = 0) {
  return n == null ? "n/a" : n.toFixed(digits);
}

function lhRow(label, r) {
  if (!r) return `| ${label} | n/a | n/a | n/a | n/a |`;
  return `| ${label} | ${fmt(r.lcp)} ms | ${fmt(r.cls, 3)} | ${fmt(r.tbt)} ms | ${fmt((r.perf ?? 0) * 100)} |`;
}

const mobile = loadLH("lighthouse-report/mobile");
const desktop = loadLH("lighthouse-report/desktop");
const violations = loadAxe(process.env.A11Y_REPORT_DIR || "a11y-report");

const lines = [];
lines.push("## 🔎 Quality summary");
lines.push("");
lines.push("### Lighthouse");
lines.push("| Form factor | LCP | CLS | TBT | Perf score |");
lines.push("| --- | --- | --- | --- | --- |");
lines.push(lhRow("Mobile", mobile));
lines.push(lhRow("Desktop", desktop));
lines.push("");
lines.push(`### axe-core violations: ${violations.length}`);
if (violations.length) {
  lines.push("| Project | Rule | Impact | Selector |");
  lines.push("| --- | --- | --- | --- |");
  for (const v of violations.slice(0, 20)) {
    lines.push(`| ${v.project} | \`${v.id}\` | ${v.impact ?? "-"} | \`${v.targets[0] ?? "-"}\` |`);
  }
  if (violations.length > 20) lines.push(`_…and ${violations.length - 20} more_`);
} else {
  lines.push("✅ No axe-core violations.");
}
lines.push("");
lines.push("Artifacts: `lighthouse-report`, `a11y-report`, `playwright-report` (see workflow run).");

// Optional: surface the JSON-LD snapshot diff inline when UPDATE_JSONLD_SNAPSHOT ran.
const diffPath = "jsonld-diff/jsonld.diff";
if (existsSync(diffPath)) {
  const diff = readFileSync(diffPath, "utf8").trim();
  if (diff) {
    lines.push("");
    lines.push("### JSON-LD snapshot diff");
    lines.push("```diff");
    lines.push(diff.length > 6000 ? diff.slice(0, 6000) + "\n…(truncated)" : diff);
    lines.push("```");
  }
}

const md = lines.join("\n");
process.stdout.write(md + "\n");
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");
writeFileSync("quality-summary.md", md);