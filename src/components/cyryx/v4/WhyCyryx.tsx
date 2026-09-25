import { HudLabel } from "../primitives/HudLabel";

const PRINCIPLES = [
  [
    "01",
    "Business problem before model choice",
    "We qualify the operating need before selecting AI, software, or a provider.",
  ],
  [
    "02",
    "Architecture before automation",
    "Data, authority, failure paths, and ownership are designed before execution is accelerated.",
  ],
  [
    "03",
    "AI where useful",
    "Deterministic software remains the better tool whenever predictability matters more than generation.",
  ],
  [
    "04",
    "Governance proportional to risk",
    "Approval, evidence, and cost controls are defined according to the engagement and system authority.",
  ],
  [
    "05",
    "An ownership path",
    "Access, documentation, training, licensing, and support boundaries are made explicit in the engagement.",
  ],
] as const;

export function WhyCyryx() {
  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      data-story-section
      className="relative bg-[var(--graphite)] py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal max-w-4xl">
          <HudLabel withDot>Why Cyryx Labs</HudLabel>
          <h2
            id="why-heading"
            className="mt-7 max-w-[16ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl lg:text-6xl"
          >
            Advisory, engineering, products, and research in one operating model.
          </h2>
        </div>
        <ol className="cx-stagger mt-14 border-t border-[color-mix(in_oklab,var(--silver)_16%,transparent)] sm:mt-16">
          {PRINCIPLES.map(([n, title, body]) => (
            <li
              key={n}
              className="cx-stagger-item grid gap-4 border-b border-[color-mix(in_oklab,var(--silver)_16%,transparent)] py-7 sm:grid-cols-[3rem_0.85fr_1.15fr] sm:items-start sm:gap-8 sm:py-9"
            >
              <span className="font-mono text-[12px] tracking-[0.22em] text-[var(--accent-glow)]">
                {n}
              </span>
              <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-[var(--silver)] sm:text-2xl">
                {title}
              </h3>
              <p className="max-w-xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
