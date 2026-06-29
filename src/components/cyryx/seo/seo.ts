const BASE = "https://cyryxlabs.com";

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

const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/pqDYh1E7STSD3pG3DZTBMfMwqsS2/social-images/social-1782497606213-ChatGPT_Image_Jun_25,_2026,_08_57_05_PM.webp";

/**
 * Build the standard meta + canonical entries for a route head().
 * Enforces title <60 / description <160 at dev time via console.warn.
 */
export function pageMeta(input: PageMetaInput) {
  const url = `${BASE}${input.path}`;
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
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: input.title },
      { name: "twitter:description", content: input.description },
      { name: "twitter:image", content: image },
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
      item: `${BASE}${c.path}`,
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
    url: `${BASE}${input.path}`,
    provider: {
      "@type": "Organization",
      name: "Cyryx Labs",
      url: BASE,
    },
    areaServed: "Worldwide",
  };
}

export function buildTechArticleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  authors?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: input.headline,
    description: input.description,
    url: `${BASE}${input.path}`,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    author: (input.authors ?? ["Cyryx Labs"]).map((name) => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: "Cyryx Labs",
      url: BASE,
    },
  };
}

export function jsonLdScript(obj: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(obj) };
}

/**
 * Compose a full head() return for a leaf page with metadata + a JSON-LD graph.
 */
export function buildHead(
  meta: PageMetaInput,
  jsonLdNodes: unknown[] = [],
) {
  const base = pageMeta(meta);
  return {
    meta: base.meta,
    links: base.links,
    scripts: jsonLdNodes.map((node) => jsonLdScript(node)),
  };
}