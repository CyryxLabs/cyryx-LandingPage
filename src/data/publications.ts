export type PublicationCategory =
  "Governance" | "Agentic AI" | "Token Intelligence" | "Architecture";

export type PublicationStatus = "published" | "new" | "draft";

export interface Publication {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  authors: string[];
  date: string;
  publishedAt: string;
  category: PublicationCategory;
  status: PublicationStatus;
  keywords: string[];
  abstract: string;
}

export const PUBLICATIONS: Publication[] = [];

export function getPublicationBySlug(slug: string): Publication | undefined {
  return PUBLICATIONS.find((publication) => publication.slug === slug);
}

export function hasNewPublication(withinDays = 30): boolean {
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  return PUBLICATIONS.some(
    (publication) =>
      publication.status === "new" || new Date(publication.publishedAt).getTime() >= cutoff,
  );
}
