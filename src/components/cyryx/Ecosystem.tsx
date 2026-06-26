import { HudLabel } from "./primitives/HudLabel";
import { CyryxMark } from "./primitives/CyryxMark";

const NODES = [
  { tag: "Company", name: "Cyryx Labs", copy: "AI technology company building products, execution systems, and applied research." },
  { tag: "Product Platform", name: "MAAX Studio", copy: "Command platform for AI-native software development. Missions, memory, operators, gates, cost, and human review." },
  { tag: "Business Systems", name: "Cyryx Solutions", copy: "AI systems for companies: websites, automation, assistants, integrations, and custom products." },
  { tag: "Research & Architecture", name: "Cyryx Applied AI Lab", copy: "Applied research and architecture behind Cyryx products and client systems." },
  { tag: "Execution Architecture", name: "MAAX Runtime", copy: "The execution architecture powering missions, memory, operators, and delivery." },
];

export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative py-14 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-center cx-reveal">
          <div className="flex justify-center mb-6">
            <CyryxMark size={56} />
          </div>
          <HudLabel withDot>Ecosystem</HudLabel>
          <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight text-silver-gradient uppercase">
            One company.<br />
            <span style={{ color: "var(--accent-glow)" }}>Three layers of capability.</span>
          </h2>
        </div>

        <div className="cx-stagger mt-14 lg:mt-20 grid gap-3 lg:grid-cols-5">
          {NODES.map((n, i) => (
            <article
              key={n.name}
              className="cx-stagger-item relative glass-panel rounded-md p-6"
            >
              <span className="hud-label text-[var(--accent-glow)]">{`0${i + 1}`}</span>
              <div className="mt-4 hud-label text-[var(--silver-dim)]">{n.tag}</div>
              <h3 className="mt-2 font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                {n.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{n.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}