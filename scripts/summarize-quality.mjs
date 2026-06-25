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
// Gate via POST_JSONLD_DIFF (defaults to "1"; set to "0" to disable in PR comment).
const diffPath = "jsonld-diff/jsonld.diff";
const postDiff = (process.env.POST_JSONLD_DIFF ?? "1") !== "0";
if (postDiff && existsSync(diffPath)) {
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

// --- Single HTML quality report ---------------------------------------------
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;
const sarifLink = runUrl ? `${runUrl}#artifacts` : "a11y-report/axe.sarif";
function lhCard(label, r, dir) {
  if (!r) return `<section><h3>${label}</h3><p>n/a</p></section>`;
  return `<section>
    <h3>${label} <a href="${esc(dir)}/">(report)</a></h3>
    <ul>
      <li>LCP: <b>${fmt(r.lcp)} ms</b></li>
      <li>CLS: <b>${fmt(r.cls, 3)}</b></li>
      <li>TBT: <b>${fmt(r.tbt)} ms</b></li>
      <li>Performance: <b>${fmt((r.perf ?? 0) * 100)}</b></li>
      <li>Accessibility: <b>${fmt((r.a11y ?? 0) * 100)}</b></li>
      <li>SEO: <b>${fmt((r.seo ?? 0) * 100)}</b></li>
    </ul>
  </section>`;
}
const violationsHtml = violations.length
  ? `<table><thead><tr><th>Project</th><th>Rule</th><th>Impact</th><th>Selector</th></tr></thead><tbody>${violations
      .map((v) => `<tr><td>${esc(v.project)}</td><td><code>${esc(v.id)}</code></td><td>${esc(v.impact ?? "-")}</td><td><code>${esc(v.targets[0] ?? "-")}</code></td></tr>`)
      .join("")}</tbody></table>`
  : `<p>✅ No axe-core violations.</p>`;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Quality report</title>
<style>body{font:14px/1.5 system-ui,sans-serif;max-width:960px;margin:2rem auto;padding:0 1rem;color:#111}
h1{margin-bottom:.25rem}h3{margin-top:1.5rem}table{border-collapse:collapse;width:100%}
th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}code{background:#f4f4f5;padding:1px 4px;border-radius:3px}
.lh{display:grid;grid-template-columns:1fr 1fr;gap:1rem}a{color:#2563eb}</style></head>
<body>
<h1>Quality report</h1>
${runUrl ? `<p>CI run: <a href="${esc(runUrl)}">${esc(runUrl)}</a></p>` : ""}
<h2>Lighthouse</h2>
<div class="lh">
  ${lhCard("Mobile", mobile, "lighthouse-report/mobile")}
  ${lhCard("Desktop", desktop, "lighthouse-report/desktop")}
</div>
<h2>axe-core (${violations.length})</h2>
<p>SARIF: <a href="${esc(sarifLink)}">${esc(sarifLink)}</a></p>
${violationsHtml}
</body></html>`;
writeFileSync("quality-report.html", html);
console.log("Wrote quality-report.html");