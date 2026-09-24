export interface CopyDocument {
  hero: {
    eyebrow: string;
    headline: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** Short line under the CTAs. Shown only when the AI assistant is enabled. */
    assistantNote: string;
  };
  header: {
    cta: string;
  };
  finalCta: {
    eyebrow: string;
    headline: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}
