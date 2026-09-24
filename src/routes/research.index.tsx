import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import { PUBLICATIONS } from "@/data/publications";
import { trackCta } from "@/lib/track-cta";

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
        title: "Applied AI Lab — Cyryx Labs",
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
        <InternalHero
          eyebrow="Applied AI Lab"
          title="Research for systems that must leave the lab."
          body="Cyryx investigates the engineering and operating questions that appear when AI is expected to support real products, workflows, and decisions. The purpose is practical: better architectures, better evidence, and clearer limits."
          primaryCta={{
            label: "View published research",
            href: "#published-research",
            onClick: () =>
              trackCta({ cta: "view_research", section: "hero", href: "#published-research" }),
          }}
          secondaryCta={{
            label: "Explore research areas",
            href: "#research-directions",
            onClick: () =>
              trackCta({ cta: "view_research", section: "hero", href: "#research-directions" }),
          }}
          boundaryNote="A publication record is not current implementation, conformance, certification, or client-outcome evidence."
          lifecycleLabel="Research discipline"
          lifecycle={[
            { number: "01", label: "Question" },
            { number: "02", label: "Method" },
            { number: "03", label: "Evidence" },
            { number: "04", label: "Limits" },
          ]}
          nextChapter={{
            title: "Evidence before presentation.",
            body: "Published work begins with a precise question and keeps its method, limitations, and public record visible.",
          }}
        />

        <section
          id="published-research"
          className="scroll-mt-24 border-b border-white/10 bg-[var(--obsidian)] px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end lg:gap-20">
              <div>
                <HudLabel withDot>Published research</HudLabel>
                <h2 className="mt-6 max-w-[13ch] font-display text-4xl tracking-[-0.045em] text-[var(--silver)] sm:text-6xl">
                  Public records, not presentation claims.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-[var(--silver-dim)]">
                Released work is listed with its public identifier, source record, publication date,
                and license so readers can verify and cite it independently.
              </p>
            </div>

            <div className="mt-12 grid gap-5">
              {PUBLICATIONS.map((publication) => (
                <article
                  key={publication.id}
                  className="cx-material-panel cx-material-panel-interactive group relative overflow-hidden rounded-xl border p-7 sm:p-10"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 88% 18%, color-mix(in oklab, var(--accent-glow) 12%, transparent), transparent 30%)",
                    }}
                  />
                  <div className="relative grid gap-10 lg:grid-cols-[1fr_0.34fr] lg:items-end">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[8px] uppercase tracking-[0.17em]">
                        <span className="text-[var(--accent-glow)]">{publication.category}</span>
                        <span className="text-[var(--silver)]">
                          Record {publication.evidence.publicationRecord.state}
                        </span>
                        <span className="text-[var(--steel)]">{publication.license}</span>
                        <span className="text-[var(--steel)]">{publication.date}</span>
                      </div>
                      <h3 className="mt-6 max-w-[24ch] font-display text-3xl font-medium leading-[1.04] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
                        {publication.title}
                      </h3>
                      <p className="mt-5 max-w-3xl line-clamp-3 text-sm leading-relaxed text-[var(--silver-dim)] sm:text-base">
                        {publication.publicSummary}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Link
                        to="/research/$slug"
                        params={{ slug: publication.slug }}
                        className="flex min-h-12 items-center justify-between rounded-md bg-[var(--silver)] px-5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--onyx)] transition hover:bg-white"
                      >
                        Read the protocol <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                      {publication.doiUrl &&
                        publication.evidence.publicationRecord.state === "verified" && (
                          <a
                            href={publication.doiUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-h-12 items-center justify-between rounded-md border border-white/15 px-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
                          >
                            DOI {publication.doi}
                            <ArrowUpRight className="h-4 w-4" aria-hidden />
                          </a>
                        )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="research-directions"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40"
        >
          <div className="cx-reveal grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <HudLabel>Research directions</HudLabel>
              <h2 className="mt-6 max-w-[12ch] font-display text-4xl tracking-[-0.045em] text-[var(--silver)] sm:text-5xl">
                Six questions behind governed AI execution.
              </h2>
            </div>
            <div className="cx-stagger grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
              {AREAS.map(([title, body], index) => (
                <article
                  key={title}
                  className="cx-material-panel cx-stagger-item min-h-64 border border-transparent p-7 sm:p-8"
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
                Explore Cyryx products{" "}
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
