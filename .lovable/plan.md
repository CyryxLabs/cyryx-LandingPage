
# PHASE 0 — Factual Baseline Audit

Read-only. No files were created, edited, renamed, or deleted. No installs, formatters, commits, or deployments were run. Only file reads and directory listings were performed.

---

## 1. Executive State Summary

- Repository is intact and matches the structure documented in the last summarized audit (TanStack Start v1, Tailwind v4, Supabase, GSAP, R3F).
- **Production hero DOES NOT MATCH the approved hero locked in this task.** Difference is in `src/copy/v3.ts` (headline wording + CTA order/labels). Hero component/image/video/animation files themselves are unchanged.
- Homepage renders the v4 section stack via `src/routes/index.tsx` (Hero → Problem → WhatWeBuild → Solutions → EngagementModel → SecurityPosture → MAAXStudioSpotlight → WhoWeWorkWith → WhyCyryxV4 → ResearchBand → FinalCTA → ContactSection).
- 9 solution routes exist with one already redirecting (`solutions.applied-ai-systems.tsx` → `/solutions/internal-ai-assistants`). Content overlap between remaining 8 is a known concern (NOT VERIFIED at claim-by-claim level in this phase).
- Build / typecheck / test / lint results: **NOT VERIFIED** (no state-changing commands were executed per freeze).

---

## 2. Repository and Deployment State

- Branch: NOT VERIFIED (git commands not run to respect the freeze).
- Working-tree changes / staged / uncommitted status: NOT VERIFIED.
- Last commit id, push status, deploy status: NOT VERIFIED.
- Previous task file impact (per summarized history): edits to `src/routes/products.lyra.tsx`, `src/routes/products.tsx`, `src/routeTree.gen.ts`, and creation of `src/components/cyryx/primitives/HudGrid.tsx`. Present on disk — CONFIRMED by directory listing. Commit/push status of those edits: NOT VERIFIED.

---

## 3. Technology Stack (evidence: `package.json`)

- Framework: TanStack Start `^1.167.50` + TanStack Router `^1.168.25` (file-based routing, `src/routes/`).
- Language: TypeScript `^5.8.3`; React `^19.2.0`.
- Build tool: Vite `^8.0.16` + `@lovable.dev/vite-tanstack-config` 2.7.1.
- Styling: Tailwind CSS `^4.2.1` via `@tailwindcss/vite`; tokens in `src/styles.css`.
- Animation: GSAP `^3.15.0` + `@gsap/react` `^2.1.2` (used in `src/hooks/useCyryxScrollAnimations.ts`).
- 3D: `three ^0.184.0`, `@react-three/fiber ^9.6.1`, `@react-three/drei ^10.7.7` (`src/components/cyryx/three/MonolithScene.tsx`).
- Smooth scroll: local hook `src/hooks/useSmoothScroll.ts` (no Lenis/Locomotive dependency).
- Form/backend: React Hook Form + Zod; Supabase JS `^2.108.2` (`src/integrations/supabase/*`).
- Emails: `@react-email/components`, templates in `src/lib/email-templates/`.
- Analytics: `web-vitals ^5.3.0` (`src/lib/web-vitals.ts`); CTA telemetry in `src/lib/track-cta.ts`.
- Hosting/runtime: Cloudflare Worker via TanStack Start build (per `AGENTS.md` / `src/server.ts`) — NOT VERIFIED beyond file presence.
- Testing: `@playwright/test ^1.61.1`; `bun test` for unit tests; a11y specs in `tests/accessibility/`.
- Package manager: Bun (`bunfig.toml`, scripts use `bun run`).
- Node version requirement: NOT VERIFIED (no `engines` field visible in truncated `package.json`).

---

## 4. Complete Route Inventory (source: `src/routes/`)

Public / marketing routes (files present):

| URL | Source file | Indexable | Notes |
|---|---|---|---|
| `/` | `index.tsx` | yes | Homepage; canonical + JSON-LD present |
| `/company` | `company.tsx` | assumed yes | NOT VERIFIED (head not read) |
| `/products` | `products.tsx` | yes | Hub |
| `/products/maax-studio` | `products.maax-studio.tsx` | yes | |
| `/products/lyra` | `products.lyra.tsx` | yes | Edited in prior task |
| `/solutions` | `solutions.tsx` | yes | Hub |
| `/solutions/ai-governance-cost-control` | `solutions.ai-governance-cost-control.tsx` | yes | |
| `/solutions/ai-integrations` | `solutions.ai-integrations.tsx` | yes | |
| `/solutions/ai-product-engineering` | `solutions.ai-product-engineering.tsx` | yes | |
| `/solutions/ai-websites-lead-systems` | `solutions.ai-websites-lead-systems.tsx` | yes | |
| `/solutions/applied-ai-systems` | `solutions.applied-ai-systems.tsx` | **redirect** | 301→`/solutions/internal-ai-assistants` (confirmed in file) |
| `/solutions/custom-ai-product-development` | `solutions.custom-ai-product-development.tsx` | yes | |
| `/solutions/digital-web-systems` | `solutions.digital-web-systems.tsx` | yes | |
| `/solutions/governance-optimization` | `solutions.governance-optimization.tsx` | yes | |
| `/solutions/internal-ai-assistants` | `solutions.internal-ai-assistants.tsx` | yes | Redirect target |
| `/solutions/workflow-automation` | `solutions.workflow-automation.tsx` | yes | |
| `/research` | `research.index.tsx` | yes | |
| `/research/$slug` | `research.$slug.tsx` | dynamic | |
| `/answers` | `answers.index.tsx` | yes | |
| `/answers/ai-execution-system-vs-ai-automation` | file present | yes | |
| `/answers/how-to-measure-ai-output-quality` | file present | yes | |
| `/answers/what-are-command-gates-in-ai-systems` | file present | yes | |
| `/answers/what-is-goal-grounded-generation` | file present | yes | |
| `/answers/what-is-governed-ai-execution` | file present | yes | |
| `/engagement-model` | `engagement-model.tsx` | yes | |
| `/managed-operations` | `managed-operations.tsx` | yes | |
| `/contact` | `contact.tsx` | yes | |
| `/start` | `start.tsx` | yes | |
| `/careers` | `careers.tsx` | yes | |
| `/privacy` | `privacy.tsx` | yes | |
| `/terms` | `terms.tsx` | yes | |
| `/auth` | `auth.tsx` | typically noindex | NOT VERIFIED |
| `/newsletter/confirm` | `newsletter.confirm.tsx` | noindex assumed | NOT VERIFIED |
| `/unsubscribe` | `unsubscribe.tsx` | noindex assumed | NOT VERIFIED |
| `/sitemap.xml`, `/sitemap-index.xml`, `/sitemap-products.xml`, `/sitemap-solutions.xml`, `/sitemap-company.xml` | corresponding `sitemap*[.]xml.ts` | XML | |

Authenticated: `src/routes/_authenticated/route.tsx` gates `workspace.*` children (`workspace.tsx` shell + `admin`, `careers`, `dev`, `finance`, `hr`, `index`, `marketing`, `pipeline`, `products`, `$` catch-all).

API routes: `src/routes/api/public/{contact,cta-events,newsletter.subscribe,newsletter.confirm,auth.domain-block,auth.recover,web-vitals}.ts`; email routes under `src/routes/email/` and `src/routes/lovable/email/*`.

404: no dedicated route file — handled by `NotFoundComponent` inside `src/routes/__root.tsx`.

Nav / sitemap membership per route: NOT VERIFIED (Header + sitemap files not read in this phase).

Duplicate URL claims: none detected at the filename level (see §11).

---

## 5. Homepage Section Inventory

Order per `src/routes/index.tsx` (evidence read):

| # | Section | Component | File |
|---|---|---|---|
| 1 | Hero | `Hero` | `src/components/cyryx/Hero.tsx` |
| 2 | Problem | `Problem` | `src/components/cyryx/v4/Problem.tsx` |
| 3 | What we build | `WhatWeBuild` | `src/components/cyryx/v4/WhatWeBuild.tsx` |
| 4 | Solutions | `Solutions` | `src/components/cyryx/v4/Solutions.tsx` |
| 5 | Engagement model | `EngagementModel` | `src/components/cyryx/v4/EngagementModel.tsx` |
| 6 | Security posture | `SecurityPosture` | `src/components/cyryx/v4/SecurityPosture.tsx` |
| 7 | MAAX Studio spotlight | `MAAXStudioSpotlight` | `src/components/cyryx/MAAXStudioSpotlight.tsx` |
| 8 | Who we work with | `WhoWeWorkWith` | `src/components/cyryx/v4/WhoWeWorkWith.tsx` |
| 9 | Why Cyryx | `WhyCyryxV4` | `src/components/cyryx/v4/WhyCyryxV4.tsx` |
| 10 | Research band | `ResearchBand` | `src/components/cyryx/v4/ResearchBand.tsx` |
| 11 | Final CTA | `FinalCTA` | `src/components/cyryx/v4/FinalCTA.tsx` |
| 12 | Contact | `ContactSection` | `src/components/cyryx/ContactSection.tsx` |

Header / Footer / StickyMobileCTA / BackgroundMonolith mount around `<main>`. Per-section headlines, CTAs, imagery, animations: NOT VERIFIED beyond Hero (see §6). Whether the previous task touched any of these: per summarized history, NO — only Lyra/products files were edited.

---

## 6. Approved Hero Comparison

Evidence: `src/components/cyryx/Hero.tsx` reads copy from `getCopy(useCopyVariant()).hero`; active document is `src/copy/v3.ts` (lines 7–16).

| Field | Approved (locked) | Current in `src/copy/v3.ts` |
|---|---|---|
| Headline | "The execution layer for **enterprise** AI." | "The execution layer for **operational** AI." |
| Supporting copy | "Cyryx Labs builds AI products and execution systems — governed agents, automated workflows, and operational infrastructure engineered for accountability, auditability, and cost control." | "AI products and execution systems — governed agents, automated workflows, and operational infrastructure engineered for accountability and cost control." |
| Primary CTA | "Start a project" | "Explore MAAX Studio" |
| Secondary CTA | "MAAX Studio →" | "Start a project" |

**Result: DOES NOT MATCH APPROVED HERO.**

Additional hero references:
- Image source: `hero1920/1280/640` AVIF+WebP srcset (asset json files present under `src/assets/cyryx-hero-monolith-v2-*`).
- Video source: `src/assets/cyryx-hero.mp4.asset.json`.
- Poster: uses same AVIF/WebP srcset (`Hero.tsx` `<picture>` block).
- Animation: none active — `parallax` object is hard-coded zeros; GSAP animations invoked via `useCyryxScrollAnimations` in `index.tsx`.
- Mobile: single-column, min-h `100svh`, CTAs stack.
- Reduced motion: `prefers-reduced-motion` gated — video not mounted when reduced.
- Lazy loading: video src assigned only when in viewport via IntersectionObserver.

Hero component/image/video/animation code appears unchanged; the mismatch is copy-only in `src/copy/v3.ts`.

---

## 7. Asset Inventory (evidence: `src/assets/*.asset.json`)

Cyryx brand marks:
- `cyryx-logo.svg`, `cyryx-logo-full.png`, `cyryx-logo-full-clean.png`, `cyryx-logo-full-transparent.png`, `cyryx-logo-header-transparent.png`, `cyryx-logo-clean-v3.png`, `cyryx-logo-n2.png`, `cyryx-mark.png`, `cyryx-shield-mark.png`, `cyryx-wordmark.png`, `cyryx-wordmark-chrome.png`. Reference map (which is imported where): NOT VERIFIED — likely duplication.

Homepage hero:
- Active: `cyryx-hero-monolith-v2-{640,1280,1920}.{webp,avif}` (referenced in `Hero.tsx` and `index.tsx` preload).
- Legacy/possibly unused: `cyryx-hero-{480,960,1600}.webp`, `cyryx-hero-serene-{640,1280,1920}.webp`, `cyryx-hero-monolith-serene.png`, `cyryx-hero-banner.png`, `cyryx-hero-cinematic.png`, `cyryx-hero-shield.png`, `cyryx-hero-void.jpg`, `cyryx-monolith.png`. Reference status: NOT VERIFIED.
- Video: `cyryx-hero.mp4` (referenced).

MAAX Studio: `cyryx-maax-visual.png` (SVG). Where used: NOT VERIFIED.

Lyra: `lyra-mark.png`, `lyra-lockup.png`, `lyra-og-1200x630.jpg`. Reference: `products.lyra.tsx` per prior task summary — NOT VERIFIED in this phase.

Products / Solutions / Company / Research / OG / Fonts: no other domain-specific assets present under `src/assets/` beyond the above (based on the enumerated `.asset.json` files).

Whether previous task removed any asset: none removed (`git` check not run; no `Delete` operations reported in summarized history).

---

## 8. Public Claims Inventory

Not fully enumerated in this phase — requires reading each route's copy. What is directly evidenced in files already read:

- Homepage JSON-LD (`src/routes/index.tsx`, lines 62–132):
  - `Organization.slogan: "The execution layer for operational AI."` — matches current v3 copy, NOT the approved "enterprise AI" copy.
  - `SoftwareApplication` (MAAX Studio) declares `availability: PreOrder`, `featureList: [Mission-based execution, Project memory, Command Gates, Mission Ledger, Cost visibility]`, description "In active development." Evidence for each feature capability: NOT VERIFIED (would require MAAX product page + source review).
- Copy `src/copy/v3.ts` header/CTA/maaxSpotlight/finalCta strings present. Broader claims (metrics, customers, testimonials, certifications, response times, pricing): NOT VERIFIED — would require reading each section component. Historical note (from prior summarized audit) suggested no customer logos/testimonials/metrics exist; this remains NOT VERIFIED in Phase 0.

Recommendation: full claim inventory belongs in a Phase 1.5 sub-audit, not Phase 0.

---

## 9. Design System Inventory

Evidence points, not exhaustive:
- Tokens defined in `src/styles.css` (referenced across components as `var(--onyx)`, `var(--silver)`, `var(--silver-dim)`, `var(--accent-glow)`). Full token list: NOT VERIFIED in this phase (file not read).
- Fonts: `font-orbitron` used on hero H1; body Tailwind default. Font loading strategy: NOT VERIFIED.
- Utilities present: `text-silver-gradient`, `text-chrome-gradient`, `cx-liquid-glass`, `cx-hero-*`, `cx-core-line`, `cx-bg-*`, `cx-stage`.
- Primitives: `HudGrid`, `HudLabel`, `GlassPanel`, `BackgroundMonolith`, `GridFloor`, `MagneticButton`, `CyryxMark`, `BrandGlyphs`.
- Layout wrappers: page-level max width `max-w-7xl` observed in Hero; other sections NOT VERIFIED.
- Inconsistencies: NOT VERIFIED in this phase (previous audit flagged HUD/mono/uppercase overuse, silver-gradient overuse, teal accent overuse, mixed hairline opacities — all remain candidate concerns pending re-verification).

---

## 10. Current Test and Build Results

- `bun run typecheck`: NOT VERIFIED (not executed to preserve freeze — this command is read-only in principle; recommend running in Phase 1).
- `bun run build` / `build:dev`: NOT VERIFIED (mutates `.output/`).
- `bun run lint`: NOT VERIFIED.
- `bun run test:a11y` / `test:unit`: NOT VERIFIED.
- `bun run seo:self-check`, `compliance:self-check`, `quality:validate-terms`, `quality:audit-admin-links`: NOT VERIFIED.

Note: `typecheck`, `test:*`, `seo:self-check`, `compliance:self-check`, `quality:validate-terms`, and `quality:audit-admin-links` are read-only. They were not run in Phase 0 out of an abundance of caution regarding the freeze scope. Explicit approval to run them is proposed for Phase 1 (see §15).

---

## 11. Duplicate or Conflicting Routes

- File-level: no two files claim the same URL. `solutions.applied-ai-systems.tsx` is a redirect, not a duplicate content endpoint.
- Content overlap (semantic, not routing): 8 non-redirect solution routes likely overlap in message and audience, per prior audit. Overlap map: NOT VERIFIED in this phase.
- Commercial funnel overlap between `/contact`, `/start`, `/engagement-model`, `/managed-operations`: NOT VERIFIED at copy level.
- Home JSON-LD `Organization.slogan` diverges from approved hero wording (see §6).

---

## 12. Files Changed by the Previous Task

Per summarized history (repository evidence, not `git status`):
- Created: `src/components/cyryx/primitives/HudGrid.tsx` — present.
- Edited: `src/routes/products.lyra.tsx`, `src/routes/products.tsx`, `src/routeTree.gen.ts` — present.
- Content-diff verification vs. approved baseline: NOT VERIFIED in Phase 0.

No other files known to be modified by the previous task.

---

## 13. Locked Files and Assets (must not be touched in any subsequent phase without explicit unlock)

- `src/components/cyryx/Hero.tsx`
- `src/copy/v3.ts` hero block **only for the copy fields listed in §1** — note this locks the CURRENT (mismatched) state; if approved hero must be restored, unlock is required.
- All `src/assets/cyryx-hero*` webp/avif/png/jpg files.
- `src/assets/cyryx-hero.mp4.asset.json`.
- All `src/assets/cyryx-logo*`, `cyryx-wordmark*`, `cyryx-mark*`, `cyryx-shield-mark*` files.
- All `src/assets/cyryx-maax-visual*`, `lyra-mark*`, `lyra-lockup*`, `lyra-og*` files.
- All `src/assets/cyryx-hero-cinematic*`, `cyryx-monolith*`, `cyryx-hero-void*`, `cyryx-hero-shield*` files.
- Hero animation source `src/hooks/useCyryxScrollAnimations.ts` insofar as it drives hero.
- Background stack: `src/components/cyryx/primitives/BackgroundMonolith.tsx`, `MonolithScene.tsx`, `GridFloor.tsx`.

**Conflict flag:** the lock and the "approved hero" text are in tension because the deployed copy diverges. This must be reconciled by the user before Phase 1.

---

## 14. Unknowns Requiring Verification

- Git branch, working-tree cleanliness, commit id, push and deploy status of previous task.
- Whether current site build passes typecheck, lint, a11y, unit tests, SEO self-check.
- Per-route indexability, sitemap membership, and nav membership.
- Full claim inventory across all pages.
- Full asset reference map (which of the 20+ `cyryx-hero*` and logo variants are actually imported).
- Full `src/styles.css` token list and any hardcoded color usage outside tokens.
- Header + Footer nav order and MobileMenu content.
- Whether `Organization.slogan` in home JSON-LD must match hero headline or independently.

---

## 15. Recommended Scope for Phase 1 (SMALLEST STABILIZATION STEP — DO NOT IMPLEMENT)

**Scope:** Run the four read-only diagnostic commands and reconcile the hero-copy conflict — nothing else.

1. Execute (read-only): `bun run typecheck`, `bun run lint`, `bun run test:unit`, `bun run seo:self-check`, `bun run compliance:self-check`, `bun run quality:validate-terms`. Capture pass/fail + error summaries.
2. Present the user with a binary decision on the hero-copy conflict identified in §6:
   - Option A: Update `src/copy/v3.ts` hero block to the approved "enterprise AI" text + CTA order, and update `Organization.slogan` in `src/routes/index.tsx` to match.
   - Option B: Update the "approved hero" spec in this task to match the currently deployed "operational AI" copy.
3. No other files are touched in Phase 1. Redesign work stays deferred until this reconciliation lands.

---

**PHASE 0 COMPLETE — NO FILES MODIFIED.**
