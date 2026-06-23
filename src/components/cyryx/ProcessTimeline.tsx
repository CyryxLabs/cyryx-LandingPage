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
        <div className="max-w-2xl cx-reveal">
          <HudLabel withDot>How it works</HudLabel>
          <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-silver-gradient">
            A path from intent to scale.
          </h2>
        </div>

        <div className="relative mt-14 lg:mt-20">
          {/* Mobile vertical line */}
          <div
            data-timeline-line
            className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-glow)] via-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] to-transparent lg:hidden"
          />
          {/* Desktop horizontal line */}
          <div
            data-timeline-line
            className="hidden lg:block absolute left-0 right-0 top-7 h-px bg-gradient-to-r from-[var(--accent-glow)] via-[color-mix(in_oklab,var(--accent-glow)_60%,transparent)] to-transparent"
          />

          <ol className="grid gap-8 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((s) => (
              <li
                key={s.n}
                data-timeline-step
                className="relative pl-14 lg:pl-0 lg:pt-16"
              >
                <div className="absolute left-0 top-0 lg:left-0 lg:-top-2">
                  <div className="grid h-10 w-10 place-items-center rounded-full border border-[var(--accent-glow)] bg-[var(--onyx)] shadow-[0_0_16px_color-mix(in_oklab,var(--accent-glow)_50%,transparent)]">
                    <span className="hud-label text-[var(--accent-glow)]">{s.n}</span>
                  </div>
                </div>
                <h3 className="font-display text-xl lg:text-2xl font-semibold text-[var(--silver)]">
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