import type { ReactNode } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { Footer } from "@/components/cyryx/Footer";
import { Header } from "@/components/cyryx/Header";
import type { SolutionContent, SolutionKey } from "./internalContent";
import { solutions } from "./internalContent";
import { TextLink } from "./SectionFrame";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="dark min-h-dvh bg-[#090a0b] text-[var(--silver)]">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="cx-interior-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function InteriorHero({
  eyebrow,
  title,
  lead,
  status,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  status?: string;
}) {
  return (
    <header className="cx-interior-hero">
      <div className="cx-interior-shell">
        <p className="cx-eyebrow">{eyebrow}</p>
        {status ? <span className="cx-interior-status">{status}</span> : null}
        <h1>{title}</h1>
        <p>{lead}</p>
        <a href="#page-content" className="cx-interior-down">
          Explore <ArrowRight aria-hidden size={16} />
        </a>
      </div>
    </header>
  );
}

export function InteriorSection({
  eyebrow,
  title,
  lead,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`cx-interior-section ${className}`}>
      <div className="cx-interior-shell">
        <div className="cx-interior-intro">
          <p className="cx-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {lead ? <p>{lead}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function SolutionDetailPage({ content }: { content: SolutionContent }) {
  return (
    <PageShell>
      <InteriorHero eyebrow={content.eyebrow} title={content.title} lead={content.promise} />
      <div id="page-content">
        <InteriorSection
          eyebrow="The operating problem"
          title="Start with the condition, not the technology."
        >
          <div className="cx-problem-outcome">
            <article>
              <span>Current condition</span>
              <p>{content.problem}</p>
            </article>
            <ArrowRight aria-hidden />
            <article>
              <span>Desired outcome</span>
              <p>{content.outcome}</p>
            </article>
          </div>
        </InteriorSection>
        <InteriorSection
          eyebrow="Questions to resolve"
          title="The engagement creates decision clarity."
        >
          <ol className="cx-question-list">
            {content.questions.map((question, index) => (
              <li key={question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {question}
              </li>
            ))}
          </ol>
        </InteriorSection>
        <InteriorSection
          eyebrow="Cyryx approach"
          title="A connected path from evidence to implementation."
        >
          <div className="cx-approach-grid">
            {content.approach.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </InteriorSection>
        <InteriorSection
          eyebrow="Representative deliverables"
          title="What the organization can receive."
          lead="The exact scope and deliverables are defined for the engagement."
        >
          <ul className="cx-deliverable-list">
            {content.deliverables.map((item) => (
              <li key={item}>
                <Check aria-hidden size={16} />
                {item}
              </li>
            ))}
          </ul>
        </InteriorSection>
        <InteriorSection
          eyebrow="Architecture & dependencies"
          title="The system works only when its dependencies are explicit."
        >
          <div className="cx-dependency-map">
            <div className="cx-dependency-core">
              Cyryx
              <br />
              engagement
            </div>
            {content.dependencies.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </InteriorSection>
        <InteriorSection
          eyebrow="Typical engagement path"
          title="A reviewable sequence, adapted to the work."
        >
          <ol className="cx-engagement-path">
            {content.path.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </InteriorSection>
        <InteriorSection eyebrow="Boundaries" title="When this solution is not the right fit.">
          <ul className="cx-boundary-list">
            {content.notFor.map((item) => (
              <li key={item}>
                <X aria-hidden size={16} />
                {item}
              </li>
            ))}
          </ul>
        </InteriorSection>
        <InteriorSection eyebrow="Related capabilities" title="The surrounding system matters.">
          <div className="cx-related-grid">
            {content.related.map((key: SolutionKey) => (
              <article key={key}>
                <p>{solutions[key].eyebrow}</p>
                <TextLink href={`/solutions/${solutions[key].slug}`}>Explore</TextLink>
              </article>
            ))}
          </div>
        </InteriorSection>
        <QualificationBand />
      </div>
    </PageShell>
  );
}

export function QualificationBand({
  title = "Bring us the workflow, bottleneck, or system.",
}: {
  title?: string;
}) {
  return (
    <section className="cx-qualification-band">
      <div className="cx-interior-shell">
        <p className="cx-eyebrow">Start a project</p>
        <h2>{title}</h2>
        <p>
          Share the current state, desired outcome, people involved, and relevant constraints. We
          will review the context and respond within one business day.
        </p>
        <a href="/start">
          Start a project <ArrowRight aria-hidden size={17} />
        </a>
      </div>
    </section>
  );
}
