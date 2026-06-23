import { HudLabel } from "./primitives/HudLabel";

const STEPS = [
  { n: "01", title: "Design", copy: "Define objectives and architecture with our strategy and solutions team." },
  { n: "02", title: "Deploy", copy: "Launch secure, scalable systems in your environment or ours with speed." },
  { n: "03", title: "Govern", copy: "Apply policy, monitor performance, and ensure compliance at every layer." },
  { n: "04", title: "Scale", copy: "Expand capacity, add capabilities, and evolve with your mission without limits." },
];

export function ProcessTimeline() {
  return (
    <section data-timeline-section className="relative py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 cx-reveal">
          <div>
            <HudLabel withDot>Deployment Sequence</HudLabel>
            <h2 className="mt-4 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold uppercase text-silver-gradient">
              From intent to scale.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-[var(--silver-dim)]">
            Four phases. One continuous command channel. Engineered for organizations that cannot afford to stall.
          </p>
        </div>

        <div className="relative mt-16 lg:mt-24">
          {/* Mobile vertical line — anchored to the numerals */}
          <div
            data-timeline-line
            className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-glow)] via-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] to-transparent lg:hidden"
          />
          {/* Desktop horizontal line — runs through the outlined numerals */}
          <div
            data-timeline-line
            className="hidden lg:block absolute left-0 right-0 top-[60px] h-px bg-gradient-to-r from-[var(--accent-glow)] via-[color-mix(in_oklab,var(--accent-glow)_60%,transparent)] to-transparent"
          />

          <ol className="grid gap-14 lg:grid-cols-4 lg:gap-10">
            {STEPS.map((s) => (
              <li
                key={s.n}
                data-timeline-step
                className="relative pl-14 lg:pl-0"
              >
                <div className="cx-outline-num lg:mb-6">{s.n}</div>
                {/* desktop node dot on the line */}
                <span
                  aria-hidden
                  className="hidden lg:block absolute left-0 top-[54px] h-3 w-3 rounded-full bg-[var(--accent-glow)] shadow-[0_0_12px_var(--accent-glow)]"
                />
                {/* mobile node dot on the line */}
                <span
                  aria-hidden
                  className="lg:hidden absolute left-[6px] top-3 h-2.5 w-2.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_10px_var(--accent-glow)]"
                />
                <h3 className="mt-3 lg:mt-0 font-display text-xl lg:text-2xl font-semibold uppercase tracking-wider text-[var(--silver)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)] max-w-sm">
                  {s.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}