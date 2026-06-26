## Goal

Update ONLY the copy across the landing page sections to match the v3 copy provided. No changes to layout, structure, components, animations, styles, or routing.

## Scope

Edit text strings (headings, subheadings, paragraphs, card titles/descriptions, CTA labels, nav labels, footer text) inside the existing components. Preserve all JSX structure, class names, props, IDs (`#contact`, etc.), and component composition.

## Files to edit (copy-only)

1. **`src/components/cyryx/Hero.tsx`** — Headline "Building operational intelligence for the AI era.", subhead, four pill labels (AI Products / Applied AI Systems / Workflow Automation / AI Research), tagline "Product thinking · Applied AI engineering · Governed execution", CTAs "Start an AI Project" / "Explore MAAX Studio".
2. **`src/components/cyryx/Header.tsx`** + **`src/components/cyryx/MobileMenu.tsx`** — Nav labels `01 — Products`, `02 — Solutions`, `03 — Applied AI Lab`, `04 — MAAX Studio`, `05 — MAAX Runtime`. Update header CTA label to "Start an AI Project" if it currently differs.
3. **`src/components/cyryx/WhyCyryx.tsx`** (Company Thesis) — Heading "AI is no longer the question. Execution is.", body paragraphs, and the 6 problem cards (Scattered context, Manual work, Disconnected tools, Inconsistent results, Poor visibility, No operating layer).
4. **`src/components/cyryx/CoreCapabilities.tsx`** (What We Build) — Section heading "Products, systems, and architecture for operational AI.", intro, and the three engine blocks (01 Products / 02 Solutions / 03 Applied AI Lab) with their CTAs.
5. **`src/components/cyryx/ProductEcosystem.tsx`** — Section heading "A technology company built around AI execution.", intro, MAAX Studio block, Cyryx Applied AI Lab block, CTAs.
6. **`src/components/cyryx/MAAXStudioSpotlight.tsx`** — Heading "The native command workbench for AI-native software execution.", intro paragraphs, 10 core capability bullets, CTA "Request Early Access".
7. **`src/components/cyryx/CommandLayerSection.tsx`** (Solutions) — Heading "Applied AI systems for businesses ready to move.", intro, and the 6 service cards (AI Websites & Lead Systems, Workflow Automation, Internal AI Assistants, Custom AI Product Development, AI Integrations, AI Governance & Cost Control) with their deliverables lists.
8. **`src/components/cyryx/AppliedAILab.tsx`** — Heading "Research that becomes working systems.", intro, and the 6 lab pillars (Agentic Workflow Design, Context Intelligence, Evaluation & Governance, Model Routing & Cost Awareness, Knowledge Systems, Productized AI Infrastructure).
9. **`src/components/cyryx/ProcessTimeline.tsx`** (How We Work) — Heading "From idea to implemented system.", subhead, and the 5 phases (Diagnose, Architect, Build, Launch, Improve).
10. **`src/components/cyryx/MetricsBand.tsx`** / **`MetricCard.tsx`** (Execution Signals) — Heading "Built for measurable execution.", intro, and the 10 operating signals list. Keep current card visual treatment; only swap text.
11. **`src/components/cyryx/WhoWeServe.tsx`** — Heading "Built for businesses, builders, and teams ready to use AI practically.", and the 5 audience blocks (SMBs, Founders & Startups, Agencies, Product Teams, Investors & Strategic Partners).
12. **`src/components/cyryx/CapabilityStrip.tsx`** (Why Cyryx) — Heading "Product-first. Research-backed. Implementation-ready.", intro, and the 9 differentiators list.
13. **`src/components/cyryx/Ecosystem.tsx`** — Heading "Built by Cyryx Labs. Powered by AI execution architecture.", and the 5 ecosystem entries (Company, Flagship Product, Implementation Arm, Research Layer, Execution Architecture).
14. **`src/components/cyryx/CTASection.tsx`** — Heading "Ready to build AI into your business?", body, CTAs "Start an AI Project" / "Request MAAX Studio Access", `hello@cyryxlabs.com` mailto.
15. **`src/components/cyryx/Footer.tsx`** — Description paragraph and tagline "Build AI into your business."
16. **`src/components/cyryx/StickyMobileCTA.tsx`** — Update label if needed to "Start an AI Project".
17. **`src/components/cyryx/ContactSection.tsx`** — Copy-only: align heading/intro with the new tone if needed (no schema, no form structure changes).

## Out of scope (will NOT change)

- Layout, grid, spacing, typography classes, colors, animations, GSAP/ScrollTrigger.
- Form fields, validation, consent checkbox, Privacy Policy route.
- Component file structure, props, IDs, routing, SEO metadata in route files (unless a section heading also drives `<head>` copy — will confirm before touching).
- Images, assets, icons.

## Approach

For each file: read the file, then apply targeted search-replace patches that swap only the user-visible strings. If a section currently has fewer/more cards than the v3 copy (e.g. Solutions has 6 cards in v3), I will adapt only by editing existing card text — I will NOT add or remove cards in this pass. If a mismatch exists (e.g. component has 4 problem cards vs 6 in v3), I'll flag it and edit the existing N cards using the first N v3 entries, then ask whether to extend.

## Verification

- `bun run build` (or equivalent typecheck) to ensure no JSX broke.
- Visual spot-check via screenshot of `/` after edits.
