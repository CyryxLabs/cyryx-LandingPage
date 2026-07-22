import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";
import { START_PROJECT_HREF } from "@/lib/cta";

const CARDS = [
  {
    n: "01",
    title: "AI Product Development",
    outcome: "From concept to deployable AI product foundation.",
    href: "/solutions/custom-ai-product-development",
  },
  {
    n: "02",
    title: "Workflow Automation",
    outcome: "High-cost processes replaced by governed workflows.",
    href: "/solutions/workflow-automation",
  },
  {
    n: "03",
    title: "Internal AI Agents & Copilots",
    outcome: "Agents operating inside your data and permission model.",
    href: "/solutions/internal-ai-assistants",
  },
  {
    n: "04",
    title: "AI Websites & Lead Systems",
    outcome: "AI-native intake, qualification, and routing.",
    href: "/solutions/ai-websites-lead-systems",
  },
  {
    n: "05",
    title: "AI Integrations & Infrastructure",
    outcome: "AI connected to your systems without expanding risk.",
    href: "/solutions/ai-integrations",
  },
  {
    n: "06",
    title: "AI Governance & Cost Control",
    outcome: "Authority over what your AI does and what it costs.",
    href: "/solutions/ai-governance-cost-control",
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="relative py-20 sm:py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>Solutions</HudLabel>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient">
            Systems under contract. Not hours under retainer.
          </h2>
          <p className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--silver-dim)]">
            Deliverables, acceptance criteria, ownership, licensing, support, and transition are
            defined for each engagement.
          </p>
        </div>
        <div className="cx-stagger mt-14 grid gap-5 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <Link
              key={c.title}
              to={c.href}
              className="cx-stagger-item glass-panel group flex flex-col rounded-md p-7 transition-colors hover:bg-[color-mix(in_oklab,var(--graphite)_80%,transparent)]"
            >
              <span className="hud-label text-[var(--accent-glow)]">{c.n}</span>
              <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                {c.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--silver-dim)]">
                {c.outcome}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 hud-label text-[var(--accent-glow)] group-hover:gap-3 transition-all">
                Explore <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <a
            href={START_PROJECT_HREF}
            onClick={() =>
              trackCta({ cta: "start_project", section: "solutions", href: START_PROJECT_HREF })
            }
            className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
          >
            Start a project
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
