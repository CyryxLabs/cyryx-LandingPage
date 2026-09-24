# Conversion overhaul — 2026-09-24

Source: website audit of 2026-09-23 (Claude artifact "Auditoria cyryxlabs.com").
Branch: `feat/conversion-overhaul` (from `main` @ 88fd3e7). Not pushed, not deployed.

## Decisions applied

| Topic | Decision |
| --- | --- |
| MAAX Studio | Discontinued. Removed everywhere public. `/products/maax-studio` → 308 `/products`. |
| Products | Kept. Shows **AEXOS** (Core available on npm, Pro in beta). New page `/products/aexos`. |
| Hero | Option A is the default (`v4a`, "The execution layer for enterprise AI."). Option B via `?copy=v4b`. |
| Primary CTA | "Start a project" everywhere (was "Start a fit review"). Secondary: "See how we work". |
| Typography | Space Grotesk for every display title (Cormorant removed). |
| Real-time response | AI assistant on the site + instant AI first reply to every project brief, using Gemini. No human response-time promise. |
| AEXOS subdomain | `noindex` prepared in the separate `cyryx-command-flow` folder (not this repo). |

## What changed

### First screen and homepage
- Headline, sub and both CTAs visible in the first frame on every device. Phones get a static poster (no 400svh scroll scene, no frame downloads).
- Desktop scroll scene shortened to 190svh; copy stays pinned; frames 001–015 only, loaded after first interaction or 2.5 s idle. "Loading experience" indicator removed.
- New `ExecutionTrace` panel (animated, labelled "Illustrative example", respects reduced motion).
- New `ProofStrip` under the hero (CGP DOI, method, answers, GitHub; founder item appears when `src/data/team.ts` is filled).
- Sections reordered and rewritten in plain language: The problem → Four ways to start → How it runs → What you receive (tabbed sample documents, labelled "Sample · illustrative data") → Governance → Start.
- Gartner 60% (Feb 2025, "through 2026") replaced by Gartner Sep 2026 (AI governance). Duplicated phrases removed.
- `TeamBlock` ("Who you'll work with") renders only when `FOUNDER` is set in `src/data/team.ts`.

### Design system
- One CTA system: `.cx-btn-primary` (filled teal) and `.cx-btn-secondary` (outlined), used in hero, header, final CTA, sticky bar, internal heroes, footer.
- Labels raised from 8–10 px to 11–12 px; nav 13 px; header background opaque (no text bleed on mobile).
- Hero H1 is now the largest text on the page.

### Lead capture
- `/start` is a two-step form: essentials first (name, email, company, type of work, what to change, consent), optional context second. "What happens next" shown before the form.
- Homepage CTAs no longer pre-select project type "Other".
- First-touch attribution (allow-listed `utm_*`, referrer origin+path, landing path, copy variant) stored with the lead.
- Structured qualification stored as JSON (`qualification`), plus `attribution` and `ai_first_reply` columns — migration `20260924120000_structured_leads_and_maax_retirement.sql`. The API falls back to the old RPC until the migration is applied.
- Events: `form_start`, `form_step_complete`, `generate_lead`, `assistant_open`, `assistant_message`, `assistant_lead`, `assistant_error`, `proof_link`, `evidence_sample`, `see_how_we_work`, `view_product`, `copy_command`.

### Real-time AI
- `/api/public/assistant`: streaming answers from Gemini, grounded only in `src/lib/ai/knowledge.ts` (no prices, dates, client names or promises), 30 requests / 10 min per IP, turn and length caps.
- `AssistantWidget`: floating "Ask Cyryx", suggestions, streaming replies, "Talk to the team" lead form that sends the conversation summary with consent. Hidden on /workspace and /auth; on the homepage it appears after the first screen.
- Instant first reply: every project brief gets a Gemini-drafted first read (7 s timeout, sanitized, fallback to the static confirmation). Shown on screen and included in the confirmation email; stored with the submission.
- Privacy policy updated (Gemini as subprocessor, assistant data, attribution storage). Consent version bumped to `website-contact-v3-2026-09-24`.

### Performance and SEO
- Public HTML: `cache-control: public, max-age=0, must-revalidate` + `cdn-cache-control: s-maxage=300, stale-while-revalidate=3600` (Vercel purges on deploy). Private routes stay `no-store`.
- `/media/**` cached 7 days (nitro routeRules).
- Removed: 11.5 MB of unused MP4s, 25 hero frames, mobile frames, MAAX images/logo (~3 MB), 20 dead components, the Cormorant font request.
- Scroll diagnostics only in dev or with `?cx-diagnostics`; hero debug panel removed.
- Homepage title/description, Organization slogan, `llms.txt`, sitemaps and FAQ JSON-LD updated. `.quality/forbidden-terms.json` now forbids `MAAX`.

## Required before deploy

1. Apply the Supabase migration `supabase/migrations/20260924120000_structured_leads_and_maax_retirement.sql`.
2. Vercel env vars (Production): `GEMINI_API_KEY` (server), optional `GEMINI_MODEL` (default `gemini-3.8-flash`), `VITE_ASSISTANT_ENABLED=true` (build time). Confirm `SUPABASE_SERVICE_ROLE_KEY` is set, otherwise notification and confirmation emails are skipped.
3. Send one real test brief after deploy and confirm the internal email arrives at contact@cyryxlabs.com.
4. Optional: fill `src/data/team.ts` (founder name, role, bio, photo) to enable the team block and founder proof item.
5. Choose hero A or B (compare with `?copy=v4b`), then keep the winner as the default in `src/copy/index.ts`.

## Verified

- `tsc --noEmit`: 0 errors. Build (node preset) OK.
- Unit tests (bun): 54 passing, including leads fallback, sanitizer and Gemini helpers.
- Playwright (chromium desktop, mobile 360, forced colors) against a production build with local mocks for Supabase RPC and Gemini (`tests/support/mock-gemini-server.mjs`). See final run log in the delivery note.
- Not verified here: WebKit/Safari project (browser not installed), real Gemini and Supabase calls, real email delivery, Vercel headers in production.

## Revision 2 — founder feedback (2026-09-24)

| Feedback | Change |
| --- | --- |
| Hero scroll/motion method was broken | Restored the approved scene from `main`: 400svh sticky scene, 40-frame desktop and mobile sequences, GSAP entrance, content hand-off, the three story statements (Cormorant) and the logo reveal. Only the copy and CTAs changed. Cormorant is back for internal hero titles too (typography change reverted). |
| Execution Trace must not be in the hero | Moved to "How it runs" (ControlledExecution) as an animated "one run, end to end" example. |
| Outdated/unrelated content (Gartner) | ExecutionGap no longer quotes third-party statistics: four breaks (data, authority, cost, ownership) close as the section scrolls. Content sweep: lab naming ("Applied AI Lab"), company page lines, engagement-model hero (5 steps), managed-operations CTA, goal-grounded-generation answer (no internal architecture vocabulary, no client claim), terms version date, llms.txt, assistant knowledge, Organization description. |
| Governance duplicated elements | Kept one visual (the monolith with its scrubbed core); removed the second core/gates figure that repeated the list. |
| Static content, footer not premium | `useSiteMotion` (site-wide reveals, counters, draw lines, parallax, pointer spotlight), CSS entrance for internal heroes, ambient light, sweeps. New footer: CTA band, contact column, animated wordmark, back-to-top. |
| Products/AEXOS page poor | `/products/aexos` rebuilt from the published package (v5.3.0): what it is, what it is for, cycle simulation, routing simulation, package counts, concepts, roles and squads, gates and principles, install, editions (Core / Pro), FAQ. `/products` gets an install preview, publishing rules and stage track. No internal GTM, prices or roadmap. |

Open decision (not changed): `/solutions/digital-web-systems` is a web/brand offer outside the stated positioning. Options: keep, rewrite, or 308 to `/solutions/workflow-automation`.
