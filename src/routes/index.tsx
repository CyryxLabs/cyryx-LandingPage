import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Hero } from "@/components/cyryx/Hero";
import { BackgroundMonolith } from "@/components/cyryx/primitives/BackgroundMonolith";
import { Footer } from "@/components/cyryx/Footer";
import { StickyMobileCTA } from "@/components/cyryx/StickyMobileCTA";
import { EnterpriseHomepage } from "@/components/cyryx/enterprise/EnterpriseHomepage";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import hero640 from "@/assets/cyryx-hero-monolith-v2-640.webp.asset.json";
import hero1280 from "@/assets/cyryx-hero-monolith-v2-1280.webp.asset.json";
import hero1920 from "@/assets/cyryx-hero-monolith-v2-1920.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyryx Labs — The execution layer for enterprise AI" },
      {
        name: "description",
        content:
          "Cyryx Labs advises, builds, and operates digital and AI systems for organizations moving from strategy to controlled execution.",
      },
      { property: "og:title", content: "Cyryx Labs — Enterprise AI execution systems" },
      {
        property: "og:description",
        content:
          "Advisory, digital systems, AI products, and operational infrastructure engineered for controlled execution.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://cyryxlabs.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cyryx Labs — The execution layer for enterprise AI" },
      {
        name: "twitter:description",
        content:
          "Advisory, digital systems, AI products, and operational infrastructure for controlled execution.",
      },
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
      { rel: "canonical", href: "https://cyryxlabs.com/" },
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
                "Cyryx Labs is an AI lab and systems company that advises, builds, and operates digital and AI systems for organizations moving from strategy to controlled execution.",
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
                {
                  "@type": "Offer",
                  name: "MAAX Studio",
                  itemOffered: { "@id": "https://cyryxlabs.com/#maax-studio" },
                },
              ],
              knowsAbout: [
                "Operational AI",
                "Agentic workflow systems",
                "AI execution infrastructure",
                "Governed autonomy",
                "MAAX Studio",
                "AI strategy and advisory",
                "Workflow automation",
                "AI governance and cost control",
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
              name: "Cyryx Labs — The execution layer for enterprise AI",
              isPartOf: { "@id": "https://cyryxlabs.com/#website" },
              about: { "@id": "https://cyryxlabs.com/#organization" },
              description:
                "Advisory, digital systems, AI products, and operational infrastructure for controlled execution.",
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://cyryxlabs.com/#maax-studio",
              name: "MAAX Studio",
              applicationCategory: "DeveloperApplication",
              applicationSubCategory: "Agentic Execution Environment",
              operatingSystem: "macOS, Windows, Linux",
              featureList: [
                "Mission coordination",
                "Agent coordination",
                "Project context",
                "Review and controlled execution",
              ],
              audience: { "@type": "Audience", audienceType: "Software teams" },
              creator: { "@id": "https://cyryxlabs.com/#organization" },
              publisher: { "@id": "https://cyryxlabs.com/#organization" },
              description:
                "MAAX Studio is an agentic software execution environment in active development.",
              brand: { "@id": "https://cyryxlabs.com/#organization" },
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
      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        className="relative z-10 focus:outline-none"
      >
        <Hero />
        <EnterpriseHomepage />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
