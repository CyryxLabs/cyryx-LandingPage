import { HudLabel } from "../primitives/HudLabel";
import { FOUNDER } from "@/data/team";

/** "Who you'll work with". Renders only when real people are configured in data/team.ts. */
export function TeamBlock() {
  if (!FOUNDER) return null;
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      data-story-section
      className="relative bg-[var(--obsidian)] py-12 sm:py-20"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>Who you'll work with</HudLabel>
          <h2
            id="team-heading"
            className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--silver)] sm:text-5xl"
          >
            {FOUNDER.name}
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-glow)]">
            {FOUNDER.role}
          </p>
        </div>
        <div className="cx-reveal flex flex-col gap-6 sm:flex-row sm:items-start">
          {FOUNDER.photo && (
            <img
              src={FOUNDER.photo}
              alt={FOUNDER.name}
              width={160}
              height={160}
              loading="lazy"
              decoding="async"
              className="h-32 w-32 shrink-0 rounded-lg object-cover grayscale sm:h-40 sm:w-40"
            />
          )}
          <div>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              {FOUNDER.bio}
            </p>
            {FOUNDER.linkedin && (
              <a
                href={FOUNDER.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent-glow)] hover:underline"
              >
                LinkedIn profile<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
