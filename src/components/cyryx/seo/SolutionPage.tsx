import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { HudLabel } from "../primitives/HudLabel";
import { GlassPanel } from "../primitives/GlassPanel";
import { START_PROJECT_HREF } from "@/lib/cta";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";

export interface DeliverablePhase {
  phase: string;
  duration: string;
  scope: string;
  outputs: string[];
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
  eyebrow: string;
  title: string;
  directAnswer: string;
  whatItIs: string;
  whoItIsFor: string[];
  whatWeBuild: string[];
  howWeWork: string[];
  outcomes: string[];
  relatedAnswers: { label: string; href: string }[];
  // Optional deep-dive sections (rendered only when supplied).
  challenges?: string[];
  architecture?: ArchitectureLayer[];
  deliverables?: DeliverablePhase[];
  techStack?: string[];
  kpis?: KpiMetric[];
  faq?: FaqItem[];
  engagementNote?: string;
}

export function SolutionPage(p: SolutionPageProps) {
  useCyryxScrollAnimations();

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="relative focus:outline-none">
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:px-12 lg:pb-32 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">
              Home
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <Link to="/solutions" className="hover:text-[var(--accent-glow)]">
              Solutions
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span aria-current="page" className="text-[var(--silver)]">
              {p.eyebrow}
            </span>
          </nav>

          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">
            {p.eyebrow}
          </HudLabel>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
            <h1 className="max-w-[12ch] font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-silver-gradient sm:text-6xl lg:text-8xl">
              {p.title}
            </h1>
            <div className="border-l border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] pl-6 lg:mb-2">
              <p className="text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
                {p.directAnswer}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-24 max-w-3xl lg:mt-32">
            <Sec heading="What this is">
              <p className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">
                {p.whatItIs}
              </p>
            </Sec>

            <Sec heading="Who it's for">
              <List items={p.whoItIsFor} />
            </Sec>

            <Sec heading="What we build">
              <List items={p.whatWeBuild} />
            </Sec>

            <Sec heading="How we work">
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-relaxed text-[var(--silver-dim)] marker:text-[var(--accent-glow)]">
                {p.howWeWork.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </Sec>

            {p.challenges && p.challenges.length > 0 && (
              <Sec heading="The failure modes we design against">
                <List items={p.challenges} />
              </Sec>
            )}

            <Sec heading="Outcomes we optimize for">
              <ul className="mt-4 space-y-2">
                {p.outcomes.map((o, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-base leading-relaxed text-[var(--silver-dim)]"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-glow)]" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </Sec>

            {p.architecture && p.architecture.length > 0 && (
              <Sec heading="Reference architecture">
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {p.architecture.map((layer) => (
                    <GlassPanel key={layer.name} className="p-5">
                      <div className="text-xs uppercase tracking-[0.14em] text-[var(--accent-glow)]">
                        {layer.name}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                        {layer.detail}
                      </p>
                    </GlassPanel>
                  ))}
                </div>
              </Sec>
            )}

            {p.deliverables && p.deliverables.length > 0 && (
              <Sec heading="Engagement phases and deliverables">
                <ol className="mt-4 space-y-4">
                  {p.deliverables.map((d, i) => (
                    <li
                      key={i}
                      className="rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_45%,transparent)] p-5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="hud-label text-[var(--silver)]">
                          <span className="text-[var(--accent-glow)]">0{i + 1}</span> — {d.phase}
                        </div>
                        <div className="text-xs text-[var(--silver-dim)]">{d.duration}</div>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                        {d.scope}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {d.outputs.map((o, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-[var(--silver-dim)]"
                          >
                            <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--accent-glow)]" />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </Sec>
            )}

            {p.techStack && p.techStack.length > 0 && (
              <Sec heading="Technology direction">
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.techStack.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] px-3 py-1.5 text-xs text-[var(--silver)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-[var(--silver-dim)]">
                  Technology choices are made against the system requirements, client environment,
                  provider constraints, and operating responsibilities defined for the engagement.
                </p>
              </Sec>
            )}

            {p.kpis && p.kpis.length > 0 && (
              <Sec heading="How we measure success">
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {p.kpis.map((k, i) => (
                    <div
                      key={i}
                      className="rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_45%,transparent)] p-4"
                    >
                      <div className="font-display text-sm font-semibold text-[var(--silver)]">
                        {k.metric}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--silver-dim)]">
                        {k.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </Sec>
            )}

            <Sec heading="Designed for an operating life">
              <p className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">
                Cyryx connects advisory, product thinking, engineering, and operations so the system
                can be understood after the first release. Our product work in{" "}
                <Link
                  to="/products/maax-studio"
                  className="text-[var(--accent-glow)] hover:underline"
                >
                  MAAX Studio
                </Link>{" "}
                and{" "}
                <Link to="/products/lyra" className="text-[var(--accent-glow)] hover:underline">
                  Lyra
                </Link>{" "}
                informs that perspective without imposing a universal architecture on client work.
              </p>
            </Sec>

            {p.faq && p.faq.length > 0 && (
              <Sec heading="Questions decision-makers ask us">
                <div className="mt-4 divide-y divide-[color-mix(in_oklab,var(--silver)_10%,transparent)] rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_40%,transparent)]">
                  {p.faq.map((f, i) => (
                    <details key={i} className="group p-5" open={i === 0}>
                      <summary className="cursor-pointer list-none rounded-sm text-sm font-medium text-[var(--silver)] hover:text-[var(--accent-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--onyx)]">
                        <span className="mr-2 text-[var(--accent-glow)]">Q.</span>
                        {f.q}
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </Sec>
            )}

            {p.engagementNote && (
              <Sec heading="Engagement model">
                <p className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">
                  {p.engagementNote}
                </p>
              </Sec>
            )}

            <Sec heading="Related answers">
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {p.relatedAnswers.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      className="text-sm text-[var(--silver)] hover:text-[var(--accent-glow)]"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Sec>

            <div className="mt-16 flex flex-wrap gap-3">
              <a
                href={START_PROJECT_HREF}
                className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
              >
                Start a project
                <span aria-hidden className="text-[var(--accent-glow)]">
                  →
                </span>
              </a>
              <a
                href="/solutions"
                className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All solutions
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Sec({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="cx-reveal mt-16 border-t border-white/10 pt-8 sm:mt-20 sm:pt-10">
      <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--silver)]">
        {heading}
      </h2>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--silver-dim)] marker:text-[var(--accent-glow)]">
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
}
