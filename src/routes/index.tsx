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
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <div className="relative">
          <BackgroundMonolith />
          <Hero />
          <Problem />
          <WhatWeBuild />
          <Solutions />
          <ResearchBand />
          <EngagementModel />
          <WhoWeWorkWith />
          <SecurityPosture />
          <WhyCyryxV4 />
          <MAAXStudioSpotlight />
          <ContactSection />
          <FinalCTA />
        </div>
      </main>
      <Footer />
      <StickyMobileCTA />
      <div className="sr-only" aria-hidden="true">
PHASE 4C EVIDENCE ADDENDUM — SHARED PRIMITIVE AND VISUAL SCOPEREAD-ONLY — NO FILE MODIFICATIONSPhase 4D is not authorized yet.Do not modify any file.==================================================1. SHARED PRIMITIVE DIFF==================================================Inspect:git diff HEAD^ -- src/components/ui/navigation-menu.tsxIf the Phase 4C implementation spans multiple automatic checkpoints, compare the exact pre-Phase-4C checkpoint with the final Phase 4C checkpoint.Report every change made to:src/components/ui/navigation-menu.tsxFor each change, provide:- Previous implementation- New implementation- Reason required- Whether it changes shared behavior- Whether it changes ARIA behavior- Whether it changes animation- Whether it changes positioning or viewport behavior- Whether existing consumers can be affectedSearch for all consumers:rg -n "components/ui/navigation-menu|NavigationMenu" src --glob "*.tsx"List every consumer and assess potential regression.If Header is the only consumer, state that with evidence.Do not modify the primitive.==================================================2. NAVIGATION MODEL DIFF==================================================Inspect the exact Phase 4C diff for:src/lib/navigation.tsReport:- Exact fields or types changed- Why HeaderDropdown required the change- Confirmation labels remained unchanged- Confirmation hrefs remained unchanged- Confirmation ordering remained unchanged- Confirmation active-route behavior remained unchanged- Result of all 27 model testsDetermine whether the change was a legitimate narrow type refinement or an unauthorized model change.==================================================3. OPEN-STATE EVIDENCE==================================================Inspect Header.tsx and HeaderDropdown.tsx.Report exact evidence for:- Controlled open-state owner- Current state type- How only one group remains open- Second-click closing- Switching between groups- Escape closing- Outside-click closing- Child-selection closing- Route-change closing- Focus behavior- Whether document-level listeners were added- Whether Radix behavior was duplicated manuallyIf route-change closing was not implemented or tested, state that explicitly.Do not fix it in this addendum.==================================================4. ACCESSIBILITY EVIDENCE==================================================Report the rendered semantics for:- Desktop nav landmark- Top-level trigger role- aria-expanded- aria-controls- Child-link role- aria-current- Focus-visible behavior- Escape handling- Reduced-motion handlingClarify whether attributes are:- Explicitly authored- Generated by Radix- Generated by TanStack LinkDo not claim an attribute exists without source or rendered-DOM evidence.==================================================5. COMPLETE VISUAL VERIFICATION==================================================Complete the missing read-only visual checks at:- 1440px- 1280px- Existing lg breakpoint boundary- Immediately below lg breakpoint- Homepage over hero- Products page- Solutions page- Research or Answers page- Company page- /startReport for each:- Header height- Logo alignment- CTA visibility- Dropdown clipping- Horizontal overflow- Layering/z-index- Active parent- Active child- Mobile/desktop duplication- Text wrapping- Solutions reading orderDo not store screenshots or evidence logs inside shipping source files.Do not modify styles during this addendum.==================================================6. TEST AND CHECKPOINT EVIDENCE==================================================Report:- Exact command used for the 20 header-dropdown assertions- Exact test count and result- Whether route-change closing was tested- Whether outside-click closing was tested- Whether keyboard opening used Enter and Space- Whether reduced motion was tested or only source-inspected- Whether axe ran with a dropdown openReport automatic checkpoint:- Hash- Message- Parent hash- Exact files included- Confirmation no unrelated file was included==================================================7. REQUIRED ADDENDUM REPORT==================================================Return:1. Addendum status2. Shared primitive exact diff3. Shared primitive consumer inventory4. Shared primitive regression assessment5. Navigation-model exact diff6. Navigation-model integrity assessment7. Controlled open-state evidence8. Route-change closing evidence9. Child-selection closing evidence10. Accessibility rendered-DOM evidence11. Reduced-motion evidence12. Complete visual verification matrix13. Header-dropdown command and result14. Interaction coverage inventory15. Axe open-menu result16. Automatic checkpoint provenance17. Confirmation that no files were modified during the addendum18. Confirmation that Phase 4D was not started19. Confirmation that nothing was pushed, published or deployed20. Remaining risksEnd exactly with:PHASE 4C ADDENDUM COMPLETE — DESKTOP NAVIGATION EVIDENCE VERIFIED — AWAITING FOUNDER APPROVAL FOR PHASE 4D.
      </div>
    </div>
  );
}
