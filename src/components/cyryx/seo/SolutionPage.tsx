import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { HudLabel } from "../primitives/HudLabel";

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
}

export function SolutionPage(p: SolutionPageProps) {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="relative">
        <section className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <Link to="/solutions" className="hover:text-[var(--accent-glow)]">Solutions</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">{p.eyebrow}</span>
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

          <Sec heading="Built on Cyryx infrastructure">
            <p className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">
              Every Cyryx Solutions engagement is built on the same primitives as our flagship{" "}
              <Link to="/products/maax-studio" className="text-[var(--accent-glow)] hover:underline">MAAX Studio</Link>{" "}
              and informed by ongoing work in the{" "}
              <Link to="/research" className="text-[var(--accent-glow)] hover:underline">Cyryx Applied AI Lab</Link>:
              command gates, goal-grounded generation, mission ledgers, and explicit human review checkpoints.
            </p>
          </Sec>

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