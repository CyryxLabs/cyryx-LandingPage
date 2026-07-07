#!/usr/bin/env node
// Fails CI if any /admin URL reference sneaks back into menus, CTAs, or routes.
// Matches URL-shaped occurrences only (to="/admin", href="/admin", "/admin/...",
// navigate({ to: "/admin" }), etc.). Prose like "administrative" is ignored.
import { globby } from "globby";
import { readFile } from "node:fs/promises";

const files = await globby([
  "src/**/*.{ts,tsx,js,jsx,mdx}",
  "!src/routeTree.gen.ts",
  "!src/integrations/supabase/types.ts",
]);

// URL forms: "/admin", "/admin/x", 'to: "/admin"', 'href="/admin"' — with an
// end-boundary that only allows " ' ` / ? # so "admin-overview" won't match.
const urlPattern = /["'`]\/admin(?=["'`\/?#])/;

const hits = [];
for (const file of files) {
  const text = await readFile(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (urlPattern.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
  });
}

if (hits.length) {
  console.error("Found stale /admin URL references:\n" + hits.join("\n"));
  console.error("\nAll internal links must point to /workspace.");
  process.exit(1);
}
console.log("audit-admin-links: OK (0 /admin URL references)");