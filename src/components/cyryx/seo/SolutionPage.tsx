import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { HudLabel } from "../primitives/HudLabel";
import { GlassPanel } from "../primitives/GlassPanel";

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
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" tabIndex={-1} className="relative focus:outline-none">
        <section className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <Link to="/solutions" className="hover:text-[var(--accent-glow)]">Solutions</Link>
            <span className="mx-2 opacity-60">/</span>
            <span aria-current="page" className="text-[var(--silver)]">{p.eyebrow}</span>
          </nav>

          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">
            {p.eyebrow}
          </HudLabel>

          <h1 className="mt-4 font-display text-3xl sm:text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
            {p.title}
          </h1>

          <div className="mt-8 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-6 backdrop-blur-sm">
            <p className="text-[15px] leading-relaxed text-[var(--silver)]">{p.directAnswer}</p>
          </div>

          <Sec heading="What this is">
            <p className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">{p.whatItIs}</p>
          </Sec>

          <Sec heading="Who it's for">
            <List items={p.whoItIsFor} />
          </Sec>

          <Sec heading="What we build">
            <List items={p.whatWeBuild} />
          </Sec>

          <Sec heading="How we work">
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-relaxed text-[var(--silver-dim)] marker:text-[var(--accent-glow)]">
              {p.howWeWork.map((step, i) => <li key={i}>{step}</li>)}
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
                <li key={i} className="flex items-start gap-2 text-base leading-relaxed text-[var(--silver-dim)]">
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
                  <li key={i} className="rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_45%,transparent)] p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="hud-label text-[var(--silver)]">
                        <span className="text-[var(--accent-glow)]">0{i + 1}</span> — {d.phase}
                      </div>
                      <div className="text-xs text-[var(--silver-dim)]">{d.duration}</div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">{d.scope}</p>
                    <ul className="mt-3 space-y-1.5">
                      {d.outputs.map((o, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[var(--silver-dim)]">
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
            <Sec heading="Stack we typically ship on">
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
                Stack choices are calibrated to the client's existing infrastructure — Cyryx is not tied to a specific vendor.
              </p>
            </Sec>
          )}

          {p.kpis && p.kpis.length > 0 && (
            <Sec heading="How we measure success">
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {p.kpis.map((k, i) => (
                  <div key={i} className="rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_45%,transparent)] p-4">
                    <div className="font-display text-sm font-semibold text-[var(--silver)]">
                      {k.metric}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--silver-dim)]">{k.detail}</p>
                  </div>
                ))}
              </div>
            </Sec>
          )}

          <Sec heading="Built on Cyryx infrastructure">
            <p className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">
              Every Cyryx Solutions engagement is built on the same primitives as our flagship{" "}
              <Link to="/products/maax-studio" className="text-[var(--accent-glow)] hover:underline">MAAX Studio</Link>{" "}
              and informed by ongoing work in the{" "}
              <Link to="/research" className="text-[var(--accent-glow)] hover:underline">Cyryx Applied AI Lab</Link>:
              command gates, goal-grounded generation, mission ledgers, and explicit human review checkpoints.
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
                  <a href={r.href} className="text-sm text-[var(--silver)] hover:text-[var(--accent-glow)]">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </Sec>

          <div className="mt-16 flex flex-wrap gap-3">
            <a href="/#contact" className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label">
              Start a project
              <span aria-hidden className="text-[var(--accent-glow)]">→</span>
            </a>
            <a
              href="/solutions"
              className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All solutions
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Sec({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
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
      {items.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
  );
}