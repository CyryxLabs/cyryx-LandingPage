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
    slogan: "From AI opportunity to operating capability.",
    description:
      "Cyryx Labs is an AI lab and systems company that advises, builds, controls, and operates AI-enabled products and systems.",
    email: "contact@cyryxlabs.com",
    sameAs: [...CYRYX_VERIFIED_PROFILES],
    knowsAbout: [
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
