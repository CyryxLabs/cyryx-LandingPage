# Cyryx Labs SEO / AEO / AGEO Foundation

This is a large, multi-file implementation. Confirming scope before I build so we don't ship the wrong shape.

## What's already in place (won't redo)

- `public/robots.txt` — exists, allows all, points to `https://cyryxlabs.com/sitemap.xml`. I'll **extend** it to explicitly allow `OAI-SearchBot`, `PerplexityBot`, `GPTBot`, `ClaudeBot`, `Google-Extended`.
- `src/routes/sitemap[.]xml.ts` — server route exists with 8 entries. I'll **extend** it with the 6 solutions sub-routes, 5 `/answers/*` routes, and `/research`.
- `public/llms.txt` — exists but thin/outdated (lists routes that don't all exist). I'll **rewrite** to cover MAAX Studio, MAAX Runtime, Solutions, Applied AI Lab, key concepts, citation-ready pages.
- `__root.tsx` — already emits Organization, WebSite, WebPage, SoftwareApplication JSON-LD (per snapshot test). I'll **add** BreadcrumbList on nested routes and per-route Service / FAQPage / TechArticle.
- `/company`, `/solutions`, `/products/maax-studio`, `/research` — exist; some are `StubPage`. I'll replace stubs with full structured content.

## What I'll create

**Routes (new files in `src/routes/`):**
- `solutions.ai-websites-lead-systems.tsx`
- `solutions.workflow-automation.tsx`
- `solutions.internal-ai-assistants.tsx`
- `solutions.custom-ai-product-development.tsx`
- `solutions.ai-integrations.tsx`
- `solutions.ai-governance-cost-control.tsx`
- `answers.what-is-governed-ai-execution.tsx`
- `answers.ai-execution-system-vs-ai-automation.tsx`
- `answers.what-are-command-gates-in-ai-systems.tsx`
- `answers.what-is-goal-grounded-generation.tsx`
- `answers.how-to-measure-ai-output-quality.tsx`
- `answers.index.tsx` (hub listing all answer pages, for internal linking)

**Shared components (new in `src/components/cyryx/seo/`):**
- `AnswerPage.tsx` — enforces the 40–80 word direct-answer pattern + sections: Definition, Why it matters, How it works, Example, Cyryx perspective, Metrics, Mistakes, FAQs, Related links. Auto-emits `FAQPage` + `BreadcrumbList` JSON-LD.
- `SolutionPage.tsx` — service page shell. Auto-emits `Service` + `BreadcrumbList` JSON-LD.
- `seo.ts` — small helpers: `buildBreadcrumbJsonLd(crumbs)`, `buildFaqJsonLd(qas)`, `buildServiceJsonLd(...)`, `buildTechArticleJsonLd(...)`, plus a `pageMeta({title, description, path, image?})` helper to enforce title <60 / description <160 + OG + Twitter + canonical.

**Files I'll modify:**
- `public/robots.txt` (extend with AI crawlers)
- `public/llms.txt` (rewrite)
- `src/routes/sitemap[.]xml.ts` (add 12 entries)
- `src/routes/company.tsx` (replace `StubPage` with full content)
- `src/routes/solutions.tsx` (replace `StubPage` with overview + cards linking to 6 sub-routes; emit `Service` parent + `BreadcrumbList`)
- `src/routes/research.index.tsx` (verify content + `BreadcrumbList`; `TechArticle` on `research.$slug.tsx`)
- `src/routes/products.maax-studio.tsx` (verify; add `BreadcrumbList`; keep existing `SoftwareApplication`)

## Content rules I'll follow

- Positioning: AI technology company (products + execution systems + applied research). Never "agency", "chatbot shop", "prompt engineering". Anchor thesis: *"Most AI produces output. Cyryx builds systems that verify outcomes."*
- Every answer page links to MAAX Studio, Cyryx Solutions (`/solutions`), Cyryx Applied AI Lab (`/research`), plus ≥2 sibling answer pages.
- No invented case studies, no fabricated metrics. Where the framework defines measurable concepts (e.g. conformance levels, gate pass rate), I'll describe them qualitatively unless real numbers are in `src/data/publications.ts`.
- Every route gets unique title <60 + description <160 + canonical + OG + Twitter, enforced via the `pageMeta` helper.

## Out of scope unless you confirm

- I will **not** generate new OG images per page. Each new page will reuse the existing site OG image (whatever `__root.tsx` already references). Generating 12+ unique OG images is a separate ask — say "yes, generate OG images" and I'll add that.
- I will **not** wire any analytics or change `vite.config.ts` / SSR setup.
- I will **not** add a "Cite this page" UI to answer pages (the citation modal stays on research papers only).

## Verification at the end

- `bun run typecheck` (tsgo)
- Re-read sitemap, verify 20 entries
- Spot-read 1 answer page + 1 solution page to confirm JSON-LD blocks are emitted
- Final checklist: crawlability (robots + sitemap), structured data (Org/WebSite/WebPage/Breadcrumb/SoftwareApp/Service/FAQ/TechArticle present per page type), internal links, metadata budget

Approve and I'll build it in one pass. If you want OG image generation included, say so now.
