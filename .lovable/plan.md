
# PHASE 2 — INFORMATION ARCHITECTURE & ROUTE CONSOLIDATION (READ-ONLY DECISION MATRIX)

No files were modified. No routes, redirects, sitemaps, metadata, JSON-LD, navigation, or `routeTree.gen.ts` were changed. All findings below are traced to exact repository paths.

Legend: **[FACT]** verified in source · **[INFER]** reasoned from source, not asserted as truth · **[REC]** recommendation only, not executed · **[NV]** not verified.

---

## 1. Phase 2 Executive Summary

- **[FACT]** The public route surface is 33 page routes (excluding sitemap/API/lovable internals) across `src/routes/`.
- **[FACT]** Solutions cluster has 9 physical files: 6 live content pages + 3 redirect-only stubs (`solutions.ai-product-engineering.tsx`, `solutions.applied-ai-systems.tsx`, `solutions.governance-optimization.tsx`).
- **[FACT]** Two entry-to-engagement funnels exist in parallel: `/contact` (marketing-styled) and `/start` (structured intake form). Both submit through `submitContact` in `src/lib/contact.functions.ts` (`src/routes/start.tsx:9`, `src/routes/contact.tsx` renders `ContactSection`).
- **[FACT]** Header nav (`src/components/cyryx/Header.tsx:12-17`) exposes only: Company, Products, Solutions, Research + `/start` CTA. `Answers`, `Engagement Model`, `Managed Operations`, `Careers`, `Contact` are **not** in primary nav.
- **[FACT]** Sitemap in `src/routes/sitemap-solutions[.]xml.ts` still lists all 6 live solution pages plus `/managed-operations`, `/engagement-model`, `/start`. `Answers` and `Careers` are **[NV]** in the section sitemap files inspected here.
- **[FACT]** Approved Phase-1 hero copy is locked. This plan does not propose changes to hero copy, media, animation, or CTA destinations.
- **[REC]** Smallest safe next step is Phase 3A: **redirect + content-preservation planning only** — no code execution — followed by an explicit founder go/no-go before any route/nav/sitemap edits.

---

## 2. Current Route Matrix

Columns compressed for readability. All rows: source file under `src/routes/`. "Nav" = present in `Header.tsx` NAV array. "Sitemap" = present in a `sitemap-*.xml.ts` entry list I inspected. Disposition is **[REC]** only.

| URL | Source file | Intent | In nav | In sitemap | Disposition | Reason |
|---|---|---|---|---|---|---|
| `/` | `index.tsx` | Brand + funnel entry | yes (implicit via logo) | **[NV]** | **KEEP** | Homepage. JSON-LD slogan issue tracked §12. |
| `/company` | `company.tsx` | Corporate/about | yes | **[NV]** | **KEEP** | Primary nav destination. |
| `/careers` | `careers.tsx` | Talent capture form | no | **[NV]** | **KEEP + REVIEW** | See §5. |
| `/products` | `products.tsx` | Product hub | yes | **[NV]** | **KEEP** | Hub for MAAX + Lyra. |
| `/products/maax-studio` | `products.maax-studio.tsx` | Flagship product | via hub | **[NV]** | **KEEP** | Referenced by hero CTA `#maax` and solutions cross-links. |
| `/products/lyra` | `products.lyra.tsx` | Second product | via hub | **[NV]** | **KEEP** | Assets `lyra-*` exist. |
| `/solutions` | `solutions.tsx` | Solutions hub + layout | yes | yes | **KEEP** | Renders `<Outlet/>` for children when path ≠ `/solutions`. |
| `/solutions/digital-web-systems` | `solutions.digital-web-systems.tsx` | Web/CRO buyer | via hub | yes | **KEEP** | 272 LOC, unique pricing packages (`PACKAGES` array). |
| `/solutions/ai-websites-lead-systems` | `solutions.ai-websites-lead-systems.tsx` | AI-native web + lead capture | via hub | yes | **KEEP or MERGE (founder)** | Overlaps digital-web-systems on "website"; distinct on "governed AI follow-up". See §3. |
| `/solutions/workflow-automation` | `solutions.workflow-automation.tsx` | Ops automation buyer | via hub | yes | **KEEP** | Distinct intent per copy inspected. |
| `/solutions/internal-ai-assistants` | `solutions.internal-ai-assistants.tsx` | Internal-agent buyer | via hub | yes | **KEEP** | Redirect target of `applied-ai-systems`. |
| `/solutions/custom-ai-product-development` | `solutions.custom-ai-product-development.tsx` | Product-partner engagement | via hub | yes | **KEEP** | Redirect target of `ai-product-engineering`. |
| `/solutions/ai-integrations` | `solutions.ai-integrations.tsx` | CRM/data integration | via hub | yes | **KEEP or MERGE (founder)** | Could fold into workflow-automation or governance depending on strategy. |
| `/solutions/ai-governance-cost-control` | `solutions.ai-governance-cost-control.tsx` | Governance + FinOps | via hub | yes | **KEEP** | Redirect target of `governance-optimization`. |
| `/solutions/ai-product-engineering` | `solutions.ai-product-engineering.tsx` | Redirect stub | no | no | **KEEP (already redirect)** | `→ /solutions/custom-ai-product-development` (`beforeLoad` throw). |
| `/solutions/applied-ai-systems` | `solutions.applied-ai-systems.tsx` | Redirect stub | no | no | **KEEP (already redirect)** | `→ /solutions/internal-ai-assistants`. |
| `/solutions/governance-optimization` | `solutions.governance-optimization.tsx` | Redirect stub | no | no | **KEEP (already redirect)** | `→ /solutions/ai-governance-cost-control`. |
| `/research` | `research.index.tsx` | Applied AI Lab index | yes | **[NV]** | **KEEP** | Publications-driven. |
| `/research/$slug` | `research.$slug.tsx` | Publication detail | dynamic | **[NV]** | **KEEP** | Loader uses `getPublicationBySlug`; slugs = SEO equity. |
| `/answers` | `answers.index.tsx` | Answers hub | no | **[NV]** | **KEEP** | Not linked from primary nav. |
| `/answers/*` (5 pages) | `answers.*.tsx` | Long-tail Q&A SEO | no | **[NV]** | **KEEP** | See §9. |
| `/engagement-model` | `engagement-model.tsx` | How-we-work | no | yes | **KEEP or MERGE** | Candidate for `/how-we-work`. See §7. |
| `/managed-operations` | `managed-operations.tsx` | Managed retainer | no | yes | **KEEP (as solution)** | Distinct commercial product; has ServiceJsonLd. See §7. |
| `/contact` | `contact.tsx` | Marketing contact page | no | **[NV]** | **KEEP or REDIRECT (founder)** | Overlaps `/start`. See §6. |
| `/start` | `start.tsx` | Structured intake form | header CTA | yes | **KEEP** | Primary funnel; header + hero CTAs land here. |
| `/privacy` | `privacy.tsx` | Legal | footer | **[NV]** | **KEEP** | Required. |
| `/terms` | `terms.tsx` | Legal | footer | **[NV]** | **KEEP** | Required. |
| `/unsubscribe` | `unsubscribe.tsx` | Compliance | transactional | **[NV]** | **KEEP** | System route. |
| `/newsletter/confirm` | `newsletter.confirm.tsx` | Double opt-in | transactional | **[NV]** | **KEEP** | System route. |
| `/auth` | `auth.tsx` | Sign-in surface | no | **[NV]** | **KEEP + noindex verify** | See §10. |
| `/_authenticated/*` (10 files) | `_authenticated/*.tsx` | Internal workspace | no | must be excluded | **KEEP INTERNAL** | Gate exists (`_authenticated/route.tsx`). §10 verification pending. |
| `/sitemap*.xml.ts`, `/api/public/*`, `/email/*`, `/lovable/*` | infra | Infra | n/a | n/a | **KEEP INTERNAL** | Not indexable pages. |

---

## 3. Solutions Overlap Matrix

**[FACT]** Six live solution pages + 3 redirect stubs. Redirect stubs are already resolved and require no work.

| Live page | Distinct buyer intent [INFER] | Highest overlap with | Nature of overlap [INFER] |
|---|---|---|---|
| digital-web-systems | Small/mid business needing a credible site + pricing packages | ai-websites-lead-systems | Both promise a website; digital-web-systems owns fixed packages, the other owns AI intake/routing |
| ai-websites-lead-systems | Teams wanting AI-native lead flow behind a site | digital-web-systems, workflow-automation | Split between "the site" and "the lead workflow" |
| workflow-automation | Ops leaders automating multi-step business flows | ai-integrations | Both talk to CRM/support/billing; automation owns end-to-end missions, integrations owns edge reliability |
| internal-ai-assistants | HR/IT/Legal buyers wanting scoped assistants | custom-ai-product-development | Assistants are a productized wedge; product-dev is bespoke |
| custom-ai-product-development | Founders/product units shipping AI products | internal-ai-assistants | Product vs. internal tool distinction |
| ai-integrations | Platform/eng teams hardening AI connectors | workflow-automation, governance | Contracts/observability language overlaps governance |
| ai-governance-cost-control | Risk/finance/AI-leadership | ai-integrations | Governance = policy layer; integrations = wiring layer |

**[REC]** No content should be redirected until unique copy (FAQs, package tables, examples) is migrated. Every live page contains a distinct `FAQ` array and `buildFaqJsonLd` payload — deleting a page without merging its FAQs destroys long-tail SEO surface.

Mapping to the founder's proposed 5 pillars **[REC]**:

| Proposed pillar | Suggested source pages | Action |
|---|---|---|
| Digital & Web Systems | `digital-web-systems` (primary), fold `ai-websites-lead-systems` "AI intake" section in | Merge with content migration |
| Workflow Automation | `workflow-automation` (primary), fold relevant `ai-integrations` reliability content | Merge with content migration |
| Applied AI Systems | `internal-ai-assistants` renamed | Rename + redirect old slug |
| AI Product Engineering | `custom-ai-product-development` renamed | Rename + redirect old slug |
| Governance & Managed Operations | `ai-governance-cost-control` + `/managed-operations` as sibling or embedded | Founder decision required — see §7 |

---

## 4. Product Route Assessment

- **[FACT]** `products.tsx` acts as a hub. `products.maax-studio.tsx` is referenced by hero CTA (`#maax` anchor and homepage) and internal links in `solutions.tsx`. `products.lyra.tsx` has dedicated OG asset `lyra-og-1200x630.jpg.asset.json`.
- **[REC]** Retain all three routes unchanged. No overlap detected between MAAX Studio and Lyra pages **[INFER]**.

---

## 5. Company & Careers Assessment

- **[FACT]** `careers.tsx` renders a form (`FormEvent`, `Dialog`) — behaves as a talent capture, not a jobs board **[INFER]** (specific job listings not observed in the head).
- **[FACT]** `careers` is not in header nav.
- **[NV]** Whether `/careers` is in the section sitemaps or excluded via `robots.txt`.
- **[REC]** Founder decision required: (a) keep as talent network and confirm indexing; (b) move to `/company#careers`. No change proposed here.

---

## 6. Contact & Start Assessment

- **[FACT]** `src/routes/start.tsx:9` imports `submitContact` from `@/lib/contact.functions`.
- **[FACT]** `src/routes/contact.tsx` renders `ContactSection` (`src/components/cyryx/ContactSection.tsx`). Both surfaces submit through the same server function **[INFER — same import likely reused; not opened here]**.
- **[FACT]** `/start` collects `PROJECT_TYPES`, `INVESTMENT_RANGES`, `TIMELINES`, `DECISION` — a full qualification set. `/contact` is a lighter marketing page.
- **[FACT]** Header CTA (`Header.tsx`) points to `/start`. Hero CTA "Start a project" points to `#contact` (`Hero.tsx`), i.e. the ContactSection anchor on the homepage, **not** the `/contact` route.
- **[REC]** Option A: Keep both; make `/contact` a short "how to reach us" page and `/start` the qualified funnel. Option B: 301 `/contact → /start`. Do **not** implement in this phase.
- **Risk** of redirect: existing external links (unverified) and hero CTA anchor `#contact` refers to homepage section, so `/contact` route redirect does not affect hero.

---

## 7. Engagement & Managed Operations Assessment

- **[FACT]** `/engagement-model` documents 6-step process (Diagnose → Operate). No Service JSON-LD; Breadcrumb only.
- **[FACT]** `/managed-operations` has distinct pricing floor ("$2,500/month"), 4 coverage areas, `buildServiceJsonLd({name:"Cyryx Managed Intelligence & Operations"})`.
- **[REC]** Proposed `/how-we-work` = renamed `/engagement-model`. Keep `/managed-operations` as its own solution page (it is a productized retainer, not a methodology). Optionally surface it under a "Governance & Managed Operations" pillar.
- Do not consolidate.

---

## 8. Research Route Assessment

- **[FACT]** `/research` → `research.index.tsx`; `/research/$slug` → dynamic, loader-driven via `getPublicationBySlug` (`src/data/publications.ts`).
- **[FACT]** Slugs are content-owned. Any consolidation must not touch them.
- **[REC]** No changes.

---

## 9. Answers Route Assessment

- **[FACT]** 5 static answer pages + `answers.index.tsx`. Titles include command-gates, execution-vs-automation, goal-grounded generation, governed execution, output quality.
- **[FACT]** Not in header nav.
- **[REC]** Keep. These carry the proprietary-terminology SEO (matches your governance-primitives vocabulary). Consider surfacing "Answers" in footer or under Research. No route change.
- **[REC]** If a founder decides to redirect any solution page, check whether its FAQ content should first migrate here as a new Answers article.

---

## 10. Auth & Workspace Indexing Assessment

- **[FACT]** `src/routes/_authenticated/route.tsx` exists as gate; children: workspace admin/careers/dev/finance/hr/marketing/pipeline/products/index and `workspace.$.tsx` catch-all.
- **[FACT]** None are in `Header.tsx` NAV.
- **[NV]** Presence of `noindex` on `/auth` and `/_authenticated/*`. Test file `workspace-noindex.spec.ts` exists — should be inspected in Phase 3.
- **[NV]** Whether any `sitemap-*.xml.ts` currently includes an authenticated path. Inspected sitemap-solutions does not.
- **[REC]** Verify (do not modify) in Phase 3: `robots.txt`, per-route `meta[name=robots]`, and sitemap exclusion.

---

## 11. Generated Route Tree Diff Assessment

- **[FACT]** `src/routeTree.gen.ts` is regenerated by the TanStack Router Vite plugin on file changes.
- **[FACT]** Phase 1 did not add or rename any route file; only edited `src/copy/v3.ts` and a test. Any diff in `routeTree.gen.ts` is therefore deterministic regeneration triggered by tooling, not a semantic route change **[INFER]**.
- **[REC]** Do not hand-edit. Regeneration will occur naturally on the next build; no action required in this phase.
- Risk: none identified.

---

## 12. JSON-LD Consistency Issue

- **[FACT]** `src/routes/index.tsx:71` — `slogan: "The execution layer for operational AI."`.
- **[FACT]** `tests/accessibility/__snapshots__/jsonld.snapshot.json:9` — same string in snapshot.
- **[FACT]** Approved hero: "The execution layer for enterprise AI."
- **[FACT]** JSON-LD slogan is not user-visible in DOM copy — it is meta for search engines and rich results.
- **[FACT]** It conflicts with the approved hero phrasing for consistency purposes.
- **[REC]** Correct in a dedicated Phase (proposed **Phase 3B — Content Consistency**), with an intentional snapshot update. Not in scope for Phase 2 or IA-only Phase 3.

---

## 13. Proposed Target Sitemap (evaluation only)

Proposed URLs from the brief vs. current source:

| Proposed | Exists today | Notes |
|---|---|---|
| `/solutions/digital-web-systems` | yes | keep |
| `/solutions/workflow-automation` | yes | keep |
| `/solutions/applied-ai-systems` | **redirect stub** → internal-ai-assistants | Would need to promote stub to real page and redirect internal-ai-assistants back, OR keep current naming |
| `/solutions/ai-product-engineering` | **redirect stub** → custom-ai-product-development | Same reversal question |
| `/solutions/governance-managed-operations` | no | Would combine `ai-governance-cost-control` + `managed-operations`; new page + content migration |
| `/how-we-work` | no | Rename of `/engagement-model` |
| `/products`, `/products/maax-studio`, `/products/lyra` | yes | keep |
| `/research`, `/research/[slug]` | yes | keep |
| `/answers`, `/answers/[slug]` | yes (static slugs; not dynamic route yet) | keep |
| `/start`, `/privacy`, `/terms`, `/unsubscribe`, `/auth`, newsletter | yes | keep |

**[REC]** Founder must decide slug direction before any renames. Reversing the current stub direction (making `applied-ai-systems` canonical and redirecting `internal-ai-assistants` back) doubles redirect churn and is not free — search engines have already been served the current canonical for weeks/months **[INFER, no analytics inspected]**.

---

## 14. Proposed Redirect Matrix (evaluation only, DO NOT EXECUTE)

Only redirects that would follow from adopting the proposed IA verbatim:

| Source | Destination | Status | Migration required first |
|---|---|---|---|
| `/solutions/internal-ai-assistants` | `/solutions/applied-ai-systems` | 301 | Rename file; move FAQ + copy; update all internal links; keep old file as redirect stub |
| `/solutions/custom-ai-product-development` | `/solutions/ai-product-engineering` | 301 | Same pattern |
| `/solutions/ai-governance-cost-control` + `/managed-operations` | `/solutions/governance-managed-operations` | 301 (both) | Create new page consolidating both FAQ sets + ServiceJsonLd; migrate managed-ops pricing block |
| `/solutions/ai-integrations` | `/solutions/workflow-automation` (or new pillar) | 301 | Migrate integration FAQs; add "integrations" subsection |
| `/solutions/ai-websites-lead-systems` | `/solutions/digital-web-systems` | 301 | Migrate AI-intake FAQ + "governed follow-up" copy |
| `/engagement-model` | `/how-we-work` | 301 | Rename; no content change needed |
| `/contact` (optional) | `/start` | 301 | Ensure hero `#contact` still targets homepage anchor (it does — see §6) |

Risks: chain risk (existing stubs already redirect to pages we may then redirect again = chain). To avoid loops, update the existing stub `beforeLoad` targets simultaneously.

---

## 15. Proposed Navigation Model (evaluation only)

Desktop primary nav [REC]:

| Label | Destination | Grouping | aria-current | Mobile |
|---|---|---|---|---|
| Company | `/company` | none | on `/company*` | same |
| Products | `/products` (dropdown: MAAX Studio, Lyra) | dropdown | on `/products*` | expanded list |
| Solutions | `/solutions` (dropdown: 5 pillars) | dropdown | on `/solutions*` | expanded list |
| Research | `/research` | none | on `/research*` | same |
| Answers | `/answers` | none, or under Research | on `/answers*` | same |
| Start a Project (CTA) | `/start` | button | n/a | pinned |

- **[FACT]** Current header has no dropdowns. Adding them = new component work; not in this phase.
- **[FACT]** Hero CTA destinations locked: `#contact` and `#maax` (both homepage anchors, not routes). No proposal changes them.

---

## 16. Content Migration Requirements

Before any redirect executes, migrate:

1. `solutions.ai-websites-lead-systems.tsx` — 4 FAQ entries, structured intake copy, CRM integration copy → into destination page.
2. `solutions.ai-integrations.tsx` — 4 FAQ entries (concurrency, iPaaS coexistence, drift) → into destination.
3. `solutions.internal-ai-assistants.tsx` / `custom-ai-product-development.tsx` — full FAQ sets if renamed.
4. `managed-operations.tsx` — pricing floor, coverage areas, ServiceJsonLd `name` field → preserved on destination.
5. `engagement-model.tsx` — 6-step model verbatim if renamed.

**[REC]** Each migration = a dedicated diff with test updates, not a bulk operation.

---

## 17. SEO & UX Risks

- **SEO — canonical churn**: Reversing already-live canonicals (stubs currently point *away* from proposed target slugs) will cost equity while Google reprocesses. Requires 301, updated JSON-LD `url`, updated `<link rel=canonical>`, sitemap update in one atomic release.
- **SEO — thin-content risk**: Consolidating pages without migrating FAQ arrays deletes structured-data richness (`buildFaqJsonLd` payloads).
- **SEO — redirect chains**: 3 stubs already redirect; a second redirect on top creates chains → Google discounts equity, browsers see double 301.
- **UX — nav collision**: Adding dropdowns without visual + a11y spec risks regressing keyboard navigation in `Header.tsx` and `MobileMenu.tsx`.
- **UX — funnel dilution**: Redirecting `/contact → /start` may surprise users who expected a lighter page.
- **Impl — sitemap drift**: 4 sitemap files (`sitemap[.]xml.ts`, `-solutions`, `-products`, `-company`, `-index`) all must stay coherent; missing one leads to Search Console 404 warnings.

---

## 18. Tests That Would Require Updates

**[FACT]** From project listing:
- `tests/accessibility/nav-order.spec.ts` — if NAV items change.
- `tests/accessibility/footer-links.spec.ts` — if `/careers`, `/contact`, `/answers` link surfaces move.
- `tests/accessibility/route-metadata.spec.ts` — if any route's `head()` changes.
- `tests/accessibility/seo-metadata.spec.ts` — same.
- `tests/accessibility/sitemap-coverage.spec.ts` — if any sitemap entry added/removed.
- `tests/accessibility/jsonld-snapshot.spec.ts` + `__snapshots__/jsonld.snapshot.json` — for JSON-LD changes (including §12).
- `tests/accessibility/jsonld-pages.spec.ts` — any per-page JSON-LD builder change.
- `tests/accessibility/legal-solution-a11y.spec.ts` — if solution pages renamed.
- `tests/accessibility/workspace-noindex.spec.ts` — verify still passes; do not touch behavior.
- `tests/accessibility/robots-sitemap.spec.ts` — for sitemap changes.
- `tests/accessibility/copy-validation.spec.ts` — hero lock added in Phase 1; must not be weakened.

---

## 19. Unknowns Requiring Founder Decision

1. Rename direction: keep current canonicals (`internal-ai-assistants`, `custom-ai-product-development`, `ai-governance-cost-control`) or adopt proposed IA slugs and reverse the existing redirects.
2. `/contact` disposition: keep as marketing page or 301 → `/start`.
3. Whether `/answers` should be added to primary nav.
4. Whether `/careers` reflects active hiring today and should stay indexable.
5. Whether "Governance & Managed Operations" is one page or two (governance solution + managed-ops retainer as sibling).
6. Whether `/solutions/ai-integrations` should merge into workflow-automation or governance, or remain independent.
7. Whether `/engagement-model` should be renamed `/how-we-work` and be added to nav or footer.

---

## 20. Smallest Safe Scope for Phase 3 [REC — DO NOT IMPLEMENT]

**Phase 3A — IA Decision Lock (docs only, still read-only for code):**
- Founder answers §19 questions in writing.
- Produce one final redirect matrix + nav model + sitemap diff, still no code.
- Update `.lovable/plan.md` only.

**Phase 3B (only after 3A approval) — smallest reversible code change:**
- Fix the JSON-LD `slogan` in `src/routes/index.tsx:71` and `tests/accessibility/__snapshots__/jsonld.snapshot.json:9` to match the approved hero string. One file + one snapshot, one test to intentionally re-baseline. No route/nav/sitemap changes.

Larger IA moves (renames, merges, dropdown nav) should be scoped as separate later phases, each behind explicit founder approval, so any single change can be reverted independently.

---

PHASE 2 COMPLETE — NO FILES MODIFIED — AWAITING FOUNDER ARCHITECTURE DECISIONS.
