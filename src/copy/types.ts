export interface CopyDocument {
  hero: {
    headline: string;
    sub: string;
    meta: string[];
    rail: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  header: {
    cta: string;
  };
  maaxSpotlight: {
    eyebrow: string;
    cta: string;
  };
  finalCta: {
    headline: string;
    headlineAccent: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    tagline: string;
  };
}