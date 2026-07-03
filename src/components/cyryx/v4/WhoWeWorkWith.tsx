import { HudLabel } from "../primitives/HudLabel";

const AUDIENCES = [
  "Founders and product teams building AI-native products that must withstand real users and real scrutiny.",
  "Agencies and service firms converting manual delivery into governed automation.",
  "Growing companies deploying AI into operations without accepting invisible risk or unattributable cost.",
  "Technical teams that require agents, integrations, and infrastructure at production standard.",
];

export function WhoWeWorkWith() {
  return (
    <section id="who" className="relative py-14 sm:py-20 lg:py-28 bg-[var(--graphite)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>Who We Work With</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            Organizations that treat AI as infrastructure.
          </h2>
        </div>
        <ul className="cx-stagger mt-10 grid gap-4 sm:mt-14 md:grid-cols-2">
          {AUDIENCES.map((a) => (
            <li key={a} className="cx-stagger-item glass-panel rounded-md p-6 text-sm leading-relaxed text-[var(--silver-dim)]">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}