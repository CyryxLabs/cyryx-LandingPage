import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Hero } from "@/components/cyryx/Hero";
import { BackgroundMonolith } from "@/components/cyryx/primitives/BackgroundMonolith";
import { CapabilityStrip } from "@/components/cyryx/CapabilityStrip";
import { WhyCyryx } from "@/components/cyryx/WhyCyryx";
import { CoreCapabilities } from "@/components/cyryx/CoreCapabilities";
import { CommandLayerSection } from "@/components/cyryx/CommandLayerSection";
import { MAAXStudioSpotlight } from "@/components/cyryx/MAAXStudioSpotlight";
import { ProcessTimeline } from "@/components/cyryx/ProcessTimeline";
import { CTASection } from "@/components/cyryx/CTASection";
import { Footer } from "@/components/cyryx/Footer";
import { AppliedAILab } from "@/components/cyryx/AppliedAILab";
import { WhoWeServe } from "@/components/cyryx/WhoWeServe";
import { Ecosystem } from "@/components/cyryx/Ecosystem";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";

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
      { name: "theme-color", content: "#050607" },
    ],
  }),
  component: Index,
});

function Index() {
  useCyryxScrollAnimations();
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <BackgroundMonolith />
      <main id="overview" className="relative z-10">
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
        <MAAXStudioSpotlight />
        <CommandLayerSection />
        <AppliedAILab />
        <ProcessTimeline />
        <WhoWeServe />
        <Ecosystem />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
