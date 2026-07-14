# Phase 3A — Founder IA Decision Lock (Documentation Only)

**Scope:** Update `.lovable/plan.md` only. No source, route, redirect, nav, hero, asset, test, or config changes. No commit/push/publish/deploy.

## What I will write into `.lovable/plan.md`

Append a new section titled **"Phase 3A — Founder IA Decision Lock"** containing:

1. Date and phase status (Documentation only — no shipping changes).
2. Full list of approved founder decisions (A–K) transcribed verbatim from the founder directive.
3. Correction: **7** live canonical solution pages (Phase 2 report said 6).
4. Current canonical route matrix.
5. Existing redirect matrix (3 solution redirects, direction preserved).
6. Potential future redirect matrix, each row explicitly marked **NOT APPROVED — CONTENT MIGRATION REQUIRED FIRST**.
7. Five-pillar commercial presentation model (Digital & Web Systems, Workflow Automation, Internal AI Assistants, Custom AI Product Development, AI Governance & Cost Control) with AI Integrations noted as cross-cutting until migrated.
8. Contact vs. Start responsibility matrix.
9. Managed Operations and Engagement Model disposition (both remain independent on current URLs; "How We Work" is a label option only, no new route).
10. Answers placement decision (kept; nested under Research + footer + contextual links; not a top-level nav item).
11. Careers recommendation (kept; future Talent Network + noindex when no roles — not implemented now).
12. Internal-route indexing verification requirement (deferred technical audit).
13. Hero lock confirmation (headline, sub, CTAs verbatim).
14. Explicit list of decisions deferred to later phases.

## Four required matrices (also inside `.lovable/plan.md`)

- **Matrix A — Current Route State**: columns = Current route | Route type | Canonical destination | Sitemap status | Nav exposure | Approved current disposition. Covers all public routes (home, 7 solutions, 3 solution redirect stubs, managed-operations, engagement-model, products + maax-studio + lyra, research index + slug, answers hub + 5 answer pages, company, careers, contact, start, privacy, terms, unsubscribe, newsletter.confirm, auth).
- **Matrix B — Future Content Consolidation**: columns = Source | Potential destination | Content to migrate | FAQ impact | Metadata impact | JSON-LD impact | Internal-link impact | Redirect status. Rows = `ai-websites-lead-systems → digital-web-systems`, `ai-integrations → workflow-automation`. Every Redirect status = **NOT APPROVED — CONTENT MIGRATION REQUIRED FIRST**.
- **Matrix C — Future Navigation Model**: top-level = Products, Solutions, Research, Company, Start a Project. Documented (not implemented) groupings under each, exactly as specified in the directive (Managed Operations + How We Work grouped under Solutions; Answers under Research; Careers + Contact under Company).
- **Matrix D — Phase Sequence**: Phase 3B through Phase 12 as specified.

## Validation checklist to include at end of section

- Only `.lovable/plan.md` modified.
- No public source file, route, redirect, hero file, asset, test, or snapshot changed.
- Nothing committed, pushed, published, or deployed.

## Evidence report

After writing the file, return the required 12-item evidence report and end exactly with:
`PHASE 3A COMPLETE — DOCUMENTATION ONLY — AWAITING FOUNDER APPROVAL FOR PHASE 3B.`

---

# Phase 3A — Founder IA Decision Lock

**Date:** 2026-07-14
**Status:** Documentation only. No shipping code changes. Only `.lovable/plan.md` modified.

## 1. Approved Founder Decisions (A–K)

**A. Preserve current canonical solution URLs.** The seven approved canonical solution pages are:
1. `/solutions/digital-web-systems`
2. `/solutions/ai-websites-lead-systems`
3. `/solutions/workflow-automation`
4. `/solutions/internal-ai-assistants`
5. `/solutions/custom-ai-product-development`
6. `/solutions/ai-integrations`
7. `/solutions/ai-governance-cost-control`

**Correction:** Phase 2 stated "six live solution pages." The correct count is **seven**.

**B. Preserve existing redirect direction.** Keep:
- `/solutions/ai-product-engineering` → `/solutions/custom-ai-product-development`
- `/solutions/applied-ai-systems` → `/solutions/internal-ai-assistants`
- `/solutions/governance-optimization` → `/solutions/ai-governance-cost-control`

Do not reverse.

**C. Future consolidation begins with content migration, not redirects.** Potential future consolidations (NOT approved yet):
- `/solutions/ai-websites-lead-systems` → `/solutions/digital-web-systems`
- `/solutions/ai-integrations` → `/solutions/workflow-automation`

Before any redirect approval, a future phase must produce: complete source-to-destination content mapping, FAQ migration mapping, metadata migration mapping, JSON-LD migration mapping, internal-link impact report, sitemap impact report, redirect-chain verification, and test-update inventory.

**D. Approved commercial solution pillars.** Five principal pillars:
1. Digital & Web Systems
2. Workflow Automation
3. Internal AI Assistants
4. Custom AI Product Development
5. AI Governance & Cost Control

AI Integrations remains available as a cross-cutting capability until content has been safely migrated. Do not rename canonical URLs in this phase.

**E. Managed Operations remains independent.** Keep `/managed-operations`. It is a delivery and operating model, not merely a governance solution. Do not merge into AI Governance & Cost Control.

**F. Engagement Model URL unchanged.** Keep `/engagement-model`. Visible nav label may later become "How We Work." Do not create `/how-we-work`. Do not redirect `/engagement-model`.

**G. Keep both Contact and Start.** Keep `/contact` and `/start`. Do not redirect `/contact` to `/start`.
- **/contact:** general inquiries, institutional contact, partnerships, press, non-project questions.
- **/start:** commercial project qualification, discovery intake, scope/budget/timeline/business-needs capture.

**H. Answers placement.** Keep the Answers hub and all Answer pages. Answers should not be a standalone primary-nav item. Future placement: inside Research nav group, in footer, and via contextual internal links.

**I. Careers status.** Keep `/careers`. Future page becomes a Talent Network when there are no active positions. Until real open roles exist, recommended future SEO state is `noindex`. Not implemented in Phase 3A.

**J. Internal routes.** Auth and workspace routes remain internal. Later technical phase must verify: `noindex` behavior, robots behavior, sitemap exclusion, and absence from public navigation. Not modified in this phase.

**K. Hero lock.** The approved hero remains locked:
- **Headline:** The execution layer for enterprise AI.
- **Supporting copy:** Cyryx Labs builds AI products and execution systems — governed agents, automated workflows, and operational infrastructure engineered for accountability, auditability, and cost control.
- **Primary CTA:** Start a project
- **Secondary CTA:** MAAX Studio →

Do not modify hero copy, rendering, media, animations, assets, layout, or destinations.

## 2. Matrix A — Current Route State

| Current route | Type | Canonical destination | Sitemap | Nav exposure | Approved current disposition |
|---|---|---|---|---|---|
| `/` | Page | self | Yes | Primary (logo/home) | Keep. Hero locked. |
| `/solutions` | Hub | self | Yes | Primary nav | Keep. |
| `/solutions/digital-web-systems` | Solution | self | Yes | Solutions hub | Keep. Pillar 1. |
| `/solutions/ai-websites-lead-systems` | Solution | self | Yes | Solutions hub | Keep. Future migration candidate → digital-web-systems (NOT APPROVED). |
| `/solutions/workflow-automation` | Solution | self | Yes | Solutions hub | Keep. Pillar 2. |
| `/solutions/internal-ai-assistants` | Solution | self | Yes | Solutions hub | Keep. Pillar 3. |
| `/solutions/custom-ai-product-development` | Solution | self | Yes | Solutions hub | Keep. Pillar 4. |
| `/solutions/ai-integrations` | Solution | self | Yes | Solutions hub | Keep. Cross-cutting; future migration candidate → workflow-automation (NOT APPROVED). |
| `/solutions/ai-governance-cost-control` | Solution | self | Yes | Solutions hub | Keep. Pillar 5. |
| `/solutions/ai-product-engineering` | 301 stub | → `/solutions/custom-ai-product-development` | No | None | Keep redirect. |
| `/solutions/applied-ai-systems` | 301 stub | → `/solutions/internal-ai-assistants` | No | None | Keep redirect. |
| `/solutions/governance-optimization` | 301 stub | → `/solutions/ai-governance-cost-control` | No | None | Keep redirect. |
| `/managed-operations` | Page | self | Yes | Footer / contextual | Keep independent. |
| `/engagement-model` | Page | self | Yes | Contextual | Keep URL. Nav label may become "How We Work" later. |
| `/products` | Hub | self | Yes | Primary nav | Keep. |
| `/products/maax-studio` | Product | self | Yes | Products hub | Keep. |
| `/products/lyra` | Product | self | Yes | Products hub | Keep. |
| `/research` | Hub | self | Yes | Primary nav | Keep. |
| `/research/$slug` | Article | self | Yes (per slug) | Research hub | Keep. |
| `/answers` | Hub | self | Yes | Under Research + footer (future) | Keep. Not a primary nav item. |
| `/answers/what-is-governed-ai-execution` | Answer | self | Yes | Answers hub | Keep. |
| `/answers/what-are-command-gates-in-ai-systems` | Answer | self | Yes | Answers hub | Keep. |
| `/answers/how-to-measure-ai-output-quality` | Answer | self | Yes | Answers hub | Keep. |
| `/answers/what-is-goal-grounded-generation` | Answer | self | Yes | Answers hub | Keep. |
| `/answers/ai-execution-system-vs-ai-automation` | Answer | self | Yes | Answers hub | Keep. |
| `/company` | Page | self | Yes | Primary nav / footer | Keep. |
| `/careers` | Page | self | Yes | Company / footer | Keep. Future: Talent Network + `noindex` when no roles (not now). |
| `/contact` | Page | self | Yes | Footer / contextual | Keep. Non-project inquiries. |
| `/start` | Page | self | Yes | Primary CTA | Keep. Commercial qualification. |
| `/privacy` | Legal | self | Yes | Footer | Keep. |
| `/terms` | Legal | self | Yes | Footer | Keep. |
| `/unsubscribe` | Utility | self | No | None | Keep. |
| `/newsletter/confirm` | Utility | self | No | None | Keep. |
| `/auth` | Auth | self | No | None | Keep. Internal. |
| `/_authenticated/workspace/*` | Internal | self | No | None | Keep internal. Verify `noindex` in later technical phase. |

## 3. Matrix B — Future Content Consolidation

| Source | Potential destination | Content to migrate | FAQ impact | Metadata impact | JSON-LD impact | Internal-link impact | Redirect status |
|---|---|---|---|---|---|---|---|
| `/solutions/ai-websites-lead-systems` | `/solutions/digital-web-systems` | Hero, positioning, capability sections, proof/outcomes, pricing block, CTA blocks | Merge/deduplicate FAQ arrays; renumber `FAQPage` entities | Retitle destination; write new meta description covering both scopes; retire source title/description | Merge `Service` + `FAQPage` graphs; ensure single canonical `Service` node on destination | Audit all `<Link to>`, sitemap entries, breadcrumb JSON-LD, cross-solution references, footer, homepage sections | **NOT APPROVED — CONTENT MIGRATION REQUIRED FIRST** |
| `/solutions/ai-integrations` | `/solutions/workflow-automation` | Integration catalog, connector patterns, capability copy, proof blocks, CTA blocks | Merge FAQ arrays; deduplicate integration-specific questions | Retitle destination to cover integrations scope; retire source metadata | Merge `Service` + `FAQPage`; keep single canonical `Service` on destination | Audit `<Link to>`, sitemap, breadcrumbs, cross-solution refs, homepage/services strips, footer | **NOT APPROVED — CONTENT MIGRATION REQUIRED FIRST** |

## 4. Matrix C — Future Navigation Model (Documented, Not Implemented)

Top-level primary navigation (proposed):
- **Products**
- **Solutions**
- **Research**
- **Company**
- **Start a Project** (primary CTA)

Proposed groupings (documentation only):

**Products:**
- MAAX Studio
- Lyra
- Products Overview

**Solutions:**
- Digital & Web Systems
- Workflow Automation
- Internal AI Assistants
- Custom AI Product Development
- AI Governance & Cost Control
- Managed Operations
- How We Work (label for `/engagement-model`)

**Research:**
- Research
- Answers

**Company:**
- Company
- Careers
- Contact

## 5. Matrix D — Phase Sequence

| Phase | Scope |
|---|---|
| 3B | JSON-LD hero terminology consistency only. |
| 4 | Navigation information architecture and active-route behavior. |
| 5 | Homepage storytelling and section consolidation (locked hero excluded). |
| 6 | Solution-page content migration and consolidation analysis. |
| 7 | Solution redirect implementation, only after migration approval. |
| 8 | MAAX and Lyra product differentiation. |
| 9 | Company, Careers, Contact, Start, and Engagement Model refinement. |
| 10 | Visual design-system tokenization. |
| 11 | GSAP and 3D motion system, performance budgets, reduced-motion support. |
| 12 | SEO, structured data, social metadata, accessibility, final regression audit. |

## 6. Contact vs. Start Responsibility Matrix

| Concern | Route |
|---|---|
| General inquiries | `/contact` |
| Institutional contact | `/contact` |
| Partnerships | `/contact` |
| Press | `/contact` |
| Non-project questions | `/contact` |
| Commercial project qualification | `/start` |
| Discovery intake | `/start` |
| Scope / budget / timeline capture | `/start` |
| Business-needs capture | `/start` |

## 7. Decisions Deferred to Later Phases

- Renaming canonical solution URLs to alternate marketing labels.
- Executing consolidation redirects for `ai-websites-lead-systems` and `ai-integrations`.
- Introducing dropdown/mega-menu navigation.
- Changing the visible label of `/engagement-model` to "How We Work."
- Implementing `noindex` on `/careers` when no roles are open.
- Technical audit of internal-route indexing/robots/sitemap exclusion.
- JSON-LD hero terminology reconciliation (deferred to Phase 3B).
- Homepage section restructuring (Phase 5).
- Design-system tokenization (Phase 10).
- Motion/3D and performance budgets (Phase 11).
- Final SEO / structured-data / a11y regression audit (Phase 12).

## 8. Validation

- Only `.lovable/plan.md` was modified in this phase.
- No public source file, route, redirect, hero file, asset, test, or snapshot was changed.
- Nothing was committed, pushed, published, or deployed.

---

PHASE 3A COMPLETE — DOCUMENTATION ONLY — AWAITING FOUNDER APPROVAL FOR PHASE 3B.
