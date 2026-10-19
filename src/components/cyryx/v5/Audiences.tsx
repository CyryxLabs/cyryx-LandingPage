import { AUDIENCES } from "@/data/offer";
import { SectionHeading } from "./SectionHeading";

export function Audiences() {
  return (
    <section
      id="who-we-serve"
      aria-labelledby="who-we-serve-heading"
      data-story-section
      className="relative overflow-hidden border-y border-[color-mix(in_oklab,var(--silver)_12%,transparent)] bg-[var(--obsidian)] py-12 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          id="who-we-serve-heading"
          title="Built for companies of every size."
          lead="From a five-person firm that needs more calls to an enterprise that needs a pilot its security team can review."
        />
        <ul className="cx-stagger mt-8 grid gap-4 sm:mt-16 lg:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <li
              key={audience.id}
              className="cx-stagger-item flex flex-col rounded-xl border border-white/10 bg-[var(--graphite)] p-6 sm:p-8"
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--accent-glow)]">
                {audience.size}
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--silver)] sm:text-3xl">
                {audience.name}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                {audience.needs}
              </p>
              <dl className="mt-auto grid gap-4 border-t border-white/10 pt-5 text-[15px] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="mt-6 sm:mt-0">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
                    Usually starts with
                  </dt>
                  <dd className="mt-1.5 text-[var(--silver)]">{audience.start}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
                    Typical timeline
                  </dt>
                  <dd className="mt-1.5 text-[var(--silver)] [font-variant-numeric:tabular-nums]">
                    {audience.timeline}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
