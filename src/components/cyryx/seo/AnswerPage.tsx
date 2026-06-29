import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { HudLabel } from "../primitives/HudLabel";
import type { FaqQA } from "./seo";

export interface AnswerSection {
  heading: string;
  body: string | string[];
}

export interface AnswerRelated {
  label: string;
  href: string;
}

export interface AnswerPageProps {
  /** Page slug, used for breadcrumb display only. */
  eyebrow: string;
  /** H1 — the question, rephrased as a title. */
  title: string;
  /** 40–80 word direct answer rendered immediately after the H1. */
  directAnswer: string;
  definition: string;
  whyItMatters: string | string[];
  howItWorks: string[];
  example: string;
  cyryxPerspective: string;
  metrics: string[];
  mistakes: string[];
  faqs: FaqQA[];
  related: AnswerRelated[];
}

function Paragraphs({ body }: { body: string | string[] }) {
  const items = Array.isArray(body) ? body : [body];
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">
          {p}
        </p>
      ))}
    </>
  );
}

export function AnswerPage(props: AnswerPageProps) {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="relative">
        <article className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <Link to="/answers" className="hover:text-[var(--accent-glow)]">Answers</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">{props.eyebrow}</span>
          </nav>

          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">
            Cyryx Answers
          </HudLabel>

          <h1 className="mt-4 font-display text-3xl sm:text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
            {props.title}
          </h1>

          {/* Direct answer — 40–80 words, surfaced first for AI answer engines */}
          <div className="mt-8 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-6 backdrop-blur-sm">
            <p className="text-[15px] leading-relaxed text-[var(--silver)]">
              {props.directAnswer}
            </p>
          </div>

          <Section heading="Definition"><Paragraphs body={props.definition} /></Section>
          <Section heading="Why it matters"><Paragraphs body={props.whyItMatters} /></Section>

          <Section heading="How it works">
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-relaxed text-[var(--silver-dim)] marker:text-[var(--accent-glow)]">
              {props.howItWorks.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </Section>

          <Section heading="Example"><Paragraphs body={props.example} /></Section>

          <Section heading="Cyryx perspective">
            <Paragraphs body={props.cyryxPerspective} />
            <p className="mt-4 text-sm text-[var(--silver-dim)]">
              This is the lens Cyryx Labs applies across{" "}
              <Link to="/products/maax-studio" className="text-[var(--accent-glow)] hover:underline">MAAX Studio</Link>,{" "}
              <Link to="/solutions" className="text-[var(--accent-glow)] hover:underline">Cyryx Solutions</Link>, and the{" "}
              <Link to="/research" className="text-[var(--accent-glow)] hover:underline">Cyryx Applied AI Lab</Link>.
            </p>
          </Section>

          <Section heading="Metrics to track">
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--silver-dim)] marker:text-[var(--accent-glow)]">
              {props.metrics.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </Section>

          <Section heading="Common mistakes">
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--silver-dim)] marker:text-[var(--accent-glow)]">
              {props.mistakes.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </Section>

          <Section heading="Frequently asked questions">
            <div className="mt-4 space-y-5">
              {props.faqs.map((qa, i) => (
                <div key={i}>
                  <h3 className="text-base font-semibold text-[var(--silver)]">{qa.q}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[var(--silver-dim)]">{qa.a}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section heading="Related">
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {props.related.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    className="group inline-flex items-center gap-2 text-sm text-[var(--silver)] hover:text-[var(--accent-glow)]"
                  >
                    {r.label}
                    <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <div className="mt-16">
            <a
              href="/answers"
              className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all answers
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--silver)]">
        {heading}
      </h2>
      {children}
    </section>
  );
}