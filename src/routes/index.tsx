import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Header } from "@/components/cyryx/Header";
import { Hero } from "@/components/cyryx/Hero";
import { Footer } from "@/components/cyryx/Footer";
import { StickyMobileCTA } from "@/components/cyryx/StickyMobileCTA";
import { StoryChapter, StoryProgress } from "@/components/cyryx/StoryChapter";
import { ExecutionGap } from "@/components/cyryx/v4/ExecutionGap";
import { SecurityPosture } from "@/components/cyryx/v4/SecurityPosture";
import { OperatingModel } from "@/components/cyryx/v4/OperatingModel";
import { ControlledExecution } from "@/components/cyryx/v4/ControlledExecution";
import { EvidenceBeforeClaims } from "@/components/cyryx/v4/EvidenceBeforeClaims";
import { CompactStart } from "@/components/cyryx/v4/CompactStart";
import { ProofStrip } from "@/components/cyryx/v4/ProofStrip";
import { TeamBlock } from "@/components/cyryx/v4/TeamBlock";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import { absoluteSiteUrl, SITE_URL } from "@/lib/site-url";
import {
  buildCyryxOrganizationNode,
  CYRYX_ORGANIZATION_ID,
  CYRYX_WEBSITE_ID,
} from "@/data/seo-entities";

const HOME_URL = SITE_URL;
const HOME_TITLE = "Cyryx Labs — The Execution Layer for Enterprise AI";
const HOME_DESCRIPTION =
  "Cyryx Labs designs, builds and runs AI systems that act inside your workflows, with clear permissions, human approval and a record of every decision.";
const HOME_SOCIAL_IMAGE = absoluteSiteUrl("/cyryx-og.png?v=20260723-1");

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
        href: "/media/hero-sequence/desktop/cyryx-hero-frame-001.webp",
        imageSrcSet:
          "/media/hero-sequence/mobile/cyryx-hero-frame-001.webp 960w, /media/hero-sequence/desktop/cyryx-hero-frame-001.webp 1920w",
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
            buildCyryxOrganizationNode(),
            {
              "@type": "WebSite",
              "@id": CYRYX_WEBSITE_ID,
              url: HOME_URL,
              name: "Cyryx Labs",
              publisher: {
                "@id": CYRYX_ORGANIZATION_ID,
              },
            },
            {
              "@type": "WebPage",
              "@id": `${HOME_URL}#webpage`,
              url: HOME_URL,
              name: HOME_TITLE,
              isPartOf: {
                "@id": CYRYX_WEBSITE_ID,
              },
              about: {
                "@id": CYRYX_ORGANIZATION_ID,
              },
              publisher: {
                "@type": "Organization",
                "@id": CYRYX_ORGANIZATION_ID,
                name: "Cyryx Labs",
                url: HOME_URL,
              },
              description:
                "Cyryx Labs designs, builds and runs AI systems that act inside your workflows, with clear permissions, human approval and a record of every decision.",
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
        <ProofStrip />
        <div className="cx-story relative" data-story-root>
          <StoryProgress />
          <StoryChapter index="01" label="The problem">
            <ExecutionGap />
          </StoryChapter>
          <StoryChapter index="02" label="Ways to engage">
            <OperatingModel />
          </StoryChapter>
          <StoryChapter index="03" label="How it runs">
            <ControlledExecution />
          </StoryChapter>
          <StoryChapter index="04" label="What you receive">
            <EvidenceBeforeClaims />
          </StoryChapter>
          <StoryChapter index="05" label="Governance">
            <SecurityPosture />
          </StoryChapter>
          <StoryChapter index="06" label="Start">
            <TeamBlock />
            <CompactStart />
          </StoryChapter>
        </div>
      </main>
      <Footer />
    </div>
  );
}
