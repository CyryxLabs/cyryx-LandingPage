import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { InternalHero } from "../InternalHero";
import { HudLabel } from "../primitives/HudLabel";
import { SolutionDiagram } from "../solutions/SolutionDiagram";
import { SolutionMedia, type SolutionVisual } from "../solutions/SolutionMedia";
import { buildStartProjectHref, type StartContextIntent } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";

export interface DeliverablePhase {
  phase: string;
  duration: string;
  scope: string;
  outputs: readonly string[];
}

export interface ArchitectureLayer {
  name: string;
  detail: string;
}

export interface KpiMetric {
  metric: string;
  detail: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface SolutionPageProps {
  startIntent: StartContextIntent;
  eyebrow: string;
  title: string;
  directAnswer: string;
  whatItIs: string;
  whoItIsFor: readonly string[];
  whatWeBuild: readonly string[];
  howWeWork: readonly string[];
  challenges: readonly string[];
  outcomes: readonly string[];
  architecture: readonly ArchitectureLayer[];
  deliverables: readonly DeliverablePhase[];
  kpis: readonly KpiMetric[];
  relatedAnswers: readonly { label: string; href: string }[];
  visual: SolutionVisual;
  techStack?: readonly string[];
  faq?: readonly FaqItem[];
  engagementNote: string;
}

export function SolutionPage(p: SolutionPageProps) {
  const startHref = buildStartProjectHref({ source: "solutions", intent: p.startIntent });

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="cx-solution-page relative focus:outline-none"
      >
        <InternalHero
          eyebrow={`Solutions · ${p.eyebrow}`}
          title={p.title}
          body={p.directAnswer}
          primaryCta={{
            label: "Start a project",
            to: startHref,
            onClick: () =>
              trackCta({ cta: "start_project", section: "solutions", href: startHref }),
          }}
          secondaryCta={{ label: "All solutions", to: "/solutions" }}
          boundaryNote="The architecture, delivery scope, ownership, and operating responsibilities are defined against the real environment—not a predetermined tool."
          lifecycleLabel="Solution lifecycle"
          lifecycle={[
            { number: "01", label: "Problem", active: true },
            { number: "02", label: "System" },
            { number: "03", label: "Evidence" },
            { number: "04", label: "Operate" },
          ]}
          nextChapter={{
            title: "Start with the operating problem.",
            body: "The capability is shaped around the environment, the authority to act, and the evidence needed to own the result.",
          }}
        />

        <section
          data-solution-chapter="media"
          className="cx-solution-media-stage border-y border-white/10 bg-[var(--obsidian)] px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16"
        >
          <div className="mx-auto max-w-7xl">
            <SolutionMedia visual={p.visual} />
          </div>
        </section>

        <section
          data-solution-chapter="intro"
          aria-labelledby="solution-intro-heading"
          className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24 lg:px-10 lg:py-36"
        >
          <div className="lg:sticky lg:top-32 lg:self-start">
            <HudLabel>Operating context</HudLabel>
            <h2
              id="solution-intro-heading"
              className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl"
            >
              What this capability is designed to resolve.
            </h2>
          </div>
          <div>
            <p className="max-w-3xl font-display text-2xl leading-snug tracking-[-0.025em] text-[var(--silver)] sm:text-3xl">
              {p.whatItIs}
            </p>
            <div className="mt-12 border-t border-white/10 pt-8 sm:mt-16 sm:pt-10">
              <HudLabel>Who it is for</HudLabel>
              <ul className="mt-6 grid gap-5 sm:grid-cols-3">
                {p.whoItIsFor.map((item, index) => (
                  <li key={item} className="text-sm leading-relaxed text-[var(--silver-dim)]">
                    <span className="mb-3 block font-mono text-[12px] tracking-[0.2em] text-[var(--accent-glow)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          data-solution-chapter="system"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36"
        >
          <SolutionDiagram visual={p.visual} nodes={p.architecture} />
        </section>

        <section
          data-solution-chapter="limits-and-outcomes"
          className="border-y border-white/10 bg-[var(--graphite)] px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-24">
            <div>
              <HudLabel>Failure modes</HudLabel>
              <h2 className="mt-6 max-w-[18ch] font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                What the system must be designed against.
              </h2>
              <ul className="mt-8 border-t border-white/10">
                {p.challenges.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/10 py-4 text-sm leading-relaxed text-[var(--silver-dim)]"
                  >
                    <span aria-hidden="true" className="text-[var(--accent-glow)]">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:pt-20">
              <HudLabel>Outcomes</HudLabel>
              <h2 className="mt-6 max-w-[18ch] font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                What the engagement is shaped to make clearer.
              </h2>
              <ul className="mt-8 space-y-5">
                {p.outcomes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base leading-relaxed text-[var(--silver-dim)]"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-glow)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          data-solution-chapter="build-and-work"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36"
        >
          <div className="grid gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
            <div>
              <HudLabel>What we build</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
                Concrete system surfaces, not an abstract AI layer.
              </h2>
              <ul className="mt-10 space-y-5">
                {p.whatWeBuild.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-[var(--silver-dim)]"
                  >
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-glow)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <HudLabel>How we work</HudLabel>
              <ol className="mt-8 border-t border-white/10">
                {p.howWeWork.map((step, index) => (
                  <li
                    key={step}
                    className="grid gap-4 border-b border-white/10 py-7 sm:grid-cols-[4rem_1fr] sm:items-start sm:py-8"
                  >
                    <span className="font-mono text-[12px] tracking-[0.22em] text-[var(--accent-glow)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="font-display text-xl leading-snug tracking-[-0.02em] text-[var(--silver)] sm:text-2xl">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          data-solution-chapter="delivery"
          className="border-y border-white/10 bg-[var(--obsidian)] px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <HudLabel>Engagement phases</HudLabel>
              <h2 className="font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                A delivery path with explicit artifacts and ownership.
              </h2>
            </div>
            <ol className="mt-10 border-t border-white/10">
              {p.deliverables.map((deliverable, index) => (
                <li
                  key={deliverable.phase}
                  className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[4rem_0.72fr_1.28fr] sm:gap-8 sm:py-9"
                >
                  <span className="font-mono text-[12px] tracking-[0.22em] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-medium tracking-[-0.025em] text-[var(--silver)]">
                      {deliverable.phase}
                    </h3>
                    <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--steel)]">
                      {deliverable.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-[var(--silver-dim)]">
                      {deliverable.scope}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--steel)]">
                      {deliverable.outputs.map((output) => (
                        <li
                          key={output}
                          className="before:mr-2 before:text-[var(--accent-glow)] before:content-['/']"
                        >
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          data-solution-chapter="evidence"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
        >
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <HudLabel>Evidence</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
                How success is interpreted.
              </h2>
            </div>
            <dl className="grid border-t border-white/10 sm:grid-cols-2">
              {p.kpis.map((item) => (
                <div
                  key={item.metric}
                  className="border-b border-white/10 py-6 sm:px-6 sm:odd:border-r sm:odd:pl-0"
                >
                  <dt className="font-display text-xl font-medium text-[var(--silver)]">
                    {item.metric}
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          data-solution-chapter="boundary"
          className="border-y border-white/10 bg-[var(--graphite)] px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <HudLabel>Operating boundary</HudLabel>
            <div>
              <h2 className="font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                Designed for an operating life.
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--silver-dim)]">
                Cyryx connects advisory, product thinking, engineering, and operations so the system
                can be understood after the first release. Our product work on{" "}
                <Link to="/products/aexos" className="text-[var(--accent-glow)] hover:underline">
                  AEXOS
                </Link>{" "}
                informs that perspective without imposing a universal architecture on client work.
              </p>
              <p className="mt-5 max-w-3xl border-l border-[var(--accent-glow)] pl-4 text-sm leading-relaxed text-[var(--silver-dim)]">
                {p.engagementNote}
              </p>
              {p.techStack && p.techStack.length > 0 ? (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology direction">
                  {p.techStack.map((technology) => (
                    <li
                      key={technology}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--silver)]"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>

        {p.faq && p.faq.length > 0 ? (
          <section
            data-solution-chapter="faq"
            aria-labelledby="solution-faq-heading"
            className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
          >
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <div>
                <HudLabel>Questions</HudLabel>
                <h2
                  id="solution-faq-heading"
                  className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl"
                >
                  What decision-makers ask us.
                </h2>
              </div>
              <div className="border-t border-white/10">
                {p.faq.map((item, index) => (
                  <details
                    key={item.q}
                    className="group border-b border-white/10 py-5"
                    open={index === 0}
                  >
                    <summary className="cursor-pointer list-none rounded-sm font-display text-xl text-[var(--silver)] hover:text-[var(--accent-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--onyx)]">
                      <span className="mr-3 font-mono text-[12px] text-[var(--accent-glow)]">
                        Q.
                      </span>
                      {item.q}
                    </summary>
                    <p className="mt-4 max-w-3xl pl-8 text-sm leading-relaxed text-[var(--silver-dim)]">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section
          data-solution-chapter="related"
          className="border-t border-white/10 bg-[var(--obsidian)] px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <HudLabel>Continue the review</HudLabel>
              <div>
                {p.relatedAnswers.length > 0 ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {p.relatedAnswers.map((related) => (
                      <li key={related.href}>
                        <Link
                          to={related.href}
                          className="group flex items-center justify-between gap-4 border-b border-white/10 py-3 text-sm text-[var(--silver)] hover:text-[var(--accent-glow)]"
                        >
                          {related.label}
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
                  <Link
                    to={startHref}
                    onClick={() =>
                      trackCta({ cta: "start_project", section: "solutions", href: startHref })
                    }
                    className="cx-btn cx-liquid-glass inline-flex h-11 items-center gap-2 rounded-md px-5 text-[var(--silver)] hud-label"
                  >
                    Start a project
                    <span aria-hidden className="text-[var(--accent-glow)]">
                      →
                    </span>
                  </Link>
                  <Link
                    to="/solutions"
                    className="inline-flex h-11 items-center gap-2 px-3 hud-label text-[var(--silver-dim)] transition-colors hover:text-[var(--accent-glow)]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    All solutions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
