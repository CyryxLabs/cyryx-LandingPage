import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/data/offer";
import { SectionHeading } from "./SectionHeading";

/** Plain answers to the questions buyers ask first. Mirrored in the FAQPage JSON-LD. */
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      data-story-section
      className="relative overflow-hidden border-t border-[color-mix(in_oklab,var(--silver)_12%,transparent)] bg-[var(--obsidian)] py-12 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10">
        <SectionHeading
          id="faq-heading"
          title="What people ask before they start."
          align="split"
          className="lg:block"
        />
        <div className="cx-reveal divide-y divide-white/10 border-y border-white/10">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left font-display text-lg font-medium tracking-[-0.015em] text-[var(--silver)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  className="h-4 w-4 shrink-0 text-[var(--accent-glow)] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  aria-hidden
                />
              </summary>
              <p className="pb-5 pr-10 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
