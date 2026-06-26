import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import architectureImg from "@/assets/cyryx-architecture.jpg";

const PRODUCTS = [
  {
    name: "MAAX Studio",
    status: "Flagship Product",
    statusTone: "accent" as const,
    copy:
      "A local-first agentic execution OS for AI-native builders. Mission control, project memory, graph-based context, command units, quality gates, mission ledgers, cost visibility, and human-governed execution.",
    cta: "Explore MAAX Studio",
    href: "/products/maax-studio",
  },
  {
    name: "Cyryx Applied AI Lab",
    status: "Research & Development",
    statusTone: "accent" as const,
    copy:
      "The applied R&D layer behind every Cyryx system — protocol design, evaluation, governance, and enterprise architecture. Where new AI products are incubated and validated before they ship.",
    cta: "Explore the Lab",
    href: "/research",
  },
];

export function ProductEcosystem() {
  return (
    <section id="products" className="relative py-14 sm:py-20 lg:py-32 bg-[var(--onyx)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl cx-reveal">
          <HudLabel withDot>Product Ecosystem</HudLabel>
          <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.06] tracking-[-0.02em] text-silver-gradient">
            An expanding AI execution ecosystem.
          </h2>
          <p className="mt-5 text-[15px] sm:text-base text-[var(--silver-dim)] max-w-2xl">
            Cyryx Labs is building a portfolio of AI products and
            infrastructure layers. The first flagship is MAAX Studio — a
            local-first agentic software execution environment for AI-native
            builders. Additional products and internal systems will emerge
            from the same applied research layer and from real client work.
          </p>
        </div>

        {/* IDE showcase figure */}
        <figure className="cx-reveal mt-10 lg:mt-14">
          <div className="relative overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--silver)_12%,transparent)] bg-[var(--graphite)] shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--accent-glow)_45%,transparent)]">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9]">
              <img
                src={architectureImg}
                alt="MAAX Studio — Cyryx Labs agentic IDE: explorer, editor, execution graph, governance gates and evaluation terminal."
                loading="lazy"
                decoding="async"
                width={1600}
                height={1008}
                className="absolute inset-0 h-full w-full object-contain sm:object-cover object-left-top"
              />
              {/* Region labels — hidden on small screens to avoid clutter, revealed from sm+ */}
              {[
                { label: "Explorer", title: "File explorer — runtime, agents, gates, evals", pos: "left-[3%] top-[14%]" },
                { label: "Editor + Tabs", title: "Multi-tab editor with syntax highlighting and minimap", pos: "left-[34%] top-[14%]" },
                { label: "Execution Graph", title: "Agentic step graph with quality / security / architecture / cost gates", pos: "right-[3%] top-[14%]" },
                { label: "Eval Terminal", title: "Terminal, problems and evaluation runs with token, latency and cost", pos: "left-[34%] bottom-[6%]" },
              ].map((r) => (
                <span
                  key={r.label}
                  title={r.title}
                  aria-label={r.title}
                  className={`hidden sm:inline-flex absolute ${r.pos} items-center gap-1.5 rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_75%,transparent)] px-2 py-1 backdrop-blur-sm hud-label text-[10px] text-[var(--accent-glow)] shadow-[0_0_12px_color-mix(in_oklab,var(--accent-glow)_25%,transparent)] transition-opacity duration-300 opacity-70 hover:opacity-100`}
                >
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_6px_var(--accent-glow)]" />
                  {r.label}
                </span>
              ))}
            </div>
          </div>
          <figcaption className="mt-3 grid gap-1 text-[11px] text-[var(--silver-dim)] sm:hidden">
            <span><span className="text-[var(--accent-glow)]">Explorer</span> · arquivos, agentes e gates</span>
            <span><span className="text-[var(--accent-glow)]">Editor</span> · abas e minimap</span>
            <span><span className="text-[var(--accent-glow)]">Execution Graph</span> · gates de qualidade</span>
            <span><span className="text-[var(--accent-glow)]">Eval Terminal</span> · tokens, latência e custo</span>
          </figcaption>
        </figure>

        <div className="cx-stagger mt-14 lg:mt-20 grid gap-4 lg:gap-6 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <article
              key={p.name}
              className="cx-stagger-item group relative flex flex-col rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_85%,transparent)] p-6 lg:p-7 backdrop-blur-sm transition hover:border-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)]"
            >
              <span
                className={
                  "hud-label " +
                  (p.statusTone === "accent"
                    ? "text-[var(--accent-glow)]"
                    : "text-[var(--silver-dim)]")
                }
              >
                {p.status}
              </span>
              <h3 className="mt-3 font-display text-xl lg:text-2xl font-semibold tracking-[-0.01em] text-[var(--silver)]">
                {p.name}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--silver-dim)]">
                {p.copy}
              </p>
              <a
                href={p.href}
                className="mt-4 inline-flex min-h-11 items-center gap-2 -mx-1 px-1 hud-label text-[var(--accent-glow)] group-hover:gap-3 transition-all"
              >
                {p.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}