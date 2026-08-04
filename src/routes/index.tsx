import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Header } from "@/components/cyryx/Header";
import { Hero } from "@/components/cyryx/Hero";
import { Footer } from "@/components/cyryx/Footer";
import { StickyMobileCTA } from "@/components/cyryx/StickyMobileCTA";
import { StoryChapter, StoryProgress } from "@/components/cyryx/StoryChapter";
import { MAAXStudioSpotlight } from "@/components/cyryx/MAAXStudioSpotlight";
import { ExecutionGap } from "@/components/cyryx/v4/ExecutionGap";
import { SecurityPosture } from "@/components/cyryx/v4/SecurityPosture";
import { OperatingModel } from "@/components/cyryx/v4/OperatingModel";
import { ControlledExecution } from "@/components/cyryx/v4/ControlledExecution";
import { EvidenceBeforeClaims } from "@/components/cyryx/v4/EvidenceBeforeClaims";
import { CompactStart } from "@/components/cyryx/v4/CompactStart";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import heroPoster960 from "@/assets/cyryx-hero-poster-960.webp";
import heroPoster1920 from "@/assets/cyryx-hero-poster-1920.webp";
import brandMark from "@/assets/cyryx-brand-mark.png";

const HOME_URL = "https://cyryxlabs.com/";
const HOME_TITLE = "Cyryx Labs — AI Systems from Strategy to Operations";
const HOME_DESCRIPTION =
  "Cyryx Labs helps organizations Advise, Build, Control, and Operate AI-enabled systems through individual capabilities or connected, evidence-led programs.";
const HOME_SOCIAL_IMAGE = "https://cyryxlabs.com/cyryx-og.png?v=20260723-1";

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
      { property: "og:image:secure_url", content: HOME_SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "Cyryx Labs" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
      { name: "twitter:image", content: HOME_SOCIAL_IMAGE },
      { name: "twitter:image:alt", content: "Cyryx Labs" },
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
                "Cyryx Labs is an AI lab and systems company. Client work can enter through Advise, Build, Control, or Operate as individual capabilities or a connected evidence-led program; Cyryx products and Applied Research remain distinct.",
              slogan: "From AI opportunity to operating capability.",
              industry: "Artificial Intelligence",
              email: "contact@cyryxlabs.com",
              knowsAbout: [
                "AI strategy and advisory",
                "Agentic workflow systems",
                "AI execution infrastructure",
                "AI governance and operations",
                "MAAX Studio",
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
              name: HOME_TITLE,
              isPartOf: {
                "@id": "https://cyryxlabs.com/#website",
              },
              about: {
                "@id": "https://cyryxlabs.com/#organization",
              },
              description:
                "Cyryx Labs helps organizations Advise, Build, Control, and Operate AI-enabled systems through individual capabilities or connected, evidence-led programs.",
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

  useEffect(() => {
    let cancelled = false;
    let secondFrame = 0;

    const scrollToCurrentHash = () => {
      if (cancelled || !window.location.hash) return;
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      const root = document.documentElement;
      const body = document.body;
      const rootBehavior = root.style.scrollBehavior;
      const bodyBehavior = body.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      body.style.scrollBehavior = "auto";
      const headerOffset = window.innerWidth >= 1024 ? 96 : 64;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
      requestAnimationFrame(() => {
        root.style.scrollBehavior = rootBehavior;
        body.style.scrollBehavior = bodyBehavior;
      });
    };

    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(scrollToCurrentHash);
    });
    void document.fonts?.ready.then(scrollToCurrentHash).catch(() => {});
    window.addEventListener("hashchange", scrollToCurrentHash);

    return () => {
      cancelled = true;
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
      window.removeEventListener("hashchange", scrollToCurrentHash);
    };
  }, []);

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)] selection:bg-[var(--accent-glow)] selection:text-[var(--onyx)]">
      <StickyMobileCTA />
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <div className="cx-story relative" data-story-root>
          <StoryProgress />
          <StoryChapter index="01" label="The execution gap">
            <ExecutionGap />
          </StoryChapter>
          <StoryChapter index="02" label="Controlled execution">
            <ControlledExecution />
          </StoryChapter>
          <StoryChapter index="03" label="Ways to engage">
            <OperatingModel />
          </StoryChapter>
          <StoryChapter index="04" label="Control and product">
            <SecurityPosture />
            <MAAXStudioSpotlight />
          </StoryChapter>
          <StoryChapter index="05" label="Evidence and decision">
            <EvidenceBeforeClaims />
            <CompactStart />
          </StoryChapter>
        </div>
      </main>
      <Footer />
    </div>
  );
}
