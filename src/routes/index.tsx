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
                "Enterprise AI governance",
              ],
              logo: {
                "@type": "ImageObject",
                url: "https://cyryxlabs.com/cyryx-mark.png",
                width: "512",
                height: "512",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://cyryxlabs.com/#website",
              url: "https://cyryxlabs.com/",
              name: "Cyryx Labs",
              publisher: { "@id": "https://cyryxlabs.com/#organization" },
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
      <div className="sr-only">
        CYRYX LABS WEBSITE TRANSFORMATION
        PHASE 4A — NAVIGATION IMPLEMENTATION AUDIT
        READ-ONLY — NO FILE MODIFICATIONS

        Phase 3D-C Remediation is founder-approved.
        The technical baseline is now green:
        - TypeScript: PASS, 0 errors
        - JSON-LD snapshot: PASS, 3 tests
        - Hero: locked and unchanged
        - Public content: unchanged
        - Workspace search contract: repaired

        Phase 4 begins with a read-only audit of the existing public navigation implementation.
        Do not implement navigation changes yet.

        ==================================================
        1. STRICT READ-ONLY SCOPE
        ==================================================
        Do not modify any file.
        Do not:
        - Change Header
        - Change Footer
        - Add dropdowns
        - Add mobile accordions
        - Change routes
        - Change redirects
        - Change sitemap
        - Change copy
        - Change styles
        - Change design tokens
        - Change hero
        - Change images or video
        - Add dependencies
        - Update tests
        - Update snapshots
        - Commit
        - Push
        - Publish
        - Deploy

        If any command modifies a generated file, stop and report it.

        ==================================================
        2. APPROVED FUTURE PRIMARY NAVIGATION
        ==================================================
        The approved future top-level navigation model is:
        1. Products
        2. Solutions
        3. Research
        4. Company
        5. Start a Project — primary CTA

        Do not implement it in Phase 4A.
        Audit how this model should map safely onto the current codebase.

        ==================================================
        3. APPROVED GROUPING MODEL
        ==================================================
        PRODUCTS
        - Products Overview → /products
        - MAAX Studio → /products/maax-studio
        - Lyra → /products/lyra

        SOLUTIONS
        Primary commercial pillars:
        - Digital & Web Systems  → /solutions/digital-web-systems
        - Workflow Automation  → /solutions/workflow-automation
        - Internal AI Assistants  → /solutions/internal-ai-assistants
        - Custom AI Product Development  → /solutions/custom-ai-product-development
        - AI Governance & Cost Control  → /solutions/ai-governance-cost-control

        Delivery and operating model links:
        - Managed Operations  → /managed-operations
        - How We Work  → /engagement-model

        Do not include redirect-stub routes in navigation.
        Do not include as primary dropdown items:
        - /solutions/ai-product-engineering
        - /solutions/applied-ai-systems
        - /solutions/governance-optimization

        For now, also do not expose these as principal navigation pillars:
        - /solutions/ai-websites-lead-systems
        - /solutions/ai-integrations

        They remain live canonical pages pending future content migration, but should be reachable through contextual links, sitemap and footer architecture as appropriate.
        Do not redirect or remove them.

        RESEARCH
        - Research → /research
        - Answers → /answers

        COMPANY
        - Company → /company
        - Careers → /careers
        - Contact → /contact

        PRIMARY CTA
        - Start a Project → /start

        ==================================================
        4. FILE AND COMPONENT INVENTORY
        ==================================================
        Locate and inspect:
        - Public Header component
        - Desktop navigation component
        - Mobile navigation component
        - Footer component
        - Navigation configuration or constants
        - Shared Link components
        - Button/CTA components used in the header
        - Layout components mounting Header and Footer
        - Active-route utilities
        - Menu/dropdown primitives
        - Focus-management utilities
        - Click-outside utilities
        - Any Radix, Headless UI or custom menu implementation
        - Relevant CSS and design tokens
        - Navigation-related tests

        Return exact file paths.

        Determine whether desktop and mobile navigation:
        - Share one data source
        - Duplicate labels and routes
        - Use hardcoded arrays
        - Use router-aware links
        - Use anchor tags
        - Use current pathname manually
        - Have active-route support
        - Have keyboard support
        - Have focus trapping or focus return
        - Support Escape
        - Support click outside
        - Support touch
        - Support reduced motion

        ==================================================
        5. CURRENT NAVIGATION BEHAVIOR
        ==================================================
        Document the current desktop header:
        - Item order
        - Labels
        - Destinations
        - CTA
        - Active-state behavior
        - Hover behavior
        - Click behavior
        - Sticky/fixed behavior
        - Scroll behavior
        - Transparent/solid background behavior
        - Header height
        - Logo behavior
        - Breakpoint where mobile navigation begins

        Document the current mobile navigation:
        - Trigger element
        - aria-label
        - aria-expanded
        - aria-controls
        - Menu presentation
        - Opening animation
        - Closing animation
        - Focus behavior
        - Escape behavior
        - Backdrop behavior
        - Route-change closing behavior
        - Body-scroll behavior
        - Small-screen behavior at 320–360px

        Document the current footer navigation:
        - Groups
        - Links
        - Duplicated links
        - Missing routes
        - Redirect-stub exposure
        - Contact/Start exposure
        - Research/Answers exposure
        - Legal links

        ==================================================
        6. ACTIVE-ROUTE MODEL
        ==================================================
        Design—but do not implement—the correct active-state rules.
        Expected behavior:
        - /products activates Products
        - /products/maax-studio activates Products
        - /products/lyra activates Products
        - Any /solutions/* canonical page activates Solutions
        - /managed-operations activates Solutions
        - /engagement-model activates Solutions
        - /research and /research/* activate Research
        - /answers and /answers/* activate Research
        - /company activates Company
        - /careers activates Company
        - /contact activates Company
        - /start activates the Start a Project CTA

        Audit whether exact matching, prefix matching or route metadata is the safest implementation.
        Prevent false matches such as:
        - /products matching unrelated strings
        - Redirect stubs appearing active
        - /contact and /start both appearing active
        - Internal /workspace routes affecting public navigation

        Recommend one centralized active-route function.

        ==================================================
        7. DESKTOP DROPDOWN REQUIREMENTS
        ==================================================
        Design—but do not implement—the behavior for desktop dropdowns.
        Required future behavior:
        - Products, Solutions, Research and Company can open menus.
        - Top-level labels remain understandable.
        - Dropdown contents are grouped clearly.
        - Only one dropdown is open at a time.
        - Menus work with mouse, keyboard and touch-capable laptops.
        - Escape closes the menu.
        - Click outside closes the menu.
        - Selecting an item closes the menu.
        - Focus returns appropriately.
        - Route changes close open menus.
        - Active top-level group is visually clear.
        - Current child item uses aria-current="page".
        - No hover-only interaction.
        - No excessive animation.
        - No new heavy dependency.

        Determine whether existing primitives can support this.

        ==================================================
        8. MOBILE NAVIGATION REQUIREMENTS
        ==================================================
        Design—but do not implement—the future mobile structure.
        Expected hierarchy:
        - Products accordion
        - Solutions accordion
        - Research accordion
        - Company accordion
        - Start a Project CTA

        Requirements:
        - Works at 320px width
        - No horizontal overflow
        - Touch targets at least 44px
        - Clear expanded/collapsed state
        - aria-expanded
        - aria-controls
        - Escape closes the entire menu
        - Route selection closes the menu
        - Body scroll is managed correctly
        - Focus is returned to the trigger
        - Nested groups do not create excessive scrolling
        - CTA remains visually prominent
        - No tracking values that break button labels

        ==================================================
        9. CORPORATE VISUAL CONSTRAINTS
        ==================================================
        The future navigation must feel:
        - Corporate
        - Enterprise
        - Precise
        - Restrained
        - High-technology
        - Cyryx-native

        Do not propose:
        - Generic SaaS mega-menu illustrations
        - Excessive glowing
        - Excessive teal
        - Large decorative cards
        - Multiple gradients
        - HUD labels on every item
        - Heavy 3D in navigation
        - GSAP for basic menu interactions
        - New hero imagery
        - Logo redesign

        The navigation should support the website’s cinematic experience without competing with it.

        ==================================================
        10. HERO AND ASSET LOCK
        ==================================================
        Do not modify or recommend replacing:
        - Hero headline
        - Hero supporting copy
        - Hero CTAs
        - Hero image
        - Hero video
        - Hero poster
        - Hero composition
        - Existing product imagery
        - Official Cyryx logo

        Phase 4 concerns navigation only.

        ==================================================
        11. ACCESSIBILITY AUDIT
        ==================================================
        Audit against:
        - Semantic nav landmark
        - Accessible menu labels
        - aria-expanded
        - aria-controls
        - aria-current
        - Keyboard Tab order
        - Enter and Space activation
        - Escape closing
        - Focus visibility
        - Focus return
        - Pointer and touch support
        - 44px touch targets
        - Color contrast
        - Reduced motion
        - Screen-reader announcement quality

        Identify every current accessibility gap and the future correction.

        ==================================================
        12. TEST INVENTORY
        ==================================================
        Locate all tests covering:
        - Header
        - Navigation order
        - Mobile menu
        - Footer links
        - Active routes
        - Keyboard navigation
        - Accessibility
        - Route metadata
        - Redirect stubs
        - Sitemap coverage

        For each test, report:
        - Exact path
        - Current assertions
        - Whether it will require modification
        - Whether a new focused test is required
        - Expected future assertion

        Do not modify tests.

        ==================================================
        13. PHASE 4 IMPLEMENTATION SPLIT
        ==================================================
        Recommend the smallest safe implementation sequence:
        Phase 4B: Centralized navigation data model and active-route utility.
        Phase 4C: Desktop header dropdown implementation.
        Phase 4D: Mobile navigation implementation.
        Phase 4E: Footer alignment.
        Phase 4F: Cross-device accessibility and regression validation.

        For each phase, provide:
        - Exact files expected to change
        - Tests expected to change
        - Visual impact
        - Risk
        - Rollback boundary
        - Acceptance criteria

        ==================================================
        14. REQUIRED EVIDENCE REPORT
        ==================================================
        Return:
        1. Phase status
        2. Confirmation that no files were modified
        3. Header file inventory
        4. Mobile navigation inventory
        5. Footer inventory
        6. Navigation data-source inventory
        7. Current desktop behavior
        8. Current mobile behavior
        9. Current footer behavior
        10. Current active-route behavior
        11. Accessibility gap inventory
        12. Existing primitive/dependency inventory
        13. Complete test inventory
        14. Approved route-to-group mapping
        15. Redirect-stub exclusion confirmation
        16. Recommended active-route algorithm
        17. Recommended desktop interaction model
        18. Recommended mobile interaction model
        19. Recommended Phase 4B–4F file scopes
        20. Hero and asset integrity confirmation
        21. Confirmation that nothing was committed, pushed, published or deployed

        End exactly with:
        PHASE 4A COMPLETE — NAVIGATION BASELINE AUDITED — AWAITING FOUNDER APPROVAL FOR PHASE 4B.
      </div>
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
