import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Hero } from "@/components/cyryx/Hero";
import { BackgroundMonolith } from "@/components/cyryx/primitives/BackgroundMonolith";
import { CapabilityStrip } from "@/components/cyryx/CapabilityStrip";
import { WhyCyryx } from "@/components/cyryx/WhyCyryx";
import { CoreCapabilities } from "@/components/cyryx/CoreCapabilities";
import { CommandLayerSection } from "@/components/cyryx/CommandLayerSection";
import { MAAXStudioSpotlight } from "@/components/cyryx/MAAXStudioSpotlight";
import { ProductEcosystem } from "@/components/cyryx/ProductEcosystem";
import { ProcessTimeline } from "@/components/cyryx/ProcessTimeline";
import { CTASection } from "@/components/cyryx/CTASection";
import { Footer } from "@/components/cyryx/Footer";
import { AppliedAILab } from "@/components/cyryx/AppliedAILab";
import { WhoWeServe } from "@/components/cyryx/WhoWeServe";
import { Ecosystem } from "@/components/cyryx/Ecosystem";
import { MetricsBand } from "@/components/cyryx/MetricsBand";
import { ContactSection } from "@/components/cyryx/ContactSection";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import heroBanner from "@/assets/cyryx-hero-monolith-serene.png.asset.json";

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
      </main>
      <Footer />
    </div>
  );
}
