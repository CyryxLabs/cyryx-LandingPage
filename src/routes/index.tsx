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
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyryx Labs — Intelligence Infrastructure for Autonomous Execution" },
      {
        name: "description",
        content:
          "Cyryx Labs builds reasoning engines, command architecture, and secure execution frameworks for organizations deploying AI at enterprise scale.",
      },
      { property: "og:title", content: "Cyryx Labs — AI Infrastructure / Command Layer" },
      {
        property: "og:description",
        content:
          "Reasoning engines, command architecture, and secure execution frameworks for enterprise AI.",
      },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#0A0A0A" },
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
      <main id="overview" className="relative">
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
        <CommandLayerSection />
        <MAAXStudioSpotlight />
        <ProcessTimeline />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
