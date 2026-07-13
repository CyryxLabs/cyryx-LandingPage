import { HudLabel } from "../primitives/HudLabel";

const AUDIENCES = [
  {
    title: "Founders",
    body: "AI-native products that withstand real users and real scrutiny.",
  },
  {
    title: "Agencies",
    body: "Manual delivery converted into governed automation.",
  },
  {
    title: "Businesses",
    body: "AI in operations without invisible risk or unattributable cost.",
  },
  {
    title: "Product Teams",
    body: "Agents, integrations, and infrastructure at production standard.",
  },
];

export function WhoWeWorkWith() {
  return (
    <section id="who" className="relative py-20 sm:py-28 lg:py-40 bg-[var(--graphite)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>Who We Work With</HudLabel>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient">
            Organizations that treat AI as infrastructure.
          </h2>
        </div>
        <ul className="cx-stagger mt-14 grid gap-5 sm:mt-20 md:grid-cols-2">
          {AUDIENCES.map((a) => (
            <li key={a.title} className="cx-stagger-item glass-panel rounded-md p-7">
              <p className="font-display text-lg uppercase tracking-[0.06em] text-[var(--silver)]">
                {a.title}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">{a.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
