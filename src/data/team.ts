/**
 * People shown on the public site.
 *
 * Fill in `FOUNDER` to enable the "Who you'll work with" block on the
 * homepage and the founder item in the proof strip. While it is `null`,
 * nothing about people is rendered: the site never shows placeholder names.
 */
export type PublicPerson = {
  readonly name: string;
  readonly role: string;
  /** Two or three factual sentences. No unverifiable claims. */
  readonly bio: string;
  /** Path under /public, e.g. "/team/founder.webp". Optional. */
  readonly photo?: string;
  readonly linkedin?: string;
};

export const FOUNDER: PublicPerson | null = null;
