import { useCallback } from "react";
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
                              "name": "Cyryx Labs",
                              "legalName": "Cyryx Labs",
                              "alternateName": [
                                        "Cyryx",
                                        "Cyryx AI"
                              ],
                              "url": "https://cyryxlabs.com/",
                              "description": "Cyryx Labs is an AI product and systems company building proprietary AI products, governed agentic workflow systems, and execution infrastructure.",
                              "slogan": "The execution layer for enterprise AI.",
                              "foundingDate": "2024",
                              "industry": "Artificial Intelligence",
                              "areaServed": "Worldwide",
                              "email": "contact@cyryxlabs.com",
                              "sameAs": [
                                        "https://www.linkedin.com/company/cyryx-labs",
                                        "https://x.com/cyryxlabs",
                                        "https://github.com/cyryxlabs"
                              ],
                              "makesOffer": [
                                        {
                                                  "@type": "Offer",
                                                  "name": "MAAX Studio",
                                                  "itemOffered": {
                                                            "@id": "https://cyryxlabs.com/#maax-studio"
                                                  }
                                        }
                              ],
                              "knowsAbout": [
                                        "Operational AI",
                                        "Agentic workflow systems",
                                        "AI execution infrastructure",
                                        "Governed autonomy",
                                        "MAAX Studio",
                                        "Proprietary AI products"
                              ],
                              "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://cyryxlabs.com/cyryx-mark.png",
                                        "width": "512",
                                        "height": "512"
                              }
                    },
                    {
                              "@type": "WebSite",
                              "@id": "https://cyryxlabs.com/#website",
                              "url": "https://cyryxlabs.com/",
                              "name": "Cyryx Labs",
                              "publisher": {
                                        "@id": "https://cyryxlabs.com/#organization"
                              }
                    },
                    {
                              "@type": "WebPage",
                              "@id": "https://cyryxlabs.com/#webpage",
                              "url": "https://cyryxlabs.com/",
                              "name": "Cyryx Labs — AI Products and Execution Systems for the Agentic Era",
                              "isPartOf": {
                                        "@id": "https://cyryxlabs.com/#website"
                              },
                              "about": {
                                        "@id": "https://cyryxlabs.com/#organization"
                              },
                              "description": "Cyryx Labs builds AI products, agentic workflow systems, and governed execution infrastructure for teams operationalizing AI."
                    },
                    {
                              "@type": "SoftwareApplication",
                              "@id": "https://cyryxlabs.com/#maax-studio",
                              "name": "MAAX Studio",
                              "applicationCategory": "DeveloperApplication",
                              "applicationSubCategory": "Agentic Execution Environment",
                              "operatingSystem": "macOS, Windows, Linux",
                              "featureList": [
                                        "Mission-based execution",
                                        "Project memory",
                                        "Command Gates",
                                        "Mission Ledger",
                                        "Cost visibility"
                              ],
                              "audience": {
                                        "@type": "Audience",
                                        "audienceType": "AI-native builders"
                              },
                              "creator": {
                                        "@id": "https://cyryxlabs.com/#organization"
                              },
                              "publisher": {
                                        "@id": "https://cyryxlabs.com/#organization"
                              },
                              "description": "MAAX Studio is a local-first agentic software execution environment engineered for governed autonomy.",
                              "brand": {
                                        "@id": "https://cyryxlabs.com/#organization"
                              },
                              "offers": {
                                        "@type": "Offer",
                                        "availability": "https://schema.org/PreOrder",
                                        "price": "0",
                                        "priceCurrency": "USD"
                              }
                    }
          ]
        }),
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  useCyryxScrollAnimations();

  const handleSkipToContent = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("main-content");
    if (target) {
      e.preventDefault();
      // Update URL fragment without triggering route navigation
      window.history.replaceState(null, "", "#main-content");
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)] selection:bg-[var(--accent-glow)] selection:text-[var(--onyx)]">
      <a
        href="#main-content"
        onClick={handleSkipToContent}
        className="skip-link sr-only focus:not-sr-only fixed left-4 top-4 z-[100] inline-flex h-11 items-center justify-center rounded-md px-5 bg-[var(--accent-glow)] text-[var(--onyx)] font-semibold shadow-[0_0_20px_var(--accent-glow)] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        PHASE 5C-1A — ENTERPRISE EXPERIENCE AND VISUAL ARCHITECTURE
        MODE: STRICTLY READ-ONLY.
        DO NOT MODIFY ANY FILE.
        DO NOT CREATE COMPONENTS.
        DO NOT CHANGE COPY.
        DO NOT COMMIT, PUSH, PUBLISH OR DEPLOY.
        DO NOT INJECT THIS REPORT INTO APPLICATION SOURCE.
        OBJECTIVE
        Create the complete implementation blueprint for elevating the Cyryx Labs
        homepage below the locked Hero and all primary internal page families to the
        quality of a premium enterprise web-design engagement.
        The result must feel like a website designed by a high-end agency, with:
        - cinematic visual storytelling;
        - clear enterprise credibility;
        - lower reading density;
        - stronger visual hierarchy;
        - product and system visualization;
        - progressive disclosure;
        - deliberate motion;
        - conversion architecture;
        - consistent internal-page templates.
        ABSOLUTE HERO LOCK
        Do not propose modifications to:
        - src/components/cyryx/Hero.tsx
        - src/copy/v3.ts
        - src/styles.css rules used by the Hero
        - Hero image, video, poster or responsive assets
        - Hero typography
        - Hero animations
        - Hero CTAs
        - Hero height or composition
        Redesign begins immediately below the existing Hero.
        CYRYX BUSINESS ARCHITECTURE
        The website must represent five official business arms:
        1. ADVISORY
        Full commercial name:
        Cyryx Advisory — AI, Operations & Digital Transformation Advisory
        Purpose:
        Diagnose business problems, map workflows, define strategy, design architecture,
        create governance models and produce actionable transformation roadmaps.
        Core capabilities:
        - AI Strategy & Operating Model
        - Workflow Discovery & Process Intelligence
        - Automation Opportunity Assessment
        - AI Governance & Risk Architecture
        - AI Product Strategy
        - Systems and Integration Architecture
        - AI Cost and Vendor Strategy
        - Executive AI Workshops
        - Digital Transformation Roadmaps
        - Governance Readiness Assessments
        2. SOLUTIONS & ENGINEERING
        Purpose:
        Design and build digital systems, automation and controlled AI implementations.
        Commercial pillars:
        - Digital & Web Systems
        - Workflow Automation
        - Internal AI Assistants
        - Custom AI Product Development
        - AI Governance & Cost Control
        3. MANAGED OPERATIONS
        Purpose:
        Operate, support, monitor and optimize delivered systems under engagement-defined
        responsibilities and service expectations.
        4. PROPRIETARY PRODUCTS
        Current public product inventory:
        - MAAX Studio
        - Lyra
        MAAX Studio:
        Software-development command environment designed for governed agentic
        execution.
        Maturity:
        In active development.
        Lyra:
        Private, model-agnostic intelligence and execution runtime.
        Maturity:
        Private development.
        5. APPLIED RESEARCH
        Purpose:
        Research and engineering discipline supporting reliable AI execution,
        governance, evaluation and cost discipline.
        COMMERCIAL NARRATIVE
        Use the following engagement model as a central website concept:
        ADVISE → BUILD → OPERATE
        Advise:
        Diagnose the operating problem and define the roadmap.
        Build:
        Engineer, integrate and validate the system.
        Operate:
        Support, monitor and expand the system according to the engagement.
        Products and Applied Research support all three stages.
        FUTURE PLATFORM EXTENSIBILITY
        Cyryx is planning a future enterprise operations platform, but:
        - its previous working name is retired;
        - it currently has no approved public name;
        - it must not appear in public copy;
        - it must not appear in navigation;
        - it must not receive a route;
        - it must not receive a card;
        - it must not appear in SEO or JSON-LD;
        - no capability or availability claims may be published.
        The design architecture must nevertheless remain extensible so a future
        flagship platform can later be added without redesigning the website.
        Define this extensibility only through:
        - reusable product data models;
        - flexible product-grid composition;
        - scalable navigation grouping;
        - reusable product-storytelling components;
        - adaptable structured-data architecture;
        - reserved information-architecture capability.
        Do not propose:
        - empty cards;
        - “coming soon” placeholders;
        - hidden DOM content;
        - unnamed public products;
        - disabled navigation links.
        HOMEPAGE TARGET NARRATIVE
        Develop a detailed visual storyboard for this target order:
        0. Locked Hero
        1. The Execution Gap
        2. Advise → Build → Operate
        3. Cyryx Advisory
        4. Solutions & Engineering
        5. Business Use Cases and Outcomes
        6. Product Ecosystem — MAAX Studio + Lyra
        7. Governance & Applied Research
        8. How We Work
        9. Why Cyryx
        10. Start a Project
        11. Footer
        The architecture may recommend merging adjacent sections where that produces a
        stronger and less repetitive page.
        Do not increase total homepage density.
        The homepage should contain approximately 650–900 visible words below the Hero,
        excluding form labels and accessibility text.
        HOMEPAGE VISUAL RULES
        For every section, define:
        - commercial purpose;
        - primary audience;
        - immediate visible copy;
        - visual centerpiece;
        - interaction or motion;
        - progressive-disclosure behavior;
        - CTA;
        - desktop composition;
        - mobile composition;
        - reduced-motion fallback;
        - accessibility requirements;
        - required evidence or asset.
        Avoid repeating:
        - eyebrow;
        - centered gradient headline;
        - paragraph;
        - three identical glass cards.
        The page must intentionally alternate between:
        - editorial split layouts;
        - cinematic product stages;
        - process diagrams;
        - capability matrices;
        - interface evidence;
        - horizontal narrative bands;
        - controlled asymmetric compositions;
        - concise conversion moments.
        CONTENT-DENSITY RULES
        Define enforceable rules including:
        - one primary thesis per viewport;
        - body-line length between approximately 55 and 75 characters;
        - no paragraph longer than four desktop lines without disclosure;
        - no more than three equally weighted cards visible in one composition;
        - no more than two CTA choices per section;
        - supporting details moved into accordion, tabs, drawers or dedicated pages;
        - mobile content order follows narrative priority;
        - no text smaller than the approved readable metadata scale;
        - decorative technical labels limited to one meaningful label per viewport.
        VISUAL SYSTEM DIRECTION
        Develop a “Cinematic Operational Intelligence” visual language consistent with
        Cyryx:
        - deep black and graphite foundations;
        - restrained silver typography;
        - teal reserved for action, live state and selected emphasis;
        - dimensional light rather than repeated glow blobs;
        - editorial whitespace;
        - subtle technical grids;
        - metallic details used selectively;
        - real interfaces and diagrams prioritized over decorative cards;
        - fewer borders;
        - fewer glass panels;
        - stronger scale contrast;
        - premium corporate restraint.
        Do not imitate another company directly.
        Reference patterns may be analyzed from premium enterprise product companies,
        but the resulting system must remain recognizably Cyryx.
        MOTION ARCHITECTURE
        Use the existing GSAP foundation.
        Define:
        - entrance motion;
        - scroll-linked narrative motion;
        - pinning only where it materially improves comprehension;
        - section transitions;
        - product-interface reveals;
        - diagram sequencing;
        - hover and focus feedback;
        - reduced-motion equivalents;
        - low-power/mobile fallbacks.
        Do not recommend adding another general-purpose animation library.
        WebGL, Three.js or React Three Fiber may be proposed only for one meaningful
        signature visualization and only with:
        - lazy loading;
        - static fallback;
        - reduced-motion fallback;
        - no Hero dependency;
        - strict performance budget;
        - clear business-storytelling purpose.
        INTERNAL PAGE FAMILIES
        Create page blueprints for:
        1. Advisory hub
        2. Solutions hub
        3. Individual solution detail
        4. Products hub
        5. MAAX Studio
        6. Lyra
        7. Managed Operations
        8. Engagement Model / How We Work
        9. Research hub
        10. Research article
        11. Company
        12. Careers
        13. Contact / Start a Project
        14. Legal and utility pages
        For each family, define:
        - page objective;
        - target visitor;
        - ideal section order;
        - visual rhythm;
        - reusable components;
        - evidence requirements;
        - CTA strategy;
        - maximum content density;
        - desktop and mobile behavior.
        ADVISORY PAGE BLUEPRINT
        The Advisory architecture must include:
        1. Executive positioning
        2. When organizations engage Cyryx Advisory
        3. Advisory capabilities
        4. Diagnostic methodology
        5. Tangible deliverables
        6. Advise → Build → Operate connection
        7. Example engagement structures
        8. Governance and independence principles
        9. Conversion section
        Advisory must not look like generic hourly consulting.
        It should communicate scoped outcomes such as:
        - current-state assessment;
        - workflow map;
        - prioritized opportunity register;
        - business case;
        - target architecture;
        - governance model;
        - automation portfolio;
        - implementation roadmap;
        - executive decision brief.
        INTERNAL PAGE LAYOUT CORRECTION
        Explicitly solve the current problems:
        - long single-column text walls;
        - repetitive section headers;
        - repeated glass-card grids;
        - excessive HUD labels;
        - excessive uppercase copy;
        - repeated silver gradients;
        - insufficient product evidence;
        - weak page-specific visual identity;
        - identical layouts across unrelated pages.
        Define at least four distinct reusable page-layout systems:
        A. Advisory / strategic editorial
        B. Solution / problem-to-outcome
        C. Product / interface-led
        D. Research / publication-led
        These systems must share tokens and components without looking identical.
        COMPONENT ARCHITECTURE
        Produce a proposed reusable component inventory, including examples such as:
        - EnterpriseSection
        - EditorialSplit
        - AdviseBuildOperate
        - CapabilityRail
        - OutcomeScenario
        - WorkflowDiagram
        - ProductStage
        - InterfaceFrame
        - EvidencePanel
        - GovernanceFlow
        - ResearchCitation
        - EngagementTimeline
        - CTACluster
        - DisclosurePanel
        - ResponsiveDataMatrix
        Names are proposals only. Do not create files.
        For every component, specify:
        - purpose;
        - consumers;
        - variants;
        - responsive behavior;
        - motion behavior;
        - accessibility contract;
        - future-platform extensibility.
        PERFORMANCE BUDGET
        Define measurable budgets for:
        - LCP;
        - INP;
        - CLS;
        - initial JavaScript;
        - below-fold media;
        - WebGL, if proposed;
        - font loading;
        - image formats;
        - video behavior;
        - mobile data use.
        ACCESSIBILITY
        Define requirements for:
        - landmarks;
        - heading hierarchy;
        - keyboard navigation;
        - visible focus;
        - disclosure controls;
        - motion reduction;
        - contrast;
        - 320px reflow;
        - screen-reader naming;
        - diagrams and product visuals;
        - touch targets;
        - forced-colors mode.
        REQUIRED OUTPUT
        1. Executive design diagnosis
        2. Approved business-architecture map
        3. Advise → Build → Operate narrative
        4. Final homepage storyboard
        5. Section merger recommendations
        6. Advisory page storyboard
        7. Complete internal-page family matrix
        8. Four reusable layout systems
        9. Visual token recommendations
        10. Typography hierarchy
        11. Spacing and density system
        12. Component architecture
        13. Motion architecture
        14. Signature-visual recommendation
        15. Product-evidence strategy
        16. Responsive behavior
        17. Accessibility contract
        18. Performance budget
        19. Asset requirements
        20. Future-platform extensibility plan
        21. Route and navigation recommendations
        22. Proposed implementation slices
        23. Risk register
        24. Complete inspected-file inventory
        25. Confirmation no files were modified
        26. Confirmation Hero remained untouched
        27. Confirmation the retired product name has zero public usage
        28. Confirmation Advisory is included as an official vertical
        29. Confirmation nothing was committed, pushed, published or deployed
        IMPLEMENTATION SLICES TO PROPOSE
        The report must divide future implementation into small approval gates such as:
        - 5C-1B: Tokens and foundational layout primitives
        - 5C-1C: Homepage narrative sections 1–3
        - 5C-1D: Homepage solutions and use cases
        - 5C-1E: Product ecosystem
        - 5C-1F: Governance, research and engagement
        - 5C-1G: Contact and conversion
        - 5C-2: Advisory page
        - 5C-3: Solution page system
        - 5C-4: Product page system
        - 5C-5: Research and company pages
        - 5C-6: Motion and signature visualization
        - 5C-7: Final release gate
        Do not execute any slice.
        End exactly with:
        PHASE 5C-1A COMPLETE — ENTERPRISE EXPERIENCE ARCHITECTURE DELIVERED — AWAITING FOUNDER APPROVAL.
      </a>
      <BackgroundMonolith />
      <StickyMobileCTA />
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">

        <Hero />
        <Problem />
        <MAAXStudioSpotlight />
        <WhatWeBuild />
        <Solutions />
        <EngagementModel />
        <SecurityPosture />
        <WhoWeWorkWith />
        <WhyCyryxV4 />
        <ResearchBand />
        <ContactSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
