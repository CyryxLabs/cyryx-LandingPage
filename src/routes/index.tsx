import { useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/cyryx/Header";
import { Hero } from "@/components/cyryx/Hero";
import { BackgroundMonolith } from "@/components/cyryx/primitives/BackgroundMonolith";
import { Footer } from "@/components/cyryx/Footer";
import { StickyMobileCTA } from "@/components/cyryx/StickyMobileCTA";
import { MAAXStudioSpotlight } from "@/components/cyryx/MAAXStudioSpotlight";
import { ContactSection } from "@/components/cyryx/ContactSection";
import { ExecutionGap } from "@/components/cyryx/v4/ExecutionGap";
import { SecurityPosture } from "@/components/cyryx/v4/SecurityPosture";
import { OperatingModel } from "@/components/cyryx/v4/OperatingModel";
import { BusinessOutcomes } from "@/components/cyryx/v4/BusinessOutcomes";
import { Capabilities } from "@/components/cyryx/v4/Capabilities";
import { HowWeWork } from "@/components/cyryx/v4/HowWeWork";
import { LyraSpotlight } from "@/components/cyryx/v4/LyraSpotlight";
import { ResearchBand } from "@/components/cyryx/v4/ResearchBand";
import { WhyCyryx } from "@/components/cyryx/v4/WhyCyryx";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import heroPoster960 from "@/assets/cyryx-hero-poster-960.webp";
import heroPoster1920 from "@/assets/cyryx-hero-poster-1920.webp";
import brandMark from "@/assets/cyryx-brand-mark.png";

const HOME_URL = "https://cyryxlabs.com/";
const HOME_TITLE = "Cyryx Labs — The Execution Layer for Enterprise AI";
const HOME_DESCRIPTION =
  "Cyryx Labs advises, builds, and operates governed AI systems that turn enterprise strategy into controlled execution—with ownership, evidence, and cost visibility.";
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
        href: heroPoster1920,
        imageSrcSet: `${heroPoster960} 960w, ${heroPoster1920} 1920w`,
        imageSizes: "100vw",
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
              alternateName: "Cyryx",
              url: "https://cyryxlabs.com/",
              description:
                "Cyryx Labs is an AI lab and systems company that advises, builds, and operates governed AI systems for organizations moving from strategy to controlled execution.",
              slogan: "The execution layer for enterprise AI.",
              industry: "Artificial Intelligence",
              email: "contact@cyryxlabs.com",
              knowsAbout: [
                "AI strategy and advisory",
                "Agentic workflow systems",
                "AI execution infrastructure",
                "AI governance and operations",
                "MAAX Studio",
                "Lyra",
              ],
              logo: {
                "@type": "ImageObject",
                url: new URL(brandMark, HOME_URL).href,
                width: "320",
                height: "512",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://cyryxlabs.com/#website",
              url: "https://cyryxlabs.com/",
              name: "Cyryx Labs",
              publisher: {
                "@id": "https://cyryxlabs.com/#organization",
              },
            },
            {
              "@type": "WebPage",
              "@id": "https://cyryxlabs.com/#webpage",
              url: "https://cyryxlabs.com/",
              name: "Cyryx Labs — The Execution Layer for Enterprise AI",
              isPartOf: {
                "@id": "https://cyryxlabs.com/#website",
              },
              about: {
                "@id": "https://cyryxlabs.com/#organization",
              },
              description:
                "Cyryx Labs advises, builds, and operates governed AI systems that turn enterprise strategy into controlled execution—with ownership, evidence, and cost visibility.",
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://cyryxlabs.com/#maax-studio",
              name: "MAAX Studio",
              applicationCategory: "DeveloperApplication",
              applicationSubCategory: "Agentic Execution Environment",
              audience: {
                "@type": "Audience",
                audienceType: "Software teams evaluating an active-development environment",
              },
              creator: {
                "@id": "https://cyryxlabs.com/#organization",
              },
              publisher: {
                "@id": "https://cyryxlabs.com/#organization",
              },
              description:
                "MAAX Studio is an agentic software execution environment in active development at Cyryx Labs.",
              brand: {
                "@id": "https://cyryxlabs.com/#organization",
              },
            },
          ],
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
        Skip to content
      </a>
      <BackgroundMonolith />
      <StickyMobileCTA />
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <ExecutionGap />
        <OperatingModel />
        <Capabilities />
        <BusinessOutcomes />
        <HowWeWork />
        <SecurityPosture />
        <MAAXStudioSpotlight />
        <LyraSpotlight />
        <ResearchBand />
        <WhyCyryx />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
