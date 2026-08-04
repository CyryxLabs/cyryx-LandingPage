# Story: Website Excellence — Evidence-Led Architecture, Brand, and Conversion

## Status

InProgress

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@qa"
quality_gate_tools:
  - Playwright
  - axe-core
  - Lighthouse
  - CodeRabbit
```

## Story

**As a** prospective Cyryx Labs client, product user, researcher, or partner,
**I want** the public website to explain Cyryx's operating model, offers, products, research, and intake paths with a coherent premium experience and evidence-bounded claims,
**so that** I can understand what Cyryx actually does, assess fit, and submit the right request without ambiguity, privacy surprises, accessibility barriers, or unsupported promises.

## Context and Goal

This story turns the multidisciplinary audit of production `origin/main` at commit `7ca39e4`, the public site, the CGP/DOI review, and the official moodboard into one implementation-ready delivery slice. The goal is a trustworthy, high-quality site: the business architecture is clear, conversion paths collect useful and proportionate information, research claims distinguish publication from implementation or certification, and the visual system feels recognizably Cyryx without sacrificing usability.

### Audit Requirements Traceability

| ID  | Audited requirement carried into this story                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Make the canonical lifecycle explicit: **Advise → Build → Control → Operate**, with **Products + Applied Research** as transversal assets/capabilities.                                                                   |
| F2  | In Solutions, replace “owned operating system” with **“owned operating capability”** and reduce the oversized hero.                                                                                                       |
| F3  | Make `/start` a real fit review: require project type and outcome, add why-now/trigger, carry CTA context via query parameters, remove invented SLA language, and warn users not to submit credentials or sensitive data. |
| F4  | Align Privacy with the fields and technical metadata actually collected.                                                                                                                                                  |
| F5  | Consolidate MAAX in its own flow and qualify early access with company, role, use case, and constraint; make telephone optional; use an additive migration and expose the new information in admin.                       |
| F6  | Qualify CGP v1.0 claims by separating the published abstract/record from current implementation status and from certification or conformance.                                                                             |
| F7  | Add security headers only where the deployed architecture can safely and verifiably apply them.                                                                                                                           |
| F8  | Preserve evidenced language, the official moodboard direction, accessibility, and established UX behavior.                                                                                                                |
| F9  | Pass the repository's lint, typecheck, unit, accessibility, cross-browser, build, and forbidden-term gates.                                                                                                               |
| F10 | Do not deploy, commit, push, rewrite published history, or open/merge a PR as part of this implementation task.                                                                                                           |

### Autonomous Decisions

- `[AUTO-DECISION] No epic or prior story exists in this production-derived worktree → treat F1–F10 above as the approved requirement source and use this date-based story ID.`
- `[AUTO-DECISION] accumulated-context.md is absent → preserve cross-story coherence against commit 7ca39e4 and its known Safari/WebKit route-scroll behavior; do not regress that contract.`
- `[AUTO-DECISION] The moodboard is art direction, not product evidence → use its locked brand system, but never use a rendered mockup, decorative metric, or interface fragment as proof of shipped capability.`
- `[AUTO-DECISION] ClickUp sync is omitted → this mission authorizes the local story only and provides no ClickUp epic/task identifiers.`

## Evidence Boundary

1. A material claim is publishable only when it traces to one of: current repository behavior verified by tests, an approved Cyryx source artifact, or a resolvable primary external record that supports the exact wording.
2. “Published,” “implemented,” “production-ready,” “conformant,” and “certified” are separate states. One must never imply another.
3. Products, solutions, research, and client work use different taxonomies:
   - **Product:** Cyryx-owned software, with explicit maturity/status.
   - **Solution:** a repeatable engagement/capability, not a product or an operating system owned by the client.
   - **Client work / case study:** shown only with approved evidence and disclosure permission; otherwise omitted.
   - **Applied Research:** a publication, protocol, evaluation, or research direction with its record/status stated precisely.
4. No customer logos, testimonials, usage numbers, performance outcomes, certifications, compliance guarantees, maturity claims, or release dates may be invented.
5. The moodboard's mock interfaces and product/environment imagery are conceptual. They do not substantiate MAAX features, CGP implementation, customer adoption, performance, autonomy, or cost reduction.
6. Visible copy, metadata, JSON-LD, sitemap content, and `public/llms.txt` must tell the same evidence-bounded story.

## Acceptance Criteria

### AC1 — Source integrity and claim governance

1. All changed material claims are inventoried during implementation with their source and state (`verified`, `qualified`, or `withheld`).
2. Unsupported claims are removed or rewritten conservatively; no placeholder proof, fictional portfolio item, fabricated metric, customer identity, certification, DOI, or guarantee remains.
3. Page copy, metadata, JSON-LD, and `public/llms.txt` do not contradict each other about Cyryx, MAAX Studio, the operating model, or research maturity.
4. External claims retain direct primary-source links and attribution when used. A broken or unverified record fails closed: the site does not present it as confirmed.
5. Existing forbidden-term validation remains green and is extended when a newly identified high-risk phrase can be mechanically guarded.

### AC2 — Canonical business architecture and portfolio taxonomy

1. The home/overview narrative clearly presents **Advise → Build → Control → Operate** as the canonical lifecycle.
2. **Products** and **Applied Research** are presented as transversal assets/capabilities that inform the lifecycle, not as extra lifecycle phases or interchangeable services.
3. Navigation and key overview pages use one coherent taxonomy for Products, Solutions, Research, Company, and Start a Project; duplicate or contradictory labels are removed.
4. MAAX Studio is labeled with its evidenced maturity. Solutions are described as capabilities/engagements. Research uses publication/status language. No unevidenced “portfolio” or case-study content is added.
5. `/solutions` uses the exact phrase **“owned operating capability”** in place of “owned operating system.”

### AC3 — Solutions hero and brand hierarchy

1. The `/solutions` hero typography and spacing are reduced from the audited oversized state while preserving a clear H1 and premium hierarchy.
2. At 390×844 and 1440×900, the H1, supporting copy, and primary action render without clipping or horizontal overflow, and the primary action is reachable without a layout trap.
3. Visual-regression coverage records the intentional change; unrelated page compositions do not drift.

### AC4 — `/start` becomes an actual fit review

1. `projectType`, desired `outcome`, and a clear **why now / triggering event** are required in both client and server validation.
2. CTA entry context is carried through a documented, allowlisted query contract and is reflected safely in the fit-review context/payload; arbitrary HTML, scripts, secrets, or unbounded values are not trusted or rendered.
3. Direct and contextual CTAs converge on `/start` without silently losing their origin or user intent.
4. The form explicitly warns: **do not submit passwords, API keys, credentials, regulated data, or other sensitive information**.
5. Copy makes no response-time or delivery SLA promise unless a currently approved source supports it; “typically reply within 24h” and equivalents are removed or qualified.
6. Required fields, inline errors, submit state, success state, retry behavior, focus movement, consent, keyboard operation, and screen-reader announcements are accessible.
7. Client validation and server validation agree. Honeypot/rate limiting, consent version, attribution, and safe error handling remain functional.
8. A non-destructive integration/smoke test proves an accepted fit review reaches the configured persistence boundary; a backend failure cannot be reported as success.

### AC5 — Privacy and form data integrity

1. `/privacy` is reconciled against the implemented data-flow inventory for `/start`, MAAX early access, contact channels, newsletter/analytics where applicable, and server-collected metadata.
2. The policy and consent copy accurately describe collected field categories, purpose, legal basis/consent, retention, deletion/withdrawal path, recipients/processors, attribution data, IP/user-agent hashing, and cookies/telemetry actually in use—without adding unsupported legal or operational claims.
3. Fields removed or made optional are reflected consistently in UI, schemas, RPCs/migrations, generated types, admin, tests, and Privacy.
4. Consent is unchecked by default, required where relied upon, versioned, persisted, linked to Privacy, and independently withdrawable.
5. Form payloads and logs do not expose credentials, raw secrets, or unnecessary personal data.

### AC6 — Dedicated, qualified MAAX early-access funnel

1. MAAX early access remains a dedicated flow associated with `/products/maax-studio`; generic project/contact paths do not masquerade as product access.
2. The funnel requires full name, work email, company, role, use case, constraint, and explicit consent. Telephone is optional. Any other retained field must have a documented purpose and match Privacy.
3. Client schema, server route, RPC contract, persistence, generated Supabase types, and admin view agree on required/optional semantics and length bounds.
4. Database evolution is additive and non-destructive: existing waitlist rows and statuses remain valid; new columns are nullable or safely backfilled; no table recreation or historical-data loss occurs.
5. RLS remains enabled, public direct table writes remain revoked, the narrow submission RPC validates input and rate limits abuse, and admin access remains role-gated.
6. The authenticated admin surface displays the new qualification fields and preserves the existing status workflow.
7. Unit and Playwright tests cover valid qualification, optional telephone, missing required fields, invalid values, consent, honeypot, server error, accessible modal behavior, and admin data visibility at the appropriate test layer.

### AC7 — CGP v1.0 claims are precisely qualified

1. The site distinguishes at least these concepts in data and rendered copy: publication record/abstract, current implementation evidence, protocol conformance, and third-party certification.
2. A valid published abstract and bibliographic metadata may be reproduced accurately, but the abstract is not presented as independent proof that every control is currently implemented in MAAX Studio.
3. Wording such as “every control has a reference implementation,” current conformance, framework equivalence, or certification is removed or qualified unless the implementation supplies current, reviewable evidence for that exact statement.
4. CGP levels are described as protocol-defined requirements, not certificates or independent compliance determinations.
5. DOI/record/source links and identifiers are rendered only when current verification succeeds; link failure or uncertain status produces a neutral unavailable/qualified state rather than a false confirmed state.
6. Research tests validate claim semantics and evidence states, not merely hard-coded identifiers.

### AC8 — Official moodboard and visual system

1. The implementation follows the official moodboard foundation: Onyx `#050607`, Obsidian `#0A0D0F`, Graphite `#11161A`, Gunmetal `#1B2227`, Steel `#8C949E`, Silver `#C7C9CC`, Core Teal `#0F6B68`, and Teal Glow `#19C7C0`.
2. The visual hierarchy approximates 70/20/8/2 dark foundation / dark structure / silver hierarchy / teal signal. Teal is an activation/focus signal, not a large surface treatment.
3. Only approved Cyryx monolith/wordmark assets are used. No C-hexagon, invented logo, generic AI brain, robot mascot, stock-business imagery, blue/purple SaaS gradient, crypto, gaming, or excessive cyberpunk treatment is introduced.
4. The visual language remains premium, controlled, technical, product-led, and human-governed, using restrained command grids, black glass/metal cues, and generous negative space where helpful.
5. Moodboard renders are not shipped as authoritative logo artwork or as proof screenshots. Existing optimized site assets remain subject to performance budgets.

### AC9 — UX, accessibility, and regression safety

1. Changed public pages meet WCAG 2.1 AA expectations for semantic structure, landmarks, heading order, contrast, labels, error association, keyboard navigation, visible focus, target sizes, and accessible names.
2. Reduced-motion behavior avoids forced animation and preserves complete content/functionality.
3. Layouts are usable from 320px mobile through desktop without horizontal overflow; desktop, Chromium mobile, Android, iPhone, Firefox, and WebKit coverage remains green.
4. The prior Safari/WebKit contract is preserved: fresh route navigation starts at the top, Back restores prior position, and the mobile body scroll lock is released before navigation.
5. Hero media retains a stable poster/reduced-motion fallback and does not regress LCP, CLS, or readability.
6. Internal links, canonical metadata, sitemap coverage, structured data, and noindex rules remain valid.

### AC10 — Security headers at a real architectural boundary

1. The implementation first identifies which configuration is actually consumed by the active production/preview runtime. Headers are not added only to a dead or host-specific file.
2. Safe baseline headers are applied at that real boundary and verified from an HTTP response. CSP, if introduced or tightened, is compatible with TanStack Start SSR, local assets/media, Supabase requests, and required external publication links without unsafe broadening.
3. HSTS is enabled only for an HTTPS production boundary with confirmed domain ownership; `includeSubDomains`/preload are not asserted without explicit evidence that every subdomain is ready.
4. Header changes do not break forms, hydration, video, analytics actually in use, external research navigation, or previews.

### AC11 — Required quality gates

All of the following complete successfully from a clean install-compatible checkout, with no ignored new failures:

```bash
bun run lint
bun run typecheck
bun run test:unit
bun run test:a11y
bun run test:cross-browser
bun run build
bun run quality:validate-terms
```

Additionally:

1. Focused tests cover each changed contract in AC1–AC10.
2. Lighthouse mobile and desktop checks are run when available; accessibility/SEO remain at repository thresholds, CLS remains ≤ 0.1, and material performance regressions are documented and corrected before handoff.
3. Generated snapshots/types are updated only when source changes intentionally require them, and their diffs are reviewed.
4. CodeRabbit reports no unresolved CRITICAL issue; HIGH issues are fixed or explicitly handed to QA under the configured policy.

## Exclusions

- No deployment, DNS change, Vercel/Lovable cutover, commit, push, PR creation/merge, release, or published-history rewrite.
- No fabricated case studies, customer names/logos, testimonials, business metrics, certifications, guarantees, publication identifiers, or product maturity.
- No MAAX Studio product implementation beyond the public website funnel, truthful status copy, persistence contract, and admin qualification view.
- No rebrand, replacement logo, general merchandise/environment production, or direct reuse of moodboard mockups as production artwork.
- No destructive database migration, broadening of anonymous table access, exposure of a service-role key, or unrelated workspace/admin refactor.
- No new analytics, advertising cookies, marketing automation, or third-party tracker unless separately approved and reflected in Privacy/consent.
- No broad rewrite of unaffected routes; preserve existing SEO, navigation, accessibility, and Safari fixes unless a listed AC requires a scoped change.

## Tasks / Subtasks

- [x] 1. Establish the evidence and taxonomy baseline (AC1, AC2, AC7)
  - [x] Inventory material public claims and label each verified, qualified, or withheld.
  - [x] Map current page/navigation content to Advise → Build → Control → Operate plus transversal Products + Applied Research.
  - [x] Define the Product / Solution / Client Work / Research content schema and maturity labels in the existing content architecture.
  - [x] Reconcile visible copy, head metadata, JSON-LD, sitemap-facing copy, and `llms.txt`.
- [x] 2. Implement the canonical site narrative and Solutions correction (AC2, AC3, AC8)
  - [x] Update overview/navigation content without introducing new unsupported offers.
  - [x] Replace “owned operating system” with “owned operating capability.”
  - [x] Reduce `/solutions` hero scale/spacing and add responsive visual coverage.
- [x] 3. Upgrade `/start` into a fit review (AC4, AC5)
  - [x] Add required project type, outcome, and why-now/trigger across UI and server schema.
  - [x] Implement an allowlisted CTA query-context contract and persistence mapping.
  - [x] Add the sensitive-data warning and remove unsupported response-time promises.
  - [x] Verify accessible validation, consent, anti-abuse behavior, success/failure truthfulness, and persistence.
- [x] 4. Reconcile Privacy with actual processing (AC5)
  - [x] Produce a field/data-flow inventory for fit review, MAAX, attribution, hashes, and telemetry.
  - [x] Update policy and consent wording to match the inventory and tests.
- [x] 5. Qualify the MAAX early-access funnel end to end (AC5, AC6)
  - [x] Add company, role, use case, and constraint; make telephone optional.
  - [x] Update shared schema, UI, API/RPC payload, consent version where copy/purpose changes, and error handling.
  - [x] Add a forward-only additive migration and regenerate types.
  - [x] Update the role-gated admin view with the qualification fields.
  - [x] Add unit, E2E, persistence-contract, and admin-visibility coverage.
- [x] 6. Separate CGP publication, implementation, conformance, and certification (AC1, AC7)
  - [x] Refactor publication data/copy so each evidence state is explicit.
  - [x] Qualify or withhold implementation/conformance claims without current evidence.
  - [x] Update research pages, metadata, citations, and semantic tests.
- [x] 7. Apply the moodboard with restraint and accessibility (AC3, AC8, AC9)
  - [x] Align tokens, typography, spacing, surfaces, focus states, and approved brand assets.
  - [x] Preserve reduced motion, hero fallbacks, contrast, keyboard behavior, and Safari scroll restoration.
  - [x] Review responsive and visual-regression output before accepting baselines.
- [x] 8. Apply security headers only at the active runtime boundary (AC10)
  - [x] Confirm the consumed host/runtime configuration.
  - [x] Add the safe header policy and response-level tests without breaking required origins/features.
- [ ] 9. Complete quality verification and story bookkeeping (AC11)
  - [ ] Run focused tests followed by every required repository gate.
  - [ ] Run available Lighthouse checks and review accessibility/SEO/performance evidence.
  - [ ] Run CodeRabbit and resolve blocking findings.
  - [x] Update this checklist, Dev Agent Record, Completion Notes, and final File List with actual changes.

## Dev Notes

### Authoritative Sources

- Audit handoff dated 2026-08-03, embedded as F1–F10 above.
- Production-derived implementation baseline: `origin/main` commit `7ca39e4`.
- Official moodboard: `C:/Users/ppetr/OneDrive/Desktop/Cyryx Labs/Brandboard/Cyryx_Labs_Complete_Moodboard_v1/README.md`, especially “Locked visual foundation,” “Approved palette,” and “Production handoff notes.”
- Existing architecture and contracts: `src/lib/navigation.ts`, `src/routes/start.tsx`, `src/routes/privacy.tsx`, `src/data/publications.ts`, `src/lib/maax-waitlist.schema.ts`, public API routes, migrations, and tests listed below.
- Quality commands and thresholds: `package.json` and repository Lighthouse configuration.

### Technical Context

- Stack: TanStack Start/Router, React 19, TypeScript, Vite, Tailwind CSS, Supabase, Zod, GSAP, Playwright, axe-core, and Lighthouse.
- Public forms already use narrow Supabase RPC boundaries. Preserve RLS and the no-direct-anonymous-table-write model.
- `public/_headers` currently contains cache policy only; do not assume it is consumed by every deployment target.
- `src/routeTree.gen.ts` is generated. Do not edit it manually.
- Existing Safari/WebKit tests encode the merged navigation fix at `7ca39e4`; treat them as a regression contract.
- Environment variables remain the existing Supabase server/client variables. Do not add or expose credentials merely to complete this story; document any genuinely required new variable before use.

## Testing

### Focused coverage to add/update

- Copy/taxonomy and forbidden-claim tests for lifecycle, “owned operating capability,” product maturity, and CGP evidence states.
- `/start` unit/E2E coverage for required project type/outcome/why-now, allowlisted query context, sensitive-data warning, consent, accessible errors, safe server failure, and persistence contract.
- MAAX schema/API/E2E coverage for new qualification fields, optional telephone, additive migration behavior, RLS/RPC boundary, and admin visibility.
- Privacy-to-form field consistency checks.
- Security-header response assertions at the consumed runtime boundary.
- Responsive/visual, reduced-motion, keyboard, axe, SEO/JSON-LD, sitemap, and Safari/WebKit regression coverage.

### Full gate commands

```bash
bun run lint
bun run typecheck
bun run test:unit
bun run test:a11y
bun run test:cross-browser
bun run build
bun run quality:validate-terms
```

## CodeRabbit Integration

**Primary Type:** Frontend
**Secondary Types:** Security, Database, Integration
**Complexity:** High — cross-route copy architecture, two public form contracts, additive persistence changes, research claims, security headers, SEO, and broad regression risk.

**Primary Agents:**

- `@dev` — implementation and pre-commit review.
- `@ux-design-expert` — moodboard fidelity, responsive hierarchy, accessibility.
- `@data-engineer` — additive MAAX migration, RPC/RLS/type review.

**Supporting Agents:**

- `@qa` — full functional, accessibility, cross-browser, and evidence-boundary verdict.
- `@architect` — canonical taxonomy, CGP boundary, and security-header placement.
- `@devops` — pre-PR checks only if the lead later authorizes remote operations.

**Quality Gates:**

- [ ] Pre-Commit (`@dev`): CodeRabbit uncommitted review plus AC11 commands.
- [ ] QA (`@qa`): full mode, up to 3 self-healing iterations/30 minutes for CRITICAL and HIGH findings.
- [ ] Pre-PR (`@devops`): committed diff review against `main`, only after separate authorization.
- [ ] Pre-Deployment (`@devops`): out of this story; required before any separately authorized production release.

**Self-Healing:**

- Primary agent mode: light.
- Max iterations: 2.
- Timeout: 15 minutes.
- CRITICAL: auto-fix within story scope.
- HIGH: document and hand to QA unless safely fixable in scope.
- MEDIUM: record as debt when not required by an AC.
- LOW: non-blocking.

**Focus Areas:** evidence-safe copy, client/server schema parity, privacy consistency, RLS/RPC safety, no secret exposure, WCAG 2.1 AA, responsive/Safari behavior, metadata parity, performance, and reversible additive migration.

## Initial File List

The developer must replace this anticipated list with the exact final list. Files marked “if required” are not authorization for unrelated edits.

### Story artifact

- `docs/stories/website-excellence-2026-08-03.md` (created)

### Expected content, navigation, and presentation

- `src/routes/index.tsx`
- `src/routes/solutions.tsx`
- `src/lib/navigation.ts`
- `src/lib/cta.ts`
- `src/copy/v3.ts`
- `src/components/cyryx/Hero.tsx` (only if homepage hierarchy/content requires it)
- `src/styles.css`
- `public/llms.txt`
- Relevant SEO/JSON-LD snapshots and route tests

### Fit review and privacy

- `src/routes/start.tsx`
- `src/lib/contact.schema.ts`
- `src/lib/contact.functions.ts`
- `src/routes/api/public/contact.ts` (if the canonical flow uses this endpoint)
- `src/routes/contact.tsx`
- `src/routes/privacy.tsx`
- `tests/accessibility/contact-consent.spec.ts`
- `tests/cross-browser/compatibility.spec.ts`

### MAAX early access and admin

- `src/components/cyryx/maax/MaaxWaitlistForm.tsx`
- `src/components/cyryx/maax/MaaxWaitlistDialog.tsx` (if required)
- `src/lib/maax-waitlist.schema.ts`
- `src/routes/api/public/maax-waitlist.ts`
- `src/routes/_authenticated/workspace.marketing.tsx`
- `src/integrations/supabase/types.ts` (generated)
- `supabase/migrations/<new_timestamp>_qualify_maax_waitlist.sql` (new, additive)
- `tests/maax-waitlist.test.ts`
- `tests/accessibility/maax-waitlist.spec.ts`

### Research and claim integrity

- `src/data/publications.ts`
- `src/routes/research.index.tsx`
- `src/routes/research.$slug.tsx`
- `src/components/cyryx/v4/ResearchBand.tsx`
- `.quality/forbidden-terms.json` (only for justified mechanical guards)
- `tests/accessibility/research-citation.spec.ts`
- `tests/accessibility/content-guardrails.spec.ts`
- `tests/accessibility/seo-metadata.spec.ts`
- `tests/accessibility/jsonld-snapshot.spec.ts` and snapshot (if intentionally changed)

### Security and quality

- `public/_headers` or the actual runtime header configuration after consumption is proven
- Focused new/updated tests under `tests/accessibility/`, `tests/cross-browser/`, and `tests/`
- `package.json` only if a missing test aggregator is deliberately added; do not change dependencies without need

## Story Draft Checklist Validation

| Category                          | Status | Evidence                                                                                                            |
| --------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| Goal & Context Clarity            | PASS   | User value, audit findings, evidence boundary, scope, and exclusions are explicit.                                  |
| Technical Implementation Guidance | PASS   | Stack, affected contracts, security/data constraints, tasks, and anticipated files are identified.                  |
| Reference Effectiveness           | PASS   | Critical findings are embedded; source paths explain their relevance. The absent accumulated context is documented. |
| Self-Containment                  | PASS   | Terms, taxonomies, evidence states, edge cases, and fail-closed behavior are defined in the story.                  |
| Testing Guidance                  | PASS   | Focused scenarios, cross-browser/a11y requirements, and exact repository gates are specified.                       |
| CodeRabbit Integration            | PASS   | Story type, agents, gates, self-healing, and focus areas are complete.                                              |

**Final assessment:** READY. A developer can implement this story without inventing requirements. Any newly discovered claim source, legal assertion, deployment boundary, or destructive schema need must be escalated rather than assumed.

## Change Log

| Date       | Version | Description                                                                          | Author          |
| ---------- | ------- | ------------------------------------------------------------------------------------ | --------------- |
| 2026-08-03 | 1.0     | Created implementation-ready story from the completed audit and official moodboard.  | Chronos (`@sm`) |
| 2026-08-03 | 1.1.0   | Development started (yolo mode) — Status: Ready → InProgress.                        | Vulcan (`@dev`) |
| 2026-08-03 | 1.2.0   | Implementation handoff with focused checks green and explicit QA rerun items.        | Vulcan (`@dev`) |
| 2026-08-03 | 1.3.0   | QA gate FAIL; returned to InProgress for mandatory gate and persistence evidence.    | Argus (`@qa`)   |
| 2026-08-03 | 1.4.0   | QA re-review: site/browser evidence cleared; FAIL retained for two release gates.    | Argus (`@qa`)   |
| 2026-08-03 | 1.5.0   | Refined the homepage storytelling, hierarchy, and evidence-led decision flow.        | Vulcan (`@dev`) |
| 2026-08-03 | 1.6.0   | Added fail-safe fit-review notification and sender-confirmation email queueing.      | Vulcan (`@dev`) |
| 2026-08-04 | 1.7.0   | Applied the approved Structural Aperture hero system across internal page families.  | Vulcan (`@dev`) |
| 2026-08-04 | 1.8.0   | Excluded generated Vercel output and captured the definitive full-lint baseline.     | Vulcan (`@dev`) |
| 2026-08-04 | 1.9.0   | Reviewed and updated the intentional solution-page visual baseline.                  | Vulcan (`@dev`) |
| 2026-08-04 | 2.0.0   | Superseded the first visual PASS after the user rejected its Option 3 fidelity.      | Vulcan (`@dev`) |
| 2026-08-04 | 2.1.0   | Restored the approved serif, aperture, rail, outline CTA, and compact Solutions fit. | Vulcan (`@dev`) |
| 2026-08-04 | 2.2.0   | Regenerated and re-ran the approved solution-page visual baseline.                   | Vulcan (`@dev`) |

## Dev Agent Record

### Agent Model Used

GPT-5.6

### Debug Log References

- IDS `SEARCH → ADAPT`: taxonomy/copy/navigation — `.quality/forbidden-terms.json`, `public/llms.txt`, `src/copy/v3.ts`, `src/data/publications.ts`, `src/data/site-taxonomy.ts`, `src/lib/navigation.ts`, `src/components/cyryx/Hero.tsx`, `src/components/cyryx/MAAXStudioSpotlight.tsx`, `src/components/cyryx/ProductEcosystem.tsx`, `src/components/cyryx/StickyMobileCTA.tsx`, `src/components/cyryx/seo/seo.ts`, `src/components/cyryx/v4/CompactStart.tsx`, `src/components/cyryx/v4/OperatingModel.tsx`, and the overview/product/company/research/solution routes in the Final File List. Shared data was adapted or created only after searching existing page constants and content registries.
- IDS `SEARCH → ADAPT`: intake/privacy — `src/lib/contact.functions.ts`, `src/lib/contact.schema.ts`, `src/lib/cta.ts`, `src/lib/track-cta.ts`, `src/routes/api/public/contact.ts`, `src/routes/contact.tsx`, `src/routes/privacy.tsx`, and `src/routes/start.tsx`. Existing RPC, attribution, consent, and anti-abuse contracts were reused.
- IDS `SEARCH → ADAPT`: MAAX — existing schema, modal/form, API route, admin surface, generated types, and prior RPC/RLS migrations were adapted; `supabase/migrations/20260803180000_qualify_maax_waitlist.sql` was created additively after that search.
- IDS `SEARCH → ADAPT`: runtime policy — `src/server.ts` was confirmed as the consumed TanStack/Nitro fetch boundary before headers were added; `public/_headers` was not treated as authoritative. `src/styles.css` reused the locked palette and added an explicit Gunmetal alias.
- IDS `SEARCH → ADAPT/CREATE`: existing Playwright and Bun patterns were adapted across every test in the Final File List; `tests/site-contracts.test.ts`, `tests/maax-waitlist-contract.test.ts`, `tests/accessibility/security-headers.spec.ts`, and the shared Playwright readiness helpers were created because no equivalent focused contracts existed.
- IDS `SEARCH → ADAPT`: homepage storytelling reused the existing canonical taxonomy, chapter system, controlled-execution components, evidence artifacts, MAAX product section, and CTA conventions. The implementation tightened the arc to opportunity → gap → controlled action → entry points → control/product → evidence → decision, shortened rather than expanded the hero, made the MAAX action tertiary, labeled its image as conceptual product direction, and removed the redundant four-outcome block instead of creating additional cards or media.
- IDS `SEARCH → ADAPT/CREATE`: fit-review email delivery reused the existing server-only React Email registry, service-role Supabase client, suppression checks, send log, transactional queue RPC, and idempotency contract. Dedicated internal and sender templates plus a small orchestration helper were created because `/start` had no equivalent notifications; database persistence remains authoritative and email failures are isolated from the accepted lead.
- Responsive storytelling evidence: desktop browser review found no horizontal overflow or console errors; the final focused storytelling command passed 41/41, comprising 39 copy/contrast/mobile-360 checks plus 2 Safari-mobile layout/start checks. This supports Task 7 while leaving Task 9 open for the repository-wide lint and real persistence blockers.
- Self-critique evidence: `plan/self-critique-website-excellence.json` records Step 5.5 predictions, Step 6.5 fixes, and remaining QA risks.
- Figma decision/audit board reference: <https://www.figma.com/design/Yvc1sj5JQDQNg5XacpksOs?node-id=4-3>. This is a production-homepage capture and executive recommendation board, not production artwork, a code dependency, or evidence of shipped capability.
- IDS `SEARCH → ADAPT/CREATE`: the existing internal-page hero patterns, brand tokens, CTA tracking, TanStack links, and solution-page wrapper were reviewed before creating `InternalHero.tsx`. The first implementation over-adapted Option 3 and was correctly rejected by the user. The corrected implementation now treats the approved composition as the contract: a Cormorant Garamond H1-only exception, visible responsive Structural Aperture asset, restrained gunmetal/teal field, outlined primary CTA, vertical lifecycle rail, and evidence-safe page copy. `/solutions` alone uses a compact title scale to accommodate its longer sentence. Corrective comparison and production-style browser evidence are recorded in `design-qa.md`.
- Quality-gate diagnosis: `eslint.config.js` already ignored `.output` but not the generated `.vercel` build tree. Adding that generated-artifact boundary reduced the exact `npm run lint` execution from a five-minute timeout to a definitive 46.9-second result. The gate now reports 3,194 existing repository problems (3,167 errors and 27 warnings), predominantly Prettier debt in scripts, legacy routes, and tests; focused ESLint over the Structural Aperture change set remains green.

### Completion Notes List

- The homepage now follows a deliberate narrative arc: opportunity → execution gap → controlled action → the right entry point → control and product context → reviewable evidence → the next decision.
- Advise, Build, Control, and Operate are explicit focused entry points that can be engaged individually or connected as a larger program. Products and Applied Research remain distinct from client delivery while informing the work.
- The hero was shortened, the MAAX CTA was made tertiary, its image is explicitly framed as conceptual product direction, and a redundant four-outcome block was removed to improve mobile pacing without adding unsupported proof, cards, or decorative media.
- `/solutions` uses the exact audited phrase, qualifies “owned,” exposes four need-led buyer triggers, and carries allowlisted buyer intent into `/start`.
- `/start` now uses shared client/server qualification, required outcome/why-now context, accessible errors, sensitive-data warning, truth-preserving persistence handling, and no response SLA.
- After a fit review is persisted, the API independently queues an internal notification to `contact@cyryxlabs.com` and a receipt-only confirmation to the sender. The UI mentions confirmation only when that queue operation succeeds; it does not claim acceptance, scope, timing, availability, commercial terms, or actual inbox delivery. Local live delivery was not exercised because `SUPABASE_SERVICE_ROLE_KEY` is absent, so deployed delivery still requires the configured queue processor/provider boundary.
- MAAX now has a dedicated review-based qualification funnel and v2 narrow RPC contract. Telephone is optional; company, role, use case, operating constraint, country, and consent are required. The public RPC accepts only the exact published consent contract `maax-waitlist-v2-2026-08-03`, fails closed on non-`{ ok: true }` results, and preserves reviewed statuses while allowing explicit resubscription. The migration was not applied to a connected database in this task.
- CGP rendering separates a verified publication record from qualified implementation/conformance and withheld certification; edited website prose is labeled as a website summary, not the published abstract.
- Privacy now inventories implemented fields, hashes, CTA telemetry, discarded Web Vitals, purposes, withdrawal, and provider categories without unsupported fixed retention, transfer-mechanism, processor, or security claims.
- Runtime responses set `nosniff`, strict-origin referrer policy, a bounded permissions policy, and frame denial. HSTS is exact-host HTTPS-only (`cyryxlabs.com`/`www.cyryxlabs.com`) with no `includeSubDomains` or preload. Dynamic fallback caching is `private, no-store`; successful hashed assets remain immutable.
- The old “The execution layer for enterprise AI” Footer/schema slogan was retired in favor of the canonical “From AI opportunity to operating capability” line. Controlled execution remains a section-level thesis. CSP was not introduced because compatible allowed origins were not fully evidenced.
- Green before tree freeze: changed-owned-files Prettier check; focused changed-file ESLint; `bun run typecheck`; `bun run test:unit` (34/34 before the final exact-consent contract assertion); focused MAAX unit/contract tests after that assertion (13/13); `bun run quality:validate-terms` (14 rules); and `bun run build`.
- Repository-wide `npm run lint` now completes after `.vercel` generated output was excluded, but remains blocked by 3,194 baseline problems (3,167 errors and 27 warnings) across unrelated scripts, legacy routes, and tests. The Structural Aperture files pass focused ESLint; bulk-formatting unrelated files was intentionally not performed.
- The Vite/TanStack virtual client-entry race is handled by a shared Playwright global setup that warms the resolved client environment before browser workers begin; interactive tests also wait for the root hydration signal before acting on SSR controls. Full accessibility, cross-browser, visual-regression, and Lighthouse evidence is green in QA; the final focused storytelling command additionally passed 41/41 (39 copy/contrast/mobile-360 checks and 2 Safari-mobile layout/start checks) with no browser-console errors. Task 9 remains open because repository-wide lint completes with the documented 3,194 baseline findings and the migration/persistence boundary was not executed against a real Supabase target.
- Internal overview, solution, managed-operations, engagement, product, research, company, career, and shared solution-detail pages now use one responsive Structural Aperture hero system. After the initial implementation failed the user's approved-reference fidelity check, the Company hero was corrected to the exact four-line editorial headline, governed Cormorant display face, visible aperture, outline CTA, and narrow vertical operating rail. `/solutions` received the compact title-scale variant and now fits in five lines at 1280 × 720. The production-style local build returned HTTP 200 and hydrated on `/company`, `/solutions`, and the contextual `/start` route; CTA navigation, form rendering, 390 × 844 mobile layout, menu body lock, and no-horizontal-overflow behavior were exercised. The corrected visual/runtime gate passed; the broader release blockers above remain unchanged.
- The intentional `solution-workflow-automation` Windows desktop visual baseline was reviewed and regenerated again after the approved Option 3 fidelity correction; the focused snapshot passed on the clean rerun. The current production-style Node preview on port 4177 returned HTTP 200 and hydrated on `/company`, `/solutions`, and the contextual `/start` route; CTAs carried the expected context and the browser journeys were clean. The earlier Vercel Preview remains a historical pre-correction artifact, and production aliases were not changed.

### Final File List

- `.quality/forbidden-terms.json`
- `design-qa.md` (created)
- `docs/stories/website-excellence-2026-08-03.md` (created)
- `docs/website-claim-inventory-2026-08-03.md` (created)
- `eslint.config.js`
- `package.json`
- `plan/self-critique-website-excellence.json` (created)
- `playwright.config.ts`
- `playwright.cross-browser.config.ts`
- `public/llms.txt`
- `src/components/cyryx/Hero.tsx`
- `src/components/cyryx/InternalHero.tsx` (created)
- `src/components/cyryx/MAAXStudioSpotlight.tsx`
- `src/components/cyryx/ProductEcosystem.tsx`
- `src/components/cyryx/StickyMobileCTA.tsx`
- `src/components/cyryx/StoryChapter.tsx`
- `src/components/cyryx/maax/MaaxWaitlistDialog.tsx`
- `src/components/cyryx/maax/MaaxWaitlistForm.tsx`
- `src/components/cyryx/seo/SolutionPage.tsx`
- `src/components/cyryx/seo/seo.ts`
- `src/components/cyryx/v4/CompactStart.tsx`
- `src/components/cyryx/v4/ControlledExecution.tsx`
- `src/components/cyryx/v4/EvidenceBeforeClaims.tsx`
- `src/components/cyryx/v4/ExecutionGap.tsx`
- `src/components/cyryx/v4/OperatingModel.tsx`
- `src/components/cyryx/v4/SecurityPosture.tsx`
- `src/copy/v3.ts`
- `src/assets/cyryx-structural-aperture-1920.webp` (created)
- `src/data/publications.ts`
- `src/data/site-taxonomy.ts` (created)
- `src/integrations/supabase/types.ts` (generated)
- `src/lib/email/fit-review-notifications.server.ts` (created)
- `src/lib/email/send-internal.server.ts`
- `src/lib/email-templates/fit-review-confirmation.tsx` (created)
- `src/lib/email-templates/fit-review-notification.tsx` (created)
- `src/lib/email-templates/registry.ts`
- `src/lib/contact.functions.ts`
- `src/lib/contact.schema.ts`
- `src/lib/cta.ts`
- `src/lib/maax-waitlist.schema.ts`
- `src/lib/navigation.ts`
- `src/lib/public-location.ts` (created)
- `src/lib/track-cta.ts`
- `src/routes/_authenticated/workspace.marketing.tsx`
- `src/routes/__root.tsx`
- `src/routes/api/public/contact.ts`
- `src/routes/api/public/cta-events.ts`
- `src/routes/api/public/maax-waitlist.ts`
- `src/routes/company.tsx`
- `src/routes/careers.tsx`
- `src/routes/contact.tsx`
- `src/routes/engagement-model.tsx`
- `src/routes/index.tsx`
- `src/routes/managed-operations.tsx`
- `src/routes/privacy.tsx`
- `src/routes/products.maax-studio.tsx`
- `src/routes/products.tsx`
- `src/routes/research.$slug.tsx`
- `src/routes/research.index.tsx`
- `src/routes/solutions.ai-governance-cost-control.tsx`
- `src/routes/solutions.ai-strategy-advisory.tsx`
- `src/routes/solutions.custom-ai-product-development.tsx`
- `src/routes/solutions.digital-web-systems.tsx`
- `src/routes/solutions.internal-ai-assistants.tsx`
- `src/routes/solutions.tsx`
- `src/routes/solutions.workflow-automation.tsx`
- `src/routes/start.tsx`
- `src/server.ts`
- `src/styles.css`
- `supabase/migrations/20260803180000_qualify_maax_waitlist.sql` (created)
- `tests/accessibility/contact-consent.spec.ts`
- `tests/accessibility/__snapshots__/jsonld.snapshot.json`
- `tests/accessibility/copy-validation.spec.ts`
- `tests/accessibility/hero.spec.ts`
- `tests/accessibility/maax-waitlist.spec.ts`
- `tests/accessibility/mobile-navigation.spec.ts`
- `tests/accessibility/mobile-public-routes.spec.ts`
- `tests/accessibility/nav-order.spec.ts`
- `tests/accessibility/navigation-model.spec.ts`
- `tests/accessibility/research-citation.spec.ts`
- `tests/accessibility/scroll-restoration.spec.ts`
- `tests/accessibility/security-headers.spec.ts` (created)
- `tests/accessibility/webkit-mobile-layout.spec.ts`
- `tests/accessibility/visual-regression.spec.ts-snapshots/solution-workflow-automation-hero-a11y-chromium-win32.png`
- `tests/cross-browser/compatibility.spec.ts`
- `tests/maax-waitlist-contract.test.ts` (created)
- `tests/maax-waitlist.test.ts`
- `tests/site-contracts.test.ts` (created)
- `tests/support/page-ready.ts` (created)
- `tests/support/vite-client-ready.ts` (created)

## QA Results

### Gate Decision

**FAIL — NEEDS_WORK**

Reviewed implementation manifest: base `7ca39e4`, 71 implementation/evidence files, SHA-256 `2652bee18ac04c0f81bf8ee2dea19084f3e55559fd545c1f04f14e9ce08af2dd`. The digest excludes this story's QA-only update and the newline-only generated `a11y-report` artifact.

The focused implementation contracts are green, but AC11 explicitly requires every repository gate in lines 152–162 to complete successfully. That standard is not met, and the real database persistence boundary required by AC4.8/AC6 was not exercised.

### Findings

1. **HIGH — AC11 mandatory gates are incomplete.** `bun run lint` did not complete (QA's run timed out and its exact process tree was terminated); the 62-file focused ESLint command passed but intentionally excluded generated Supabase types and the legacy admin route, so it is not the required repo-wide gate. The final revision also has no successful full `bun run test:a11y` or `bun run test:cross-browser` result. The clean focused Chromium interaction/header slice passed 12/12, but it does not establish the required desktop, mobile, Firefox, Android, iPhone, or WebKit coverage. Tasks 7 and 9 remain unchecked.
2. **HIGH — AC4.8/AC6 persistence and migration evidence is static only.** `tests/maax-waitlist-contract.test.ts` validates SQL/API/admin source strings, but the v2 migration was not applied to a reviewable database and neither direct-write denial, RLS behavior, RPC validation/rate limiting/resubscription, nor admin reads were executed. `supabase status` failed with `No such container: supabase_db_xupxvtcslulezzyuknlq`. The claim inventory correctly preserves this limitation at `docs/website-claim-inventory-2026-08-03.md:19`, `:41`, and `:43`.
3. **MEDIUM — final visual/performance evidence is absent.** No final 390×844 / 1440×900 visual evidence or Lighthouse mobile/desktop result was produced, so AC3.2–3, AC8, AC9.3–5, and AC11.2 remain unverified. The production build passed but reported chunks over 500 kB; without Lighthouse, the LCP/CLS/TBT impact is unknown.

### Verified Evidence

- `bun run typecheck` — PASS.
- `bun run test:unit` — PASS, 35 tests / 113 expectations.
- `bun run quality:validate-terms` — PASS, 14 active rules across 186 compiled files.
- `git diff --check` — PASS.
- Focused Prettier review of the changed contracts/evidence — PASS.
- Focused ESLint over 62 changed/new JS/TS files — PASS; exclusions documented above.
- `bun run build` — PASS (Vite client, SSR, and Vercel output generated).
- Clean Playwright slice — PASS, 12/12: `/start` consent/context/fail-closed behavior, MAAX modal/validation/optional telephone/focus restoration, and live runtime headers/cache.
- The originally reproduced `virtual:tanstack-start-client-entry` hydration race did not recur after the Vite/client and page-hydration readiness guards.
- Claim inventory review — PASS. Material claims C01–C18 distinguish verified, qualified, and withheld states; MAAX deployment, CGP implementation/conformance/certification, customer outcomes, and organization-wide legal claims remain properly bounded.
- CodeRabbit — unavailable, not installed in the configured WSL environment; nothing was installed. This is not treated as an application defect, but no CodeRabbit assurance exists.

### Fix Request

1. Obtain a successful repo-wide `bun run lint` result, then run the exact full `bun run test:a11y` and `bun run test:cross-browser` commands on one quiescent revision. Fix all new failures and preserve the prior Safari scroll-restoration/body-lock contract.
2. Apply the v2 migration to an isolated Supabase test target and add executable assertions for additive columns/status preservation, RLS/direct-write denial, narrow RPC required/optional and consent semantics, rate limiting, resubscription, and role-gated admin visibility. Run a non-destructive accepted/rejected API persistence smoke test.
3. Capture the required mobile/desktop visual checks and Lighthouse results, including CLS ≤ 0.1 and repository accessibility/SEO thresholds; document and correct material performance regressions.
4. Reconcile Tasks 7 and 9, the completion notes, and final file list with the actual final evidence before resubmitting for QA.

### Residual Risks

- The production-only HSTS branch is statically constrained to HTTPS Cyryx hosts, while the local HTTP test correctly confirms no HSTS. A post-deployment response check is still required to prove proxy/scheme handling at the real production boundary.
- Privacy and legal language is evidence-bounded in the claim inventory, but organization-wide processor, retention, transfer, and legal-basis assertions still require owner/counsel attestation before publication.
- No commit, push, deployment, remote migration, or production smoke test was authorized or performed. No separate gate artifact was created because QA authority is limited to this story file.

### Re-review Date: 2026-08-03

### Reviewed By: Argus (Test Architect)

### Reviewed Revision

Base `7ca39e4`; deterministic manifest of 77 implementation/evidence files; SHA-256 `9725708d337077502dfff1859223df6ee684840efabf3ea1c36ca768880425c7`. Generated runner/Lighthouse artifacts and this story's QA-only edits are excluded.

### Re-review Gate Decision

**FAIL — NEEDS_WORK (release-readiness; no unresolved functional website failure found)**

The corrections clear the prior hydration, interaction, responsive/browser, visual-regression, contrast, and Lighthouse evidence gaps. The gate remains FAIL because two explicit acceptance requirements still lack passing evidence and no authorized waiver changes those requirements.

### Cleared Findings and Verified Evidence

- Full `CI=1 bun run test:a11y` — PASS, exit 0 while processing 668 tests with four CI workers.
- Full `CI=1 bun run test:cross-browser` — PASS, 22 passed / 3 intentional mobile-only skips across Chromium, Firefox, WebKit desktop, Android, and iPhone.
- Visual regression — PASS, 3/3 snapshots; the Privacy baseline change is intentional and reviewed.
- Focused `/start` + MAAX + runtime-header slice — PASS, 12/12 on two clean runs. The virtual TanStack client-entry hydration error did not recur.
- Unit/contracts — PASS, 35/35 overall; focused MAAX schema/persistence contracts 13/13, including five migration/API/admin assertions.
- Typecheck — PASS after a frozen dependency repair; no lockfile or version change.
- Production build — PASS with Vite 8.0.16 / 2,775 modules. Remaining output is limited to plugin-timing and >500 kB chunk warnings.
- Forbidden-term validation — PASS, 14 active rules.
- Focused ESLint — PASS. QA independently reproduced exit 0 across 67 changed/new JS/TS files, excluding only generated Supabase types and the known legacy admin route.
- `git diff --check` — PASS.
- Lighthouse mobile after the contrast correction — accessibility 100, SEO 100, Best Practices 100, LCP 2,409–2,430 ms, TBT 6–19 ms, CLS 0. Performance 80 remains a configured warning against the 85 target.
- Lighthouse desktop before the same shared-CSS contrast correction — accessibility 96, SEO 100, Best Practices 100, LCP 2,248–2,431 ms, TBT 4–20 ms, CLS 0, performance 80–81 warning. The pre-fix accessibility result already exceeded the 95 threshold; the corrected shared CSS was then proven at 100 in the mobile reaudit.
- Claim inventory — PASS from the previous evidence review; deployment, CGP conformance/certification, outcomes, and legal/organizational statements retain qualified or withheld boundaries.
- CodeRabbit remains unavailable under the configured graceful-degradation policy; the CLI was not installed and no assurance is claimed.
- Lighthouse/Playwright outputs were reviewed by the lead and then intentionally removed as generated artifacts; metrics above are evidence-by-run rather than retained report files.

### Remaining Blocking Findings

1. **HIGH — AC11 still requires a successful repository-wide `bun run lint`.** The exact command remains blocked by baseline repository debt/timeout. Focused changed-file ESLint is green and no changed-code lint defect was found, but it is not the command explicitly required by AC11. QA cannot silently replace or waive a mandatory acceptance criterion.
2. **HIGH — AC4.8/AC6 still lack an executed configured persistence boundary.** The schema, API, additive SQL, RLS/RPC/admin source contracts, resubscription behavior, consent version, and fail-closed client behavior are covered statically and executably. However, the migration was not applied to a local/test Supabase instance, and accepted/rejected submissions, public direct-write denial, RLS, rate limiting, resubscription, and role-gated admin reads were not exercised against a real database. Local Docker was unavailable and no remote migration authorization was granted; those constraints explain but do not satisfy the acceptance criterion.

### Required Before the Next QA Submission

1. Produce a successful repo-wide `bun run lint` result, or obtain an explicit PO/owner change or waiver to AC11 that separates baseline debt from this story. Focused lint alone is not an implicit waiver.
2. Apply `20260803180000_qualify_maax_waitlist.sql` to an isolated local/ephemeral or expressly authorized staging Supabase target and run non-destructive assertions for migration preservation, RLS/direct-write denial, v2 RPC validation/rate limiting/resubscription, accepted/rejected persistence, and role-gated admin visibility.
3. Dev must reconcile the still-unchecked Tasks 7 and 9 plus stale completion notes with the now-green browser/visual/Lighthouse evidence; QA did not edit those Dev-owned sections.

### Residual Risks After the Two Blockers Close

- Lighthouse performance remains 80–81 versus the configured 85 warning target, although LCP, CLS, TBT, accessibility, SEO, and Best Practices meet their blocking thresholds. Track bundle/chunk optimization as performance debt unless a regression baseline proves otherwise.
- Production-only HSTS/proxy behavior still requires a post-deployment HTTPS response check.
- Organization-wide privacy/legal assertions still require owner/counsel attestation before publication.
- No commit, push, deployment, database application, or production smoke test was performed. This FAIL describes release-readiness evidence, not a reproduced functional defect in the corrected website.

### Lifecycle Transition

**FAIL: InProgress retained.** A PASS/CONCERNS transition to Done is not permitted while the two HIGH acceptance gaps remain. No separate gate file was created because this QA agent is restricted to the story's QA Results, Status, and Change Log.
