import { absoluteSiteUrl, SITE_URL } from "@/lib/site-url";
import {
  buildCyryxOrganizationNode,
  CYRYX_ORGANIZATION_ID,
  CYRYX_WEBSITE_ID,
} from "@/data/seo-entities";

export interface Crumb {
  name: string;
  path: string;
}

export interface FaqQA {
  q: string;
  a: string;
}

export interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  ogType?: "website" | "article" | "product";
}

const DEFAULT_OG_IMAGE = absoluteSiteUrl("/cyryx-og.png?v=20260723-1");

/**
 * Build the standard meta + canonical entries for a route head().
 * Enforces title <60 / description <160 at dev time via console.warn.
 */
export function pageMeta(input: PageMetaInput) {
  const url = absoluteSiteUrl(input.path);
  const image = input.image ?? DEFAULT_OG_IMAGE;
  if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
    if (input.title.length >= 60) console.warn(`[seo] title ≥60 chars: ${input.title}`);
    if (input.description.length >= 160)
      console.warn(`[seo] description ≥160 chars: ${input.path}`);
  }
  return {
    meta: [
      { title: input.title },
      { name: "description", content: input.description },
      { property: "og:title", content: input.title },
      { property: "og:description", content: input.description },
      { property: "og:url", content: url },
      { property: "og:type", content: input.ogType ?? "website" },
      { property: "og:image", content: image },
      { property: "og:image:secure_url", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "Cyryx Labs" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: input.title },
      { name: "twitter:description", content: input.description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: "Cyryx Labs" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function buildBreadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteSiteUrl(c.path),
    })),
  };
}

export function buildFaqJsonLd(qas: FaqQA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: { "@type": "Answer", text: qa.a },
    })),
  };
}

export function buildServiceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    url: absoluteSiteUrl(input.path),
    provider: {
      "@type": "Organization",
      "@id": CYRYX_ORGANIZATION_ID,
      name: "Cyryx Labs",
      url: SITE_URL,
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    ...buildCyryxOrganizationNode(),
  };
}

export function buildWebPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteSiteUrl(input.path)}#webpage`,
    name: input.name,
    description: input.description,
    url: absoluteSiteUrl(input.path),
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      "@id": CYRYX_WEBSITE_ID,
      url: SITE_URL,
      name: "Cyryx Labs",
    },
    publisher: {
      "@type": "Organization",
      "@id": CYRYX_ORGANIZATION_ID,
      name: "Cyryx Labs",
      url: SITE_URL,
    },
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function buildTechArticleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  authors?: string[];
  authorType?: "Person" | "Organization";
  identifier?: string;
  license?: string;
  keywords?: string[];
}) {
  const url = absoluteSiteUrl(input.path);
  const organizationAuthor = input.authorType === "Organization";
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: input.headline,
    description: input.description,
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.identifier ? { identifier: input.identifier } : {}),
    ...(input.license ? { license: input.license } : {}),
    ...(input.keywords?.length ? { keywords: input.keywords } : {}),
    author: (input.authors ?? ["Cyryx Labs"]).map((name) => ({
      "@type": organizationAuthor ? "Organization" : "Person",
      ...(organizationAuthor ? { "@id": CYRYX_ORGANIZATION_ID } : {}),
      name,
    })),
    publisher: {
      "@type": "Organization",
      "@id": CYRYX_ORGANIZATION_ID,
      name: "Cyryx Labs",
      url: SITE_URL,
    },
  };
}

export function buildLegalPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return buildWebPageJsonLd(input);
}

export function jsonLdScript(obj: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(obj) };
}

/**
 * Compose a full head() return for a leaf page with metadata + a JSON-LD graph.
 */
export function buildHead(meta: PageMetaInput, jsonLdNodes: unknown[] = []) {
  const base = pageMeta(meta);
  return {
    meta: base.meta,
    links: base.links,
    scripts: jsonLdNodes.map((node) => jsonLdScript(node)),
  };
}
