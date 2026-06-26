import { HudLabel } from "./primitives/HudLabel";
import { CyryxMark } from "./primitives/CyryxMark";

const NODES = [
  { tag: "Company", name: "Cyryx Labs", copy: "AI technology company building proprietary products, applied AI systems, and implementation capability for the agentic era." },
  { tag: "Flagship Product", name: "MAAX Studio", copy: "Native command workbench for AI-native software execution." },
  { tag: "Implementation Arm", name: "Cyryx Solutions", copy: "AI-powered websites, workflow automation, internal assistants, integrations, and custom AI products for businesses." },
  { tag: "Research Layer", name: "Cyryx Applied AI Lab", copy: "Applied research and architecture behind Cyryx products, systems, and evaluation methods." },
  { tag: "Execution Architecture", name: "MAAX Runtime", copy: "The proprietary architecture behind missions, operators, memory, gates, evidence, delivery review, and governed execution." },
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
            Built by Cyryx Labs.<br />
            <span style={{ color: "var(--accent-glow)" }}>Powered by AI execution architecture.</span>
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