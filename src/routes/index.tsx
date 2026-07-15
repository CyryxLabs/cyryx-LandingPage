import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Hero } from "@/components/cyryx/Hero";
import { BackgroundMonolith } from "@/components/cyryx/primitives/BackgroundMonolith";
import { Footer } from "@/components/cyryx/Footer";
import { StickyMobileCTA } from "@/components/cyryx/StickyMobileCTA";
import { MAAXStudioSpotlight } from "@/components/cyryx/MAAXStudioSpotlight";
import { ContactSection } from "@/components/cyryx/ContactSection";
import { Problem } from "@/components/cyryx/v4/Problem";
import { WhatWeBuild } from "@/components/cyryx/v4/WhatWeBuild";
import { Solutions } from "@/components/cyryx/v4/Solutions";
import { EngagementModel } from "@/components/cyryx/v4/EngagementModel";
import { SecurityPosture } from "@/components/cyryx/v4/SecurityPosture";
import { WhoWeWorkWith } from "@/components/cyryx/v4/WhoWeWorkWith";
import { WhyCyryxV4 } from "@/components/cyryx/v4/WhyCyryxV4";
import { ResearchBand } from "@/components/cyryx/v4/ResearchBand";
import { FinalCTA } from "@/components/cyryx/v4/FinalCTA";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import hero640 from "@/assets/cyryx-hero-monolith-v2-640.webp.asset.json";
import hero1280 from "@/assets/cyryx-hero-monolith-v2-1280.webp.asset.json";
import hero1920 from "@/assets/cyryx-hero-monolith-v2-1920.webp.asset.json";

const HOME_URL = "https://cyryxlabs.com/";
const HOME_TITLE = "Cyryx Labs — AI Products and Execution Systems for the Agentic Era";
const HOME_DESCRIPTION =
  "Cyryx Labs builds AI products, agentic workflow systems, and governed execution infrastructure for teams moving from scattered AI experiments to structured, auditable operations.";
const HOME_SOCIAL_IMAGE = "https://cyryxlabs.com/cyryx-og.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: HOME_URL },
      { property: "og:image", content: HOME_SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
      { name: "twitter:image", content: HOME_SOCIAL_IMAGE },
      { name: "theme-color", content: "#050607" },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: hero1920.url,
        imageSrcSet: `${hero640.url} 640w, ${hero1280.url} 1280w, ${hero1920.url} 1920w`,
        imageSizes: "(max-width: 767px) 100vw, (max-width: 1279px) 100vw, 1920px",
        fetchPriority: "high",
      },
      { rel: "canonical", href: HOME_URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://cyryxlabs.com/#organization",
              name: "Cyryx Labs",
              legalName: "Cyryx Labs",
              alternateName: ["Cyryx", "Cyryx AI"],
              url: "https://cyryxlabs.com/",
              description:
                "Cyryx Labs is an AI product and systems company building proprietary AI products, governed agentic workflow systems, and execution infrastructure.",
              slogan: "The execution layer for enterprise AI.",
              foundingDate: "2024",
              industry: "Artificial Intelligence",
              areaServed: "Worldwide",
              email: "contact@cyryxlabs.com",
              sameAs: [
                "https://www.linkedin.com/company/cyryx-labs",
                "https://x.com/cyryxlabs",
                "https://github.com/cyryxlabs",
              ],
              makesOffer: [
                { "@type": "Offer", name: "MAAX Studio", itemOffered: { "@id": "https://cyryxlabs.com/#maax-studio" } },
              ],
              knowsAbout: [
                "Operational AI",
                "Agentic workflow systems",
                "AI execution infrastructure",
                "Governed autonomy",
                "MAAX Studio",
                "Proprietary AI products",
              ],
            },
            {
              "@type": "WebSite",
              "@id": "https://cyryxlabs.com/#website",
              url: "https://cyryxlabs.com/",
              name: "Cyryx Labs",
              publisher: { "@id": "https://cyryxlabs.com/#organization" },
              inLanguage: "en",
            },
            {
              "@type": "WebPage",
              "@id": "https://cyryxlabs.com/#webpage",
              url: "https://cyryxlabs.com/",
              name: "Cyryx Labs — AI Products and Execution Systems for the Agentic Era",
              isPartOf: { "@id": "https://cyryxlabs.com/#website" },
              about: { "@id": "https://cyryxlabs.com/#organization" },
              description:
                "Cyryx Labs builds AI products, agentic workflow systems, and governed execution infrastructure for teams operationalizing AI.",
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://cyryxlabs.com/#maax-studio",
              name: "MAAX Studio",
              applicationCategory: "DeveloperApplication",
              applicationSubCategory: "Agentic Execution Environment",
              operatingSystem: "macOS, Windows, Linux",
              featureList: [
                "Mission-based execution",
                "Project memory",
                "Command Gates",
                "Mission Ledger",
                "Cost visibility",
              ],
              audience: { "@type": "Audience", audienceType: "Teams operationalizing AI" },
              creator: { "@id": "https://cyryxlabs.com/#organization" },
              publisher: { "@id": "https://cyryxlabs.com/#organization" },
              description:
                "MAAX Studio is a local-first agentic execution environment engineered for governed autonomy. In active development.",
              brand: { "@id": "https://cyryxlabs.com/#organization" },
              offers: { "@type": "Offer", availability: "https://schema.org/PreOrder", price: "0", priceCurrency: "USD" },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useCyryxScrollAnimations();
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(event) => {
          const main = document.getElementById("main-content");
          if (!main) return;
          event.preventDefault();
          main.focus({ preventScroll: true });
          main.scrollIntoView({ block: "start" });
          window.history.replaceState(null, "", "#main-content");
        }}
      >
        Skip to content
      </a>
      <Header />
      <BackgroundMonolith />
      <main id="main-content" role="main" tabIndex={-1} className="relative z-10 focus:outline-none">
        {/* Continuous teal core line drawn by scroll (desktop only) */}
        <span
          aria-hidden
          data-core-line
          className="cx-core-line hidden lg:block"
        />
        <Hero />
        <Problem />
        <WhatWeBuild />
        <Solutions />
        <EngagementModel />
        <SecurityPosture />
        <MAAXStudioSpotlight />
        <WhoWeWorkWith />
        <WhyCyryxV4 />
        <ResearchBand />
        <FinalCTA />
        <ContactSection />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}

/**
CYRYX LABS WEBSITE TRANSFORMATION
PHASE 3D-C — WORKSPACE SEARCH CONTRACT REPAIR
CONTROLLED IMPLEMENTATION

Phase 3D-B Addendum is founder-approved with one correction:

DO NOT implement:

export type WorkspaceSearch = {
  w?: WsWindow;
  tab?: WsTab;
};

That approach makes the validated output optional and weakens all runtime consumers.

The required architecture is:

- Optional search input for navigation
- Required normalized search output for components
- Default w = 30
- Default tab = "overview"
- Invalid values fall back safely
- /workspace remains valid without a query string
- Child marketing search uses mktTab instead of tab
- No TanStack Register changes

==================================================
1. AUTHORIZED FILE SCOPE
==================================================

Primary authorized files:

1. src/routes/_authenticated/workspace.tsx
2. src/routes/_authenticated/workspace.marketing.tsx

Do not modify any other file unless the post-change TypeScript output proves that one of the already identified call sites requires a minimal correction.

Potential conditional file:

3. src/routes/_authenticated/workspace.index.tsx

This third file may be modified only if the normalized schema does not resolve Error 6 automatically.

Do not modify:

- src/router.tsx
- src/routeTree.gen.ts manually
- TanStack Register declarations
- Public routes
- Public navigation
- Hero
- Homepage
- JSON-LD
- JSON-LD snapshot
- Sitemap
- robots.txt
- Metadata
- Dependencies
- Lockfiles
- Build configuration
- .lovable/plan.md

==================================================
2. PRE-IMPLEMENTATION DEPENDENCY CHECK
==================================================

Before editing, inspect:

- package.json
- bun.lock or current lockfile
- Existing route validation patterns
- Installed Zod version
- Whether @tanstack/zod-adapter is already installed

Choose exactly one supported implementation path.

PATH A — ZOD V4 ALREADY INSTALLED

Use a Zod v4 schema with optional input and required defaulted output.

Conceptual contract:

- w accepts 7, 30 or 90
- missing w becomes 30
- invalid w becomes 30
- tab accepts overview, contacts, newsletter or cta
- missing tab becomes overview
- invalid tab becomes overview

Use the repository’s established Zod v4 syntax.

Do not add a dependency.

PATH B — ZOD V3 AND @tanstack/zod-adapter ALREADY INSTALLED

Use the existing adapter with fallback/default semantics so that:

- Navigation input is optional
- Validated output remains required
- Invalid input falls back safely

Use only already installed packages.

PATH C — NO SUPPORTED VALIDATOR ALREADY INSTALLED

Stop without modifying files and report:

BLOCKED — NO EXISTING VALIDATOR SUPPORTS OPTIONAL INPUT WITH REQUIRED OUTPUT

Do not install Zod.
Do not install an adapter.
Do not fall back to making WorkspaceSearch fields optional.

==================================================
3. PARENT WORKSPACE SEARCH CONTRACT
==================================================

In:

src/routes/_authenticated/workspace.tsx

Preserve the domain types:

WsWindow = 7 | 30 | 90

WsTab =
  | "overview"
  | "contacts"
  | "newsletter"
  | "cta"

The validated output type must remain equivalent to:

{
  w: WsWindow;
  tab: WsTab;
}

Both fields must be required after validation.

The navigation input must permit:

- no search object
- empty search input
- w only
- tab only
- both fields

Normalize to:

{
  w: 30,
  tab: "overview"
}

when both are absent or invalid.

Do not use non-null assertions to hide typing problems.

Do not use any.

Do not weaken component types.

Do not change the default values.

==================================================
4. CHILD MARKETING SEARCH COLLISION
==================================================

In:

src/routes/_authenticated/workspace.marketing.tsx

Rename only the child marketing-specific search key:

tab → mktTab

This applies to:

- Child validateSearch schema or validator
- Child search type
- Route.useSearch() or useSearch access
- navigate search callbacks
- UI active-tab comparisons
- Any marketing-only link construction
- Any marketing-only default value

Do not rename the parent workspace tab.

After this repair, the effective marketing search state should contain:

- Parent: w
- Parent: tab
- Child: mktTab
- Child: range
- Child: ch
- Child: cp
- Child: own
- Child: st
- Child: ap
- Child: aq

Preserve all existing marketing search semantics and allowed values.

Do not invent new marketing tabs.

Do not rename unrelated keys.

Do not change visible marketing labels.

==================================================
5. LEGACY URL SAFETY
==================================================

Inspect whether existing internal links or tests generate marketing URLs using the old child tab key.

If no existing link or test relies on the old key:

- Use mktTab directly.
- Report that no migration was required.

If repository evidence shows existing marketing links or bookmarks encoded with the old marketing tab value:

- Add the smallest safe parsing fallback from the legacy raw value.
- Only accept the legacy value if it matches a valid marketing-tab literal.
- Normalize output to mktTab.
- Do not allow the legacy marketing value to overwrite the parent workspace tab contract.

Do not invent compatibility behavior without repository evidence.

==================================================
6. INDEX SEARCH CALLBACK
==================================================

Inspect the existing Error 6 call in:

src/routes/_authenticated/workspace.index.tsx

After implementing the parent optional-input/required-output contract, run TypeScript before editing this file.

If Error 6 disappears:

- Do not modify workspace.index.tsx.

If Error 6 remains:

- Remove the manually narrowed callback parameter annotation.
- Allow TanStack to infer the callback input.
- Preserve existing fields with object spread.
- Change only tab.
- Do not use a cast.
- Do not use any.
- Do not duplicate defaults.

Conceptual behavior:

search: (prev) => ({
  ...prev,
  tab: nextTab,
})

Only perform this conditional correction if TypeScript proves it is still required.

==================================================
7. TANSTACK REGISTER LOCK
==================================================

Do not add:

declare module '@tanstack/react-router'

Do not modify:

src/router.tsx

Do not manually modify:

src/routeTree.gen.ts

The Phase 3D-B evidence established that registration was not the root cause.

If routeTree.gen.ts is automatically regenerated:

- Inspect its diff.
- Confirm whether it is deterministic.
- Report it separately.
- Do not manually patch the generated output.

==================================================
8. VALIDATION SEQUENCE
==================================================

A. Capture baseline

Run:

git status --short

Record the current commit:

git rev-parse --short HEAD

B. Implement the two primary route corrections.

C. Run TypeScript:

bunx tsc --noEmit -p tsconfig.json --pretty false

Expected:

- Exit code 0
- Zero TypeScript errors

If errors remain:

- Report every remaining error.
- Only modify workspace.index.tsx if Error 6 remains for the documented callback reason.
- Do not expand scope to other files.
- Do not suppress errors.

D. Run TypeScript again only if the conditional index correction was required.

Expected final result:

- Exit code 0
- Zero TypeScript errors

E. JSON-LD regression

Run:

bunx playwright test tests/accessibility/jsonld-snapshot.spec.ts

Expected:

- 3 tests passed
- No snapshot update
- No JSON-LD changes

F. Search-contract verification

Verify through existing test infrastructure or a focused runtime check:

1. /workspace with no search resolves to:
   w = 30
   tab = "overview"

2. Valid values remain unchanged:
   w = 7 | 30 | 90
   tab = overview | contacts | newsletter | cta

3. Invalid values normalize to:
   w = 30
   tab = "overview"

4. /workspace/marketing no longer produces a tab intersection of never.

5. mktTab controls the marketing view.

6. Parent tab remains independently typed.

Do not install a browser or dependency.

If no existing lightweight test can verify runtime normalization, report manual/source-level verification instead of adding a new testing framework.

==================================================
9. DIFF CONTROL
==================================================

Before completion, inspect:

git diff --name-status

git diff --stat

git diff -- src/routes/_authenticated/workspace.tsx

git diff -- src/routes/_authenticated/workspace.marketing.tsx

If conditionally modified:

git diff -- src/routes/_authenticated/workspace.index.tsx

Confirm:

- No public-site file changed
- No Hero file changed
- No JSON-LD file changed
- No snapshot changed
- No dependency changed
- No lockfile changed
- No Register declaration changed
- No unrelated formatting rewrite occurred

==================================================
10. LOVABLE CHECKPOINT CONTROL
==================================================

Do not manually commit, push, publish or deploy.

Lovable may automatically create a checkpoint commit.

If that occurs, report:

- Commit hash
- Commit message
- Files included
- Confirmation that it was automatic
- Confirmation that no unrelated file was included

Do not claim “nothing was committed” if Lovable created an automatic checkpoint.

==================================================
11. REQUIRED EVIDENCE REPORT
==================================================

Return:

1. Phase status
2. Dependency and validator versions found
3. Implementation path selected: A, B or C
4. Files inspected
5. Files modified
6. Parent search input type
7. Parent validated output type
8. Default and invalid-value behavior
9. Exact marketing key rename
10. Legacy URL compatibility decision
11. Whether workspace.index.tsx required modification
12. TypeScript result before repair
13. TypeScript result after repair
14. Final TypeScript error count
15. JSON-LD regression result
16. Search-contract verification results
17. routeTree.gen.ts status
18. Exact diff summary
19. Complete changed-file set
20. Register integrity confirmation
21. Hero/public-site integrity confirmation
22. Automatic checkpoint status
23. Confirmation that nothing was pushed, published or deployed
24. Remaining risks

PHASE 3D-C COMPLETE — TYPESCRIPT BASELINE RESTORED — AWAITING FOUNDER APPROVAL FOR PHASE 4.
*/
