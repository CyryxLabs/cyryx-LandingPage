# Cyryx Labs website: current-site audit (Gate 1, truth and scope)

Date: 2026-11-17
Inputs: repository snapshot `feat/site-2026-11` (last commit a816685 plus uncommitted work; `public/`, `scripts/`, `.github/`, `.quality/` and Playwright/LHCI config files were not in the snapshot), the public file list `tmp-public-list.csv`, the blueprint (17 Nov 2026), and public pages read on 2026-11-17.
Nothing was deployed, submitted, installed or e-mailed. No secret values appear in this document; environment variables are named only.

**Evidence tags:** **[code]** read in the snapshot · **[live]** observed on a public page on 2026-11-17 · **[inference]** reasoned, not observed · **[unverified]** could not be checked.

Severity reflects commercial and legal exposure combined with how likely it is to mislead a visitor: Critical > High > Medium > Low.

---

## 1. Findings at a glance

| # | Finding | Severity | Evidence |
|---|---|---|---|
| F1 | Home, service and company pages make blanket promises the founder has not approved: "You own the code and data", "Fixed scope and quote in writing", "Human approval on what matters", "with human approval, audit logs and cost limits built in". The same text also appears in FAQ JSON-LD, llms.txt and the assistant's knowledge. | Critical | [code] `src/routes/index.tsx:192-194, 227-229, 240`; `src/data/home.ts:16,24,32,76-83`; `src/lib/ai/knowledge.ts:18-20` · [live] home |
| F2 | Fixed delivery timelines are published in at least 6 places: about 2 weeks per automation, a 30-day pilot, 2+8–12 weeks for an MVP, 3–4 weeks for a website, and 2–4 weeks / 30 days–3 months / 4–12 weeks by company size. | Critical | [code] `src/data/services.ts:153-326, 448-517, 730-808`; `src/data/market.ts:133,165,197`; `src/data/home.ts:12,20` · [live] home, llms.txt |
| F3 | 8 of the 17 distinct third-party figures could not be confirmed on the cited source page. RSM "47% integration" conflicts with the source's 28% for legacy integration, and the G2 figure has no URL. | High | [code] `src/data/market.ts:110-188`, `services.ts:70,361,738` · [live] source pages |
| F4 | Orbit (an approved, in-scope product) is missing everywhere. The home page says "Two AI products you can use today" and "Both are available today", which hides Onyx's beta status. | High | [code] `index.tsx:248,642-643` · [live] home |
| F5 | AEXOS Pro is presented as an available paid licence with a CTA, but the code's own comment says Pro/Team pricing is still being validated. | High | [code] `src/data/aexos.ts:185-188`, `src/data/site-taxonomy.ts:84-85,92`, `products.aexos.tsx:562`, `knowledge.ts:51` |
| F6 | Onyx facts have drifted. The website shows version 1.14.25 while the product site shows 1.14.45. "No card, no account" conflicts with a download modal that asks for name and work e-mail. The unsigned installer is not mentioned. | High | [code] `src/data/onyx.ts:11,203` · [live] onyx.cyryxlabs.com, /products/onyx |
| F7 | Primary navigation (Products · Services · Research · Company, CTA "Get a free fit check") does not match the target IA (Products · Solutions · Demos · Insights · Company, CTA "Discuss your project"). There is no /demos and no /insights. | High | [code] `src/lib/navigation.ts:222-273` · [live] home nav |
| F8 | Favicon and apple-touch-icon still use the retired crest. The wordmark-only rule is otherwise implemented. | Medium | [code] `src/routes/__root.tsx:102-123`; `stories/site-v6-2026-11-13.md:26` (open item) |
| F9 | Funnel analytics do not separate intent from real conversion. The readiness quiz fires `form_start` on the first answer and `generate_lead` on a plan request, both in section `paths`. The Web Vitals endpoint discards its data. | Medium | [code] `Scorecard.tsx:102-138`; `api/public/web-vitals.ts` |
| F10 | The motion stack is layered: GSAP + ScrollTrigger, a custom rAF motion module, two WebGL canvases (LightField, Horizon), a hero video, CSS word animations, and a 5th font (Instrument Serif) that is outside the approved trio. 80 unused hero-sequence frames (2.9 MB) remain in `public/`. | Medium | [code] `useSiteMotion.ts:61-66`, `MobileMenu.tsx:72`, `LightField.tsx:94`, `Horizon.tsx:78`, `motion.ts`, `cy.css:29-35, 5459-5476` |
| F11 | Deployment is a manual `vercel deploy --prod` from a local, unpushed commit. Push/PR to main is blocked by 116 pre-existing lint errors. The CI workflow is described in the README but its files are not in the snapshot. | Medium | [code] `stories/site-v6-2026-11-13.md:136-143`; `README.md` |
| F12 | Dead modules hold retired or conflicting content: `src/data/offer.ts` (ASTRA card, "fixed quote") and `src/copy/*` ("Fixed-price quotes", `getCopy` unused). Nothing imports them, but they can be re-imported later. | Low | [code] `offer.ts:142-159`; `copy/shared.ts:17`; `copy/index.ts:26` |

---

## 2. Framework, stack and dependencies [code]

- **Framework:** TanStack Start (`@tanstack/react-start ^1.168.61`, `@tanstack/react-router ^1.170.42`) with React 19, Vite 8 and Tailwind CSS 4. The build wrapper is `@lovable.dev/vite-tanstack-config 2.7.6` (`vite.config.ts:6`), which also injects nitro, React, Tailwind and the `VITE_*` env. Nitro preset `vercel` (`vite.config.ts:19`), with `node` for Lighthouse builds. The server entry is wrapped by `src/server.ts` (legacy redirects, security headers, cache policy, stale-CSS rescue, SSR error page).
- **UI kit:** the full shadcn/Radix set (≈27 `@radix-ui/*` packages), plus `recharts`, `embla-carousel`, `cmdk`, `vaul`, `input-otp`, `react-day-picker` and `react-resizable-panels`. Most of these are imported only by `src/components/ui/*` and none appear on the marketing pages [inference: they could be pruned after a usage check].
- **Animation systems (flag):**
  1. GSAP 3 + ScrollTrigger (`src/hooks/useSiteMotion.ts:61-66`, `src/components/cyryx/MobileMenu.tsx:72-75`; `@gsap/react` is also installed).
  2. A custom rAF motion module (`src/components/site/motion.ts:57,184,246`: counters, pointer effects).
  3. WebGL canvas `LightField` behind the whole home page (`src/components/site/LightField.tsx:84-95`, `index.tsx:145`).
  4. WebGL canvas `Horizon` inside `PageHero`/`FinalCta` (`src/components/site/ui.tsx:284,316`; `Horizon.tsx:78`).
  5. Hero video (`HeroVideo.tsx`: 5 s generated clip, plays once; 1920 and tall MP4s).
  6. CSS word/line reveals (`ui.tsx:46-99`) and `tw-animate-css`.
  7. A smooth-scroll hook (`useSmoothScroll.ts`).

  Reduced-motion and low-end fallbacks exist (`__root.tsx:158-172`). The blueprint asks for restrained animation dependencies, so consolidate on one system in Gate 3.
- **Fonts:** self-hosted Space Grotesk, Inter and IBM Plex Mono (approved), plus **Instrument Serif italic** (`src/styles/cy.css:29-35`, used by `.cy-it` at `cy.css:5459-5476` for the `*accent*` word in almost every H2). Instrument Serif is outside the approved typography, so remove it or ask the founder for an explicit approval. `src/styles.css:67` still declares `--font-orbitron` mapped to Space Grotesk (harmless legacy).
- **Two CSS systems:** `src/styles.css` (2,819 lines, legacy `cx-*`) and `src/styles/cy.css` (5,553 lines, new `cy-*`). Inner pages are split across them. `/products/aexos`, `/start`, `/brief`, `/careers` and `/engagement-model` use the legacy `Header`/`InternalHero` look, while home, solutions, products and company use `SiteShell`.

## 3. Routes and route tree [code]

File-based routes are in `src/routes/` and the tree is generated in `src/routeTree.gen.ts`. There are 37 page and redirect route files (plus `__root.tsx`), 5 sitemap handlers and 8 API routes. The complete list, with intent and decisions, is in `CONTENT_INVENTORY.csv`.

- **Pages:** `/`, `/products`, `/products/onyx`, `/products/aexos`, `/solutions`, nine service pages under `/solutions/*` plus `/managed-operations` (all rendered by `serviceRoute()` in `src/components/site/ServicePage.tsx:16-45`), `/engagement-model`, `/start`, `/brief`, `/contact`, `/company`, `/careers`, `/research`, `/research/$slug` (cgp-v1), `/answers` plus 6 explainers, `/privacy` and `/terms`.
- **In-router redirects (308):** `/products/maax-studio → /products`, plus four legacy solution aliases (`solutions.ai-product-engineering.tsx`, `…ai-websites-lead-systems.tsx`, `…applied-ai-systems.tsx`, `…governance-optimization.tsx`).
- **Not present:** `/demos`, `/insights`, solution-group overview pages, and any Orbit page.
- `/products` uses `<Outlet/>` for children (`products.tsx:41-42`).

## 4. Content storage [code]

| File | Holds | Rendered? |
|---|---|---|
| `src/data/home.ts` | HOME_FAQ, PROCESS_STEPS, GUARDRAILS, MARQUEE | Yes (MARQUEE unused) |
| `src/data/market.ts` | Third-party statistics, size segments with timelines, G2 stat | Yes |
| `src/data/services.ts` | 10 service definitions (copy, FAQ, timelines, stats) | Yes: pages, sitemap, JSON-LD, assistant |
| `src/data/products.ts` | Onyx and AEXOS cards | Yes |
| `src/data/onyx.ts` / `aexos.ts` | Product facts (version, FAQ, editions, counts) | Yes |
| `src/data/site-taxonomy.ts` | AEXOS_PRODUCT (used); OPERATING_LIFECYCLE and PUBLIC_CONTENT_DEFINITIONS (unused) | Partly |
| `src/data/seo-entities.ts` | Organization JSON-LD node, sameAs | Yes |
| `src/data/publications.ts` | CGP v1 publication | Yes |
| `src/data/team.ts` | `FOUNDER = null` (founder anonymous; nothing rendered) | Correct per decision |
| `src/data/offer.ts` | Old offer model incl. **ASTRA** | **No**: dead code |
| `src/copy/*` | Hero copy variants v4a/v4b/v5 | **No**: `getCopy` unused; only variant IDs feed analytics |
| `src/lib/ai/knowledge.ts` | Assistant knowledge, generated from the data files | Yes (server) |

Because the assistant, the JSON-LD and the pages read the same data files, a fix in `data/*` propagates everywhere. That is good. The exceptions are `public/llms.txt` (static, needs a manual edit) and the hard-coded copy in route files.

## 5. Brand assets [code]

- **Wordmark:** `src/assets/cyryx-brand-wordmark.png` (master) and `src/assets/cyryx-wordmark-480.webp`, rendered by `CyryxLockup`/`CyryxWordmark` (`src/components/cyryx/primitives/CyryxMark.tsx:1-24`). `CyryxMark` (crest) is a no-op (`CyryxMark.tsx:51-52`). This complies with the wordmark-only decision.
- **Favicon:** `/favicon.ico`, `/favicon-16x16.png`, `/favicon-32x32.png` and `/apple-touch-icon.png` (`__root.tsx:102-123`, version stamp `20260723-1`). These are reported as the crest, and `stories/site-v6-2026-11-13.md:26` lists "Favicon and apple-touch-icon without the crest (needs a founder decision)" as open. **Severity Medium:** replace with a wordmark-derived monogram after founder approval. [Image content not inspected visually in this pass.]
- **Social image:** `/cyryx-og.png?v=20261113-1` (`index.tsx:35`). Also used as the Organization `logo` (`seo-entities.ts:45-48`). Its content was not inspected; confirm it carries no crest.
- **Orphans:**
  - 30 `src/assets/*.asset.json` Lovable hosted-asset manifests, including `cyryx-hero-monolith-*`, `cyryx-monolith.png`, `cyryx-shield-mark.png` and `cyryx-mark.png`. None is imported.
  - 80 `public/media/hero-sequence/**` frames (2,870,838 bytes), with no reference in `src/`.
  - `design/hero-film/README.md` documents a removed `HeroFilm.tsx`.
- **Hero visual:** a generated "hand touching glass" clip (`design/hero-touch/README.md`). It shows no monolith, which matches the founder decision. The blueprint's "preserve the official monolith" is superseded.
- **Project-description drift:** the attached project brief still names the hero "The execution layer for enterprise AI." with a "MAAX Studio →" CTA. Neither exists in the code or on the live site. MAAX is retired and the founder decisions in force override this; the project description should be updated. [code + live]

## 6. Forms and where they post [code]

All inquiry data goes server-to-server to the Cyryx CRM intake (contract v1). The browser never calls the CRM. Requests are HMAC-signed in `src/lib/crm-intake.server.ts:21-45`.

| Form | UI file | Endpoint | CRM route | Protections | Consent version |
|---|---|---|---|---|---|
| /start fit check (2 steps) | `src/routes/start.tsx:205` | `POST /api/public/contact` | `/submit` (kind `project`) | Zod, honeypot `website`, mailto fallback on error (`start.tsx:231-244`) | `website-contact-v3-2026-09-24` (`contact.schema.ts:11`) |
| /contact form | `src/components/site/ContactForm.tsx:24` | `POST /api/public/contact` | `/submit` | same | same |
| Readiness check (home) | `src/components/site/Scorecard.tsx:118` | `POST /api/public/contact` | `/submit` (problem text "AI readiness check: n/10…") | same | same |
| Assistant lead capture | `src/components/cyryx/AssistantWidget.tsx:394` | `POST /api/public/contact` | `/submit` (kind `assistant`) | same | same |
| /brief wizard | `BriefWizard.tsx:261,330,371` | `/api/public/brief/assist`, `/init`, `/submit` | `/init` (signed upload URLs), `/submit` (kind `brief`) | Honeypot `nickname`, 8 s min fill, per-IP 8/h submit, 20/h init, 10/h assist | `website-brief-v1-2026-09-24` (`brief.schema.ts:9`); optional marketing opt-in |
| /careers talent network | `src/routes/careers.tsx:227` | `POST /api/public/talent` | `/talent` | Same-origin, 8 KB cap, 5/h per visitor | contact v3 |

- **Env var names** (values not reproduced): `CRM_INTAKE_URL`, `CRM_INTAKE_SECRET` (must be ≥32 chars, https only; `crm-intake.server.ts:13-21`), `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_FALLBACK_MODELS`, `GEMINI_API_BASE` (tests only), `VITE_ASSISTANT_ENABLED` (build-time), and `VERCEL_GIT_COMMIT_SHA`/`VERCEL_DEPLOYMENT_ID`/`LIGHTHOUSE_BUILD` (build). Test-only: `MOCK_*`, `FORBIDDEN_TERMS_FILE`, `AXE_FAIL_ON`, `A11Y_REPORT_DIR`, `UPDATE_JSONLD_SNAPSHOT`, `PLAYWRIGHT_USE_PRODUCTION_SERVER`.
- **Failure behaviour:** without CRM config, `/api/public/contact` returns 503 "Backend unavailable" (`leads.server.ts:117-121`). /start shows an error and a pre-filled mailto. Success is shown only after an `ok` response (good; matches the blueprint).
- **E-mail:** the site sends no e-mail itself. Per code comments the CRM notifies the team (`api/public/contact.ts:66-67`, `talent.ts:194-196`). `confirmationQueued` is always `false` (`contact.ts:103`). [unverified: CRM-side e-mail behaviour]
- **Issue (Medium):** `/api/public/contact` has no rate limit on the site side, unlike the brief and assistant routes. It relies on the CRM's 429.
- **Issue (Medium):** the readiness check, the assistant lead and the project form all land as CRM `project`/`assistant` leads with `engagement.type: "Not sure"` (`leads.server.ts:80`). Qualified demand cannot be separated from quiz curiosity without reading free text.
- **Issue (Low):** `/start` asks for company as required (`start.tsx:412-413`). The blueprint suggests proportionate name/company fields.
- No end-to-end submission was performed (it would create CRM records). Routing is therefore verified only in code.

## 7. AI assistant [code]

- **UI:** `AssistantWidget` is mounted globally (`__root.tsx:258`). It renders only when `VITE_ASSISTANT_ENABLED === "true"` at build time (`src/lib/assistant-client.ts:13`). The conversation is kept in sessionStorage.
- **Server:** `POST /api/public/assistant` streams Gemini output (`api/public/assistant.ts`). Default model `gemini-3.5-flash-lite` with fallbacks (`gemini.server.ts:16-20`). In-memory per-IP limit of 30 per 10 minutes, per instance only (`rate-limit.server.ts`). Returns 503 without `GEMINI_API_KEY`.
- **Knowledge:** `src/lib/ai/knowledge.ts` is generated from the data files. It therefore currently tells visitors the fixed timelines, the blanket ownership answer, universal approval/logging, Latin America/Spanish service and "Pro is available under a paid commercial license" (lines 18-20, 39-40, 51-52, 72). The rules forbid prices and results but allow "the timelines in the knowledge section" (line 88). **High:** fix the data first; the assistant follows.
- The instant first reply on /start (`leads.server.ts:128-148`) uses the same knowledge.
- `ALLOWED_LINK_HOSTS` includes `aexos.cyryxlabs.com` (`leads.server.ts:150`), which now redirects. This is harmless but stale.
- [live] The live home shows "Ask the Cyryx assistant", so the assistant appears enabled in production (inference from UI text, not tested).

## 8. Analytics and tracking [code]

- **No third-party analytics:** no GA, GTM, Plausible, PostHog or Vercel Analytics in the code.
- `trackCta()` (`src/lib/track-cta.ts:65-90`) sends a beacon to `POST /api/public/cta-events`. The route checks same-origin, caps the body at 4 KB, limits each visitor to 60 per minute (in-memory), and forwards to CRM `/event` (`api/public/cta-events.ts`). The payload contains the event name, section, query-free path, destination, copy variant, referrer host and device class. It has no PII (`site-event.server.ts`). Nothing is stored on the site.
- **Event names:**
  - CTA clicks: `start_project`, `see_how_we_work`, `see_delivery`, `view_product`, `copy_command`, `careers_talent_network`, `careers_email`, `talent_network_signup`, `contact_email`, `view_research`, `read_cgp`, `proof_link`, `evidence_sample`
  - Form funnel: `form_start`, `form_step_complete`, `generate_lead`, `qualification_form_submitted`, `qualification_form_error`
  - Assistant: `assistant_open`, `assistant_message`, `assistant_lead`, `assistant_error`

  These are emitted from home, start, contact, brief, careers, products and the assistant.
- **Gaps against blueprint §12 (Medium):**
  - There are no `intent_selected`, `product_viewed`, `demo_started`/`demo_completed` or `meeting_booked` events.
  - `generate_lead` is client-side and fires for quiz plan requests (`Scorecard.tsx:138`) as well as project briefs.
  - `form_start` fires on the first quiz answer (`Scorecard.tsx:102`).
  - Section values are reused across different surfaces (the quiz uses `paths`).
  - Server-confirmed conversion exists only implicitly in the CRM record.
- **Web Vitals:** `web-vitals` beacons to `/api/public/web-vitals`, which discards the payload (`api/public/web-vitals.ts:1-5`). There is no field CWV data.
- **First-touch attribution:** UTM parameters, referrer and landing path are kept in localStorage for 30 days and sent only with a submission (`src/lib/lead-attribution.ts`).
- **Copy variant:** the `?copy=` parameter is stored in localStorage (`copy-variant.ts`), but the variants no longer render different copy (dead `getCopy`). Variant data is therefore meaningless.

## 9. Consent and privacy behaviour [code]

- There is no cookie banner. No cookies are set by the site code (grep). localStorage keys: `cyryx_first_touch`, `cyryx_copy_variant`, `cyryx-brief-draft-v1`. sessionStorage: `cyryx_assistant_thread`.
- CTA events are sent without prior consent. The privacy policy discloses this accurately (`privacy.tsx:363-381`). For a US-only audience this is a policy choice [inference]. If EU/UK traffic matters, review it.
- Form consent checkboxes are unchecked and required, and the version is stored with each record. Marketing opt-in is separate on /brief and is fixed to `false` on /contact (`leads.server.ts:98`).
- **Medium:** `privacy.tsx:355-356` describes "row-level access controls that do not grant anonymous direct table writes". This appears to describe the earlier database-backed intake, not the current CRM relay [inference]. Confirm it with the CRM data flow.
- **Legal entity:** "Cyryx Labs LLC, a Florida limited liability company" (`privacy.tsx:112-113`, `terms.tsx:78`), with Florida governing law (`terms.tsx:297-302`). This is consistent with the founder decision.

## 10. SEO, structured data and discovery

- **Canonical host:** `https://www.cyryxlabs.com` (`src/lib/site-url.ts:1`). Every route builds canonical/og URLs from `absoluteSiteUrl()`. [live] The home page's canonical is `https://www.cyryxlabs.com/`.
- **Metadata:** set per route via `buildHead()` (`src/components/cyryx/seo/seo.ts:205`) or explicit `head()` (home `index.tsx:37-138`). OG and Twitter tags are on the home page. A site-verification meta tag is present in `__root.tsx:89` (value not reproduced).
- **JSON-LD types in use:**
  - `Organization` (`seo-entities.ts:11-50`, `seo.ts:111`), with legalName Cyryx Labs LLC, address Port St. Lucie FL, `areaServed` US + Latin America, and sameAs GitHub + X.
  - `WebSite`, `WebPage`, `BreadcrumbList`.
  - `ItemList` for home services and products.
  - `FAQPage` on home, service pages, Onyx and answers.
  - `Service` (`seo.ts:89-110`), `TechArticle` (research and answers), `ContactPage` (`contact.tsx:32`), and a legal-page builder.
- **Gaps (Medium):**
  - No `SoftwareApplication` for Onyx or AEXOS, although the README says the snapshot pins one; the README and the `__snapshots__/jsonld.snapshot.json` have drifted.
  - The FAQPage nodes carry the claims flagged in `CLAIMS_REGISTER.csv`.
  - `slogan` (`seo-entities.ts:19`) will need the Gate 2 descriptor.
- **Sitemaps:**
  - `/sitemap.xml` is an index of `/sitemap-products.xml`, `/sitemap-solutions.xml` and `/sitemap-company.xml` (`src/lib/sitemap.ts:9-13`). `/sitemap-index.xml` is kept for backward compatibility.
  - [live] `sitemap-solutions.xml` returns 14 locs (solutions hub, 9 services, managed-operations, engagement-model, /start, /brief).
  - Retired and redirect URLs are correctly excluded.
- **robots.txt** [live]: allows all named search and AI crawlers (Googlebot, Bingbot, OAI-SearchBot, GPTBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-SearchBot, Claude-User, Applebot, Google-Extended, Applebot-Extended). It disallows `/api/`, `/_serverFn/`, `/workspace`, `/auth` and `/lovable/`, and references `/sitemap.xml`.
- **llms.txt** [live, 5,739 bytes in `public/`, not in snapshot]:
  - It restates the fixed timelines, the "clients own code, content and data after final payment" claim and the ten services.
  - It describes Onyx as "pre-launch" while the pages say "free beta". **High:** rewrite after Gate 2.
  - It contains good evidence boundaries ("do not infer implementation, certification…").
- **IndexNow:** key file at `/1f0a899cb1fd4b29b1f6756b6d61da84.txt` (public by design).
- **Redirects:**
  - In-router 308s: see §3.
  - Server-level rules in `src/lib/legacy-redirect.ts:11-27`, run before routing in `src/server.ts:158`:
    - `aexos.cyryxlabs.com` → `/products/aexos` (308)
    - `workspace.*`, `/auth`, `/workspace` → `crm.cyryxlabs.com` (308)
    - newsletter confirm/unsubscribe → `/` (308)
    - `/lovable/*` → 410
  - [live] `aexos.cyryxlabs.com` answered **302**, not 308. This suggests a Vercel domain-level redirect in front of the app (Low; make it permanent).
  - The apex → www redirect is handled at Vercel, per the deploy notes.
- **Security headers:** nosniff, referrer-policy, permissions-policy, X-Frame-Options DENY, and a minimal CSP (`frame-ancestors`, `object-src`, `base-uri`, `form-action`), with HSTS on the canonical hosts (`server.ts:58-75`). There is no script-src CSP (Low).

## 11. Tests, CI and deployment

- **Unit (bun test):** 6 files (`tests/site-contracts`, `leads`, `gemini`, `brief-assist`, `site-event`, `legacy-redirect`). The story notes 49 passing at the tenth pass [code: story; not re-run].
- **Playwright:** 32 specs in `tests/accessibility/` (a11y/axe, hero, nav, mobile, JSON-LD snapshot, sitemap coverage, robots, security headers, content guardrails including no-MAAX, bundle scan, visual regression with win32 snapshots), plus `tests/cross-browser/compatibility.spec.ts`. About 215 `test(` calls in total.
- **Stale tests (Medium, inference):** `compatibility.spec.ts:51,95` expects the link "Start a fit review with Cyryx Labs" and the heading "Which situation is closest to yours?", neither of which exists in the current copy. Visual-regression baselines are win32-only.
- **Not in the snapshot, so not verifiable:** `playwright.config.ts`, `playwright.cross-browser.config.ts`, `lighthouserc.*.json`, `scripts/*.mjs` (forbidden terms, SEO self-check, IndexNow, compliance), `.quality/forbidden-terms.json`, and `.github/workflows/*`. The README describes a "Quality" GitHub Actions workflow (axe SARIF, Lighthouse budgets, PR comment).
- **Deployment** (`stories/site-v6-2026-11-13.md:134-143`):
  - The 2026-11-14 production release came from local commit `656c4ce`, **not pushed**, via `vercel deploy --prod` (CLI, not git-linked).
  - Rollback is documented with `vercel rollback`/`promote`.
  - Push/PR to `main` is blocked by 116 pre-existing lint errors.
- **High (process risk):** production can diverge from any reviewed branch. Gate 4/5 should first make the deploy reproducible from a pushed commit.
- **Live vs repo drift [live]:** the live home H1, assurance strip, section order and H2s match the snapshot's `index.tsx`. Onyx live still shows 1.14.25. The build header (`x-cyryx-build`) was not inspected.

## 12. Claims that conflict with founder decisions or the blueprint

Full list with file:line, source check and publication state: `CLAIMS_REGISTER.csv` (75 entries). Summary:

| Conflict | Where | Action |
|---|---|---|
| Monolith/crest imagery | Not rendered. Remains in favicon set, orphan asset manifests and legacy CSS selectors (`styles.css:1396,1525-1575`) | Replace favicon after approval; delete orphans |
| MAAX references | Only the 308 route and tests. Not rendered; live home clean | Keep redirect; retire tests that name MAAX in nav fixtures (`mobile-navigation.spec.ts:115-116`) once obsolete |
| ASTRA references | Only dead `src/data/offer.ts:82-159` | Delete after approval |
| "You own the code and data" (blanket) | `index.tsx:229,240`; `home.ts:32,67`; `services.ts:239,448,452,480,521,972`; `company.tsx:56-57`; `products.tsx:66`; llms.txt | Replace with "Ownership and licensing are defined in each agreement" (cf. `engagement-model.tsx:77`) |
| "Fixed scope and quote in writing" / "fixed written quote" | `index.tsx:227,240,570`; `home.ts:16,53`; `start.tsx:29,273`; `company.tsx:45` | Founder to confirm practice; reword to "written scope and acceptance criteria" |
| "Human approval on what matters" / "audit logs and cost limits built in" | `index.tsx:192-194,228,613`; `home.ts:24,71-84`; `services.ts:334,472,567`; `knowledge.ts:18-20` | Say these are designed per engagement and agreed in scope, not universal |
| Fixed timelines (~2 weeks per automation, 30-day pilot, 8–12 weeks, 3–4 weeks, size-based) | see F2 | Remove; "timeline agreed in the written plan" (`services.ts:50` already has this phrase) |
| Third-party market statistics | `market.ts:57-188`; `services.ts` stats | Keep only verified ones with precise base; move off the home hero sequence per blueprint |
| Onyx labels | "Free beta" verified; version stale; "No card, no account", "24/7", "tamper-evident" need evidence | See `PRODUCT_TRUTH_REGISTER.json` |
| AEXOS Pro as an available paid product | `aexos.ts:185-188`; `products.aexos.tsx:528,562` | Hold until a real offer exists |
| "Two AI products you can use today" (no Orbit) | `index.tsx:642` | Three-card portfolio with status badges; Orbit "In development", no CTA |
| US + Latin America, English and Spanish | `home.ts:39-40`; `company.tsx:98`; `seo-entities.ts:28` | Founder to confirm scope |
| "No open-ended retainers" vs monthly managed operations | `index.tsx:573` vs `services.ts:959` | Rewrite |
| CTA "Get a free fit check" vs target "Discuss your project" | `navigation.ts:270-273`; `ui.tsx` StartButton default | Change label; keep `/start` URL |

## 13. What was not verified

- Visual content of the favicon, OG image and hero media (no image inspection).
- Any form submission, CRM routing, CRM-side e-mails or spam handling.
- The Onyx installer download and run, and any Onyx or AEXOS capability.
- AEXOS LICENSE text; GitHub repo `CyryxLabs/AEXOS` (fetch rate-limited); the npmjs.com package page (fetch failed; the registry API was used).
- HTTP status codes of the MAAX, legacy-alias and apex redirects (the fetch tool hides same-host redirects). Code and tests assert 308.
- The CI workflow, Playwright/LHCI configs and quality scripts (not in the snapshot); the current pass/fail state of tests and lint.
- Full survey reports behind press releases (statistics marked needs-evidence may exist in full reports); the G2 source; the CGP DOI resolution.
- Instagram profile (out of scope; the blueprint reports possible MAAX references).
