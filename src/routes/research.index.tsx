import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";

const AREAS = [
  [
    "Execution architecture",
    "How AI, deterministic software, tools, state, and people coordinate across a real task.",
  ],
  [
    "Context intelligence",
    "How systems select, structure, constrain, and attribute the information used for a decision.",
  ],
  [
    "Evaluation",
    "How representative cases, human judgment, and system signals can support release and change decisions.",
  ],
  [
    "Authority & governance",
    "How action boundaries, review, escalation, evidence, and ownership become part of system design.",
  ],
  [
    "Cost intelligence",
    "How model, provider, infrastructure, and human effort can be interpreted at the workload level.",
  ],
  [
    "Human-system interaction",
    "How interfaces communicate uncertainty, evidence, control, failure, and recovery to operators.",
  ],
] as const;

const RELEASE = [
  ["Investigate", "Frame a precise question from product or system work."],
  ["Prototype", "Build the smallest instrumented environment that can produce useful evidence."],
  [
    "Evaluate",
    "Test representative behavior, failure modes, limitations, and competing explanations.",
  ],
  [
    "Integrate",
    "Feed relevant findings back into product, advisory, engineering, and operating decisions.",
  ],
  [
    "Publish selectively",
    "Release public material only after its evidence, attribution, limitations, and approval are ready.",
  ],
] as const;

export const Route = createFileRoute("/research/")({
  head: () =>
    buildHead(
      {
        title: "Applied Research — Cyryx Labs",
        description:
          "Applied research at Cyryx Labs explores AI execution architecture, context, evaluation, authority, cost, and human-system interaction.",
        path: "/research",
      },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Research", path: "/research" },
        ]),
      ],
    ),
  component: ResearchHub,
});

function ResearchHub() {
  useCyryxScrollAnimations();

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <section className="border-b border-white/10 px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <HudLabel withDot>Applied Research</HudLabel>
            <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-24">
              <h1 className="max-w-[11ch] font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-silver-gradient sm:text-6xl lg:text-8xl">
                Research for systems that must leave the lab.
              </h1>
              <p className="text-lg leading-relaxed text-[var(--silver-dim)] sm:text-xl lg:pb-2">
                Cyryx investigates the engineering and operating questions that appear when AI is
                expected to support real products, workflows, and decisions. The purpose is
                practical: better architectures, better evidence, and clearer limits.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="cx-reveal grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <HudLabel>Research directions</HudLabel>
              <h2 className="mt-6 max-w-[12ch] font-display text-4xl tracking-[-0.045em] text-[var(--silver)] sm:text-5xl">
                Six questions behind one operating system.
              </h2>
            </div>
            <div className="cx-stagger grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
              {AREAS.map(([title, body], index) => (
                <article
                  key={title}
                  className="cx-stagger-item min-h-64 bg-[var(--obsidian)] p-7 sm:p-8"
                >
                  <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-12 font-display text-2xl tracking-[-0.035em] text-[var(--silver)]">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)]">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--obsidian)] px-5 py-24 sm:px-8 sm:py-32">
          <div className="cx-reveal mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
              <div>
                <HudLabel>Research discipline</HudLabel>
                <h2 className="mt-6 font-display text-4xl tracking-[-0.045em] text-[var(--silver)] sm:text-5xl">
                  Evidence before publication.
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-[var(--silver-dim)]">
                  Public claims, publication records, identifiers, control mappings, and maturity
                  statements are withheld until the underlying evidence and release approval are
                  complete.
                </p>
              </div>
              <ol className="divide-y divide-white/10 border-y border-white/10">
                {RELEASE.map(([title, body], index) => (
                  <li
                    key={title}
                    className="grid gap-3 py-6 sm:grid-cols-[3rem_0.7fr_1.3fr] sm:gap-8"
                  >
                    <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                      0{index + 1}
                    </span>
                    <h3 className="text-sm font-medium text-[var(--silver)]">{title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--silver-dim)]">{body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 sm:py-32">
          <div className="cx-reveal mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-24">
            <div>
              <HudLabel>From research to practice</HudLabel>
              <h2 className="mt-6 max-w-[16ch] font-display text-4xl tracking-[-0.045em] text-[var(--silver)] sm:text-6xl">
                Findings matter when they improve a product or operating decision.
              </h2>
            </div>
            <div className="space-y-4">
              <Link
                to="/products"
                className="group flex items-center justify-between border-b border-white/10 py-4 text-sm text-[var(--silver-dim)] transition hover:text-[var(--accent-glow)]"
              >
                Explore MAAX Studio and Lyra{" "}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                to="/answers"
                className="group flex items-center justify-between border-b border-white/10 py-4 text-sm text-[var(--silver-dim)] transition hover:text-[var(--accent-glow)]"
              >
                Read the Cyryx Answers library{" "}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
