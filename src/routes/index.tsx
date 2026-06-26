import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Header } from "@/components/cyryx/Header";
import { Hero } from "@/components/cyryx/Hero";
import { BackgroundMonolith } from "@/components/cyryx/primitives/BackgroundMonolith";
import { CapabilityStrip } from "@/components/cyryx/CapabilityStrip";
import { Footer } from "@/components/cyryx/Footer";
import { StickyMobileCTA } from "@/components/cyryx/StickyMobileCTA";
import { PerfToggle } from "@/components/cyryx/PerfToggle";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import heroBanner from "@/assets/cyryx-hero-monolith-serene.png.asset.json";

// Below-the-fold: code-split to shrink the initial mobile bundle.
const WhyCyryx = lazy(() => import("@/components/cyryx/WhyCyryx").then(m => ({ default: m.WhyCyryx })));
const CoreCapabilities = lazy(() => import("@/components/cyryx/CoreCapabilities").then(m => ({ default: m.CoreCapabilities })));
const CommandLayerSection = lazy(() => import("@/components/cyryx/CommandLayerSection").then(m => ({ default: m.CommandLayerSection })));
const MAAXStudioSpotlight = lazy(() => import("@/components/cyryx/MAAXStudioSpotlight").then(m => ({ default: m.MAAXStudioSpotlight })));
const ProductEcosystem = lazy(() => import("@/components/cyryx/ProductEcosystem").then(m => ({ default: m.ProductEcosystem })));
const ProcessTimeline = lazy(() => import("@/components/cyryx/ProcessTimeline").then(m => ({ default: m.ProcessTimeline })));
const CTASection = lazy(() => import("@/components/cyryx/CTASection").then(m => ({ default: m.CTASection })));
const AppliedAILab = lazy(() => import("@/components/cyryx/AppliedAILab").then(m => ({ default: m.AppliedAILab })));
const WhoWeServe = lazy(() => import("@/components/cyryx/WhoWeServe").then(m => ({ default: m.WhoWeServe })));
const Ecosystem = lazy(() => import("@/components/cyryx/Ecosystem").then(m => ({ default: m.Ecosystem })));
const MetricsBand = lazy(() => import("@/components/cyryx/MetricsBand").then(m => ({ default: m.MetricsBand })));
const ContactSection = lazy(() => import("@/components/cyryx/ContactSection").then(m => ({ default: m.ContactSection })));

const SectionFallback = () => <div aria-hidden style={{ minHeight: 480 }} />;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyryx Labs — AI Products & Execution Systems for the Agentic Era" },
      {
        name: "description",
        content:
          "Cyryx Labs builds proprietary AI products, custom automation systems, and agentic workflows that turn AI into governed execution.",
      },
      { property: "og:title", content: "Cyryx Labs — AI Products & Execution Systems" },
      {
        property: "og:description",
        content:
          "Proprietary AI products, custom AI systems, and agentic workflows for the agentic era.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cyryx Labs — AI Products & Execution Systems" },
      {
        name: "twitter:description",
        content:
          "The execution layer for operational AI. AI products, agentic workflow systems, and governed execution infrastructure.",
      },
      { name: "theme-color", content: "#050607" },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: heroBanner.url,
        fetchPriority: "high",
      },
      { rel: "canonical", href: "/" },
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
              slogan: "The execution layer for operational AI.",
              foundingDate: "2024",
              industry: "Artificial Intelligence",
              areaServed: "Worldwide",
              email: "hello@cyryxlabs.com",
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
                "MAAX Runtime",
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
              name: "Cyryx Labs — AI Products & Execution Systems for the Agentic Era",
              isPartOf: { "@id": "https://cyryxlabs.com/#website" },
              about: { "@id": "https://cyryxlabs.com/#organization" },
              description:
                "Proprietary AI products, governed agentic workflows, and execution infrastructure for teams operationalizing AI.",
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://cyryxlabs.com/#maax-studio",
              name: "MAAX Studio",
              alternateName: "MAAX Studio (Runtime-first)",
              applicationCategory: "DeveloperApplication",
              applicationSubCategory: "Agentic Execution Environment",
              operatingSystem: "macOS, Windows, Linux",
              softwareRequirements: "MAAX Runtime",
              featureList: [
                "Runtime-first agentic execution",
                "Governed autonomy",
                "Local-first execution context",
                "Auditable workflow runtime",
              ],
              audience: { "@type": "Audience", audienceType: "Teams operationalizing AI" },
              creator: { "@id": "https://cyryxlabs.com/#organization" },
              publisher: { "@id": "https://cyryxlabs.com/#organization" },
              description:
                "MAAX Studio is a runtime-first agentic execution environment for operational AI, powered by the MAAX Runtime.",
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
        <CapabilityStrip />
        <Suspense fallback={<SectionFallback />}>
          <WhyCyryx />
          <CoreCapabilities />
          <ProductEcosystem />
          <MAAXStudioSpotlight />
          <CommandLayerSection />
          <AppliedAILab />
          <ProcessTimeline />
          <MetricsBand />
          <WhoWeServe />
          <Ecosystem />
          <CTASection />
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
      <StickyMobileCTA />
      <PerfToggle />
    </div>
  );
}
