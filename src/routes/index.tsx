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
import { SecurityPosture } from "@/components/cyryx/v4/SecurityPosture";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import heroPoster960 from "@/assets/cyryx-hero-poster-960.webp";
import heroPoster1920 from "@/assets/cyryx-hero-poster-1920.webp";
import brandMark from "@/assets/cyryx-brand-mark.png";

const HOME_URL = "https://cyryxlabs.com/";
const HOME_TITLE = "Cyryx Labs — AI Systems Your Business Can Run";
const HOME_DESCRIPTION =
  "Cyryx Labs takes high-value AI initiatives from strategy to production, building governed products and workflows that teams can operate and own.";
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
              alternateName: ["Cyryx", "Cyryx AI"],
              url: "https://cyryxlabs.com/",
              description:
                "Cyryx Labs is an AI product and systems company building proprietary AI products, governed agentic workflow systems, and execution infrastructure.",
              slogan: "The command layer for AI-native builders.",
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
                {
                  "@type": "Offer",
                  name: "MAAX Studio",
                  itemOffered: {
                    "@id": "https://cyryxlabs.com/#maax-studio",
                  },
                },
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
              name: "Cyryx Labs — AI Systems Your Business Can Run",
              isPartOf: {
                "@id": "https://cyryxlabs.com/#website",
              },
              about: {
                "@id": "https://cyryxlabs.com/#organization",
              },
              description:
                "Cyryx Labs takes AI initiatives from strategy to production, building governed products and workflow systems that client teams can operate and own.",
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
              audience: {
                "@type": "Audience",
                audienceType: "AI-native builders",
              },
              creator: {
                "@id": "https://cyryxlabs.com/#organization",
              },
              publisher: {
                "@id": "https://cyryxlabs.com/#organization",
              },
              description:
                "MAAX Studio is a local-first agentic software execution environment engineered for governed autonomy.",
              brand: {
                "@id": "https://cyryxlabs.com/#organization",
              },
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/PreOrder",
                price: "0",
                priceCurrency: "USD",
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
        <Problem />
        <WhatWeBuild />
        <MAAXStudioSpotlight />
        <SecurityPosture />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
