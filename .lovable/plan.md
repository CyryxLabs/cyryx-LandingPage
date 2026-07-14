# Cyryx Labs Website Restructure — Implementation Plan

## Guardrails (non-negotiable)
- **Hero LOCK**: `src/components/cyryx/Hero.tsx` visuals, headline, copy, CTAs untouched. Only invisible technical fixes allowed (a11y/perf/reduced-motion), each documented.
- **Image LOCK**: no deletion/replacement/regeneration of existing assets under `src/assets/*`. Only lossless optimization + srcset/lazy/alt.
- **Pricing**: only "starting at" / "standard engagement" / "custom scope" language; no Authorized Floor in any client-shipped code, JSON, meta, or analytics prop.
- **Claims**: MAAX = "in active development"; Lyra = "v1.0 complete"; no invented clients/metrics/certifications.

## Phase 1 — Repository audit (read-only)
Inspect and inventory before any edits:
- Route tree (`src/routes/**`) vs. required sitemap — identify present, missing, and to-rename.
- Reusable primitives (`src/components/cyryx/primitives/*`, `v4/*`, `seo/*`), `HudLabel`, `GlassPanel`, `SolutionPage`, `AnswerPage`.
- Existing form stack: `src/routes/api/public/contact.ts`, `src/lib/contact.schema.ts`, `src/lib/contact.functions.ts`.
- Analytics: `src/lib/track-cta.ts`, `cta_events` table, `src/routes/api/public/cta-events.ts`.
- SEO helpers: `src/components/cyryx/seo/seo.ts`, sitemaps `sitemap-*[.]xml.ts`.
- Existing solution pages (`solutions.*.tsx`) — 6 pages exist with a different taxonomy; will be **renamed/remapped**, not deleted (with 301 redirects where a route slug changes).

Produce audit note in `.lovable/plan.md` (append) listing risks + slug remap.

## Phase 2 — Content + config
- Create `src/content/site.ts` — single source for nav, solutions, packages (public pricing strings only), engagement steps, FAQs, product statuses. No floor prices.
- Create `src/content/copy/{home,solutions,products,engagement,lyra,maax}.ts` — full American-English copy from brief.
- Enforce lint rule via existing `.quality/forbidden-terms.json` — add "Authorized Floor", dollar-floor patterns.

## Phase 3 — Sitemap + routing
Target routes (create or rename):
```
/                                (keep, hero locked, restructure below-fold only)
/company                         (exists — refresh copy)
/products                        (exists — refresh)
/products/maax-studio            (exists — refresh, status label)
/products/lyra                   (exists — full rewrite from verified capabilities only)
/solutions                       (exists — hub refresh w/ 6 new categories)
/solutions/digital-web-systems   (NEW)
/solutions/workflow-automation   (rename from workflow-automation)
/solutions/applied-ai-systems    (NEW; consolidates internal-ai-assistants + ai-websites-lead-systems)
/solutions/ai-product-engineering (rename from custom-ai-product-development)
/solutions/governance-optimization (rename from ai-governance-cost-control)
/managed-operations              (NEW)
/research                        (exists)
/engagement-model                (NEW)
/start                           (NEW — qualification form; /contact keeps redirect)
/privacy /terms                  (keep)
```
Add 301 redirects for old solution slugs via a small route-level `redirect()` in `beforeLoad`. Update `sitemap-solutions[.]xml.ts` and `sitemap-index[.]xml.ts`.

## Phase 4 — Homepage restructure (below hero only)
Preserve `<Hero />`. Replace/reorder below-fold sections in `src/routes/index.tsx` to match the 11-section brief:
1. Hero (LOCKED)
2. Problem — "The execution gap" (new `HomeProblem.tsx`)
3. Company architecture — 3 units (refactor `Ecosystem`/`ProductEcosystem` → `HomeArchitecture.tsx`)
4. Commercial entry points — 4 cards (`HomeEntryPoints.tsx`)
5. Solutions — 6 categories (`HomeSolutionsGrid.tsx`)
6. Products — MAAX + Lyra with status labels (`HomeProducts.tsx`)
7. Engagement model — 6 steps (reuse `ProcessTimeline` w/ new steps)
8. Governance principles (reuse `SecurityPosture`, retitled)
9. Who we work with (reuse `WhoWeWorkWith`, updated copy)
10. Why Cyryx (reuse `WhyCyryxV4`, updated copy)
11. Final CTA (reuse `FinalCTA`, updated copy)

Existing sections not aligned to brief (MetricsBand with unverifiable metrics, CapabilityStrip) will be removed from the homepage but kept in the codebase for possible reuse.

## Phase 5 — Solution + product pages
- Extend `SolutionPage.tsx` to accept: hero, problem, who-for, packages (title + "starting at" + inclusions), deliverables, process, exclusions, acceptance, managed care, expansion, FAQ, CTA.
- Author 6 solution pages using content config.
- Products: refresh `/products`, `/products/maax-studio` (active-dev disclosure), full rewrite `/products/lyra` — capability list will be a placeholder-gated block that reads from `src/content/lyra-capabilities.ts`; if empty, section renders "Detailed capability publication pending verification" (no invented items).
- New `/managed-operations` and `/engagement-model` pages.

## Phase 6 — Qualification form (`/start`)
- Zod schema in `src/lib/qualification.schema.ts` covering all brief fields.
- Server route `src/routes/api/public/qualification.ts` (mirrors contact.ts pattern: rate limit, spam honeypot, sanitize, insert into `contact_submissions` w/ new `project_type`, `investment_range`, `timeline`, `decision_status`, `systems_involved` columns).
- Migration adding those columns + GRANTs (structured, no PII in analytics).
- Analytics events via existing `trackCta` extended with a `trackFormEvent` helper — only non-PII metadata.
- Confirmation via existing email templates; add `qualification-confirmation.tsx`.
- `/contact` becomes an alias that renders `/start` (or 301).

## Phase 7 — Nav / footer / SEO / structured data
- Update `Header.tsx` + `MobileMenu.tsx` to new nav (Company, Products dropdown, Solutions dropdown, Research, Start a Project CTA).
- Update `Footer.tsx` link groups.
- Per-route `head()` with unique title/desc/OG/canonical via `buildHead()`.
- JSON-LD: Organization (root), Service per solution, SoftwareApplication for MAAX/Lyra, BreadcrumbList per deep route. Remove any fake Rating/Review.
- Update sitemaps + `robots.txt` unchanged.

## Phase 8 — A11y + performance
- Verify focus states, skip link, aria on menus/dialogs, form errors.
- Image audit: ensure width/height, `loading="lazy"` below fold, `<picture>` with existing webp/avif sources (no new images generated).
- Respect `prefers-reduced-motion` in any new component.

## Phase 9 — QA
- `bun run lint`, `tsgo`, `bunx vitest run`, targeted Playwright specs under `tests/accessibility/` (nav-order, seo-metadata, route-metadata, hero, jsonld-pages, sitemap-coverage).
- Visual regression: Playwright screenshot hero at 1280 + 375 before/after → confirm pixel-diff ≤ tolerance.
- Forbidden-terms scan (`scripts/validate-forbidden-terms.mjs`) blocks "Authorized Floor" et al.

## Technical section
- **DB migration**: `contact_submissions` add nullable columns `project_type text`, `investment_range text`, `timeline text`, `decision_status text`, `systems_involved text`, `role text`, `company_website text`. Existing RLS admin-only policies unchanged; GRANTs preserved.
- **Redirects**: TanStack `beforeLoad: () => { throw redirect({ to: '/solutions/ai-product-engineering' }) }` on legacy routes; keep legacy route files as thin shims for one release cycle.
- **No hero refactor**: `src/components/cyryx/Hero.tsx` diff limited (if any) to adding `width`/`height`/`fetchpriority` attrs — screenshot-verified.
- **No new image generation**: all imagery drawn from existing `.asset.json` pointers.
- **Public config only**: `src/content/site.ts` ships to client; internal-only pricing lives nowhere in repo (brief-only).

## Deliverables at completion
Executive summary, audit findings, final sitemap, files touched, components added, copy/pricing diff, form architecture, SEO/JSON-LD summary, analytics events list, a11y + perf results, tests run, known limitations, deploy + rollback notes, before/after hero screenshots (desktop + mobile), confirmation no floor pricing ships publicly.
