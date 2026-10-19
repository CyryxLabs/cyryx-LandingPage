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
    slogan: "Websites, software and AI that grow your business.",
    description:
      "Cyryx Labs designs, builds and runs websites, automations, custom software and AI systems for small businesses, growing companies and enterprises across the US and Latin America. It builds its own products — AEXOS, Onyx and the ASTRA CRM — and runs an Applied AI Lab.",
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
      "Website design and development",
      "Workflow automation",
      "Custom software and MVP development",
      "AI strategy and advisory",
      "AI product engineering",
      "Agentic workflow systems",
      "AI governance and cost control",
      "AI execution systems",
      "Applied AI research",
    ],
    logo: {
      "@type": "ImageObject",
      url: absoluteSiteUrl("/cyryx-og.png"),
    },
  };
}
