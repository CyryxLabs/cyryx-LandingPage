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

      {/* Cinematic background visual */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[420px] overflow-hidden opacity-[0.18]">
        <img
          src={architectureImg}
          alt=""
          loading="lazy"
          decoding="async"
          width={1600}
          height={1008}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color-mix(in_oklab,var(--onyx)_60%,transparent)] to-[var(--onyx)]" />
      </div>

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