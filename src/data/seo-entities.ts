import { absoluteSiteUrl, SITE_URL } from "@/lib/site-url";

export const CYRYX_ORGANIZATION_ID = `${SITE_URL}#organization`;
export const CYRYX_WEBSITE_ID = `${SITE_URL}#website`;

export const CYRYX_VERIFIED_PROFILES = [
  "https://github.com/CyryxLabs",
  "https://x.com/cyryxlabs",
] as const;

export function buildCyryxOrganizationNode() {
  return {
    "@type": "Organization",
    "@id": CYRYX_ORGANIZATION_ID,
    name: "Cyryx Labs",
    legalName: "Cyryx Labs LLC",
    alternateName: "Cyryx",
    url: SITE_URL,
    slogan: "We build AI systems that do real work.",
    description:
      "Cyryx Labs builds AI systems, workflow automations and integrations for US companies of every size, and advises on where AI is worth it. It builds its own AI products, Onyx and AEXOS, and runs an Applied AI Lab that publishes research.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Port St. Lucie",
      addressRegion: "FL",
      addressCountry: "US",
    },
    areaServed: ["United States", "Latin America"],
    email: "contact@cyryxlabs.com",
    sameAs: [...CYRYX_VERIFIED_PROFILES],
    knowsAbout: [
      "AI strategy and roadmaps",
      "Workflow automation",
      "AI agents and internal assistants",
      "AI systems integration",
      "Custom AI product development",
      "AI data readiness and knowledge systems",
      "AI governance and cost control",
      "Generative engine optimization",
      "AI training and enablement",
      "Managed AI operations",
      "Applied AI research",
    ],
    logo: {
      "@type": "ImageObject",
      url: absoluteSiteUrl("/cyryx-og.png"),
    },
  };
}
