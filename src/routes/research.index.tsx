import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { FinalCta, PageHero, SectionHead } from "@/components/site/ui";
import { buildBreadcrumbJsonLd, buildHead, buildWebPageJsonLd } from "@/components/cyryx/seo/seo";
import { PUBLICATIONS } from "@/data/publications";
import { trackCta } from "@/lib/track-cta";

const PATH = "/research";
const TITLE = "Applied AI Research Lab | Cyryx Labs";
const DESC =
  "The Cyryx Labs Applied AI Lab publishes research on how AI systems are controlled, measured and trusted: articles, technical reports and studies.";

const THEMES = [
  {
    title: "Agentic execution",
    body: "How AI, ordinary software, tools and people coordinate across a real task.",
  },
  {
    title: "Governance and authority",
    body: "How limits, review, escalation and records become part of the system design.",
  },
  {
    title: "Evaluation",
    body: "How to measure whether an AI system's output is good enough to release.",
  },
  {
    title: "Context and knowledge",
    body: "How systems select and attribute the information behind each decision.",
  },
  {
    title: "Cost intelligence",
    body: "How model, infrastructure and human effort add up for a given workload.",
  },
  {
    title: "Human and AI interaction",
    body: "How interfaces show uncertainty, evidence, control and recovery to the people in charge.",
  },
] as const;

const ANSWERS = [
  { label: "What is AI governance?", href: "/answers/what-is-ai-governance" },
  { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
  {
    label: "AI execution system vs AI automation",
    href: "/answers/ai-execution-system-vs-ai-automation",
  },
  {
    label: "What are command gates in AI systems?",
    href: "/answers/what-are-command-gates-in-ai-systems",
  },
  { label: "What is goal-grounded generation?", href: "/answers/what-is-goal-grounded-generation" },
  { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
] as const;

export const Route = createFileRoute("/research/")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Research", path: PATH },
      ]),
      buildWebPageJsonLd({ name: TITLE, description: DESC, path: PATH }),
    ]),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <SiteShell source="company">
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Research" }]}
        eyebrow="Applied AI Lab"
        title="Research for AI that has to work outside the lab."
        lead="The Cyryx Labs Applied AI Lab studies the questions that appear when AI is trusted with real work, and publishes what it finds as open, citable articles and studies."
      >
        <a href="#publications" className="cy-btn cy-btn--primary">
          Read the publications
        </a>
        <Link to="/answers" className="cy-btn cy-btn--ghost">
          Browse direct answers
        </Link>
      </PageHero>

      <section id="publications" className="cy-section" aria-labelledby="publications-heading">
        <div className="cy-container">
          <SectionHead
            id="publications-heading"
            eyebrow="Publications"
            title="Published work"
            lead="Each publication keeps its method, limits and public record visible. A publication is not a claim of product implementation, conformance or certification."
            split
          />
          <div data-cy-reveal>
            {PUBLICATIONS.filter((item) => item.status !== "draft").map((publication) => (
              <article key={publication.slug} className="cy-paper">
                <span className="cy-paper__kind">{publication.category}</span>
                <div>
                  <h3 className="cy-paper__title" style={{ margin: 0 }}>
                    {publication.title}
                  </h3>
                  <p className="cy-paper__meta" style={{ marginTop: 6 }}>
                    {publication.publicSummary}
                  </p>
                  <p className="cy-paper__meta" style={{ marginTop: 6 }}>
                    {publication.subtitle} · {publication.date}
                  </p>
                </div>
                <div style={{ display: "grid", gap: 4, justifyItems: "start" }}>
                  <Link
                    to="/research/$slug"
                    params={{ slug: publication.slug }}
                    className="cy-link"
                    onClick={() =>
                      trackCta({
                        cta: "read_cgp",
                        section: "research_band",
                        href: `/research/${publication.slug}`,
                      })
                    }
                  >
                    Read the protocol <span aria-hidden="true">→</span>
                  </Link>
                  {publication.doi && publication.doiUrl ? (
                    <a
                      href={publication.doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cy-link cy-link--under"
                      style={{ fontSize: "0.875rem" }}
                    >
                      DOI {publication.doi}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <p className="cy-muted" style={{ marginTop: 20 }} data-cy-reveal>
            New articles and studies are added here as they are released.
          </p>
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="themes-heading">
        <div className="cy-container">
          <SectionHead
            id="themes-heading"
            eyebrow="What we study"
            title="Six questions behind every system we build."
            split
            lead="The lab's findings feed straight back into client work and into our products."
          />
          <ul className="cy-grid cy-grid--3">
            {THEMES.map((theme, index) => (
              <li
                key={theme.title}
                className="cy-card cy-spot"
                data-cy-reveal
                style={{ "--cy-i": index % 3 } as React.CSSProperties}
              >
                <span className="cy-card__n">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="cy-h3">{theme.title}</h3>
                <p>{theme.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cy-section" aria-labelledby="answers-heading">
        <div className="cy-container">
          <SectionHead
            id="answers-heading"
            eyebrow="Direct answers"
            title="Short explanations of the terms buyers ask about."
            split
          >
            <p>
              <Link to="/answers" className="cy-link">
                All answers <span aria-hidden="true">→</span>
              </Link>
            </p>
          </SectionHead>
          <div data-cy-reveal>
            {ANSWERS.map((answer) => (
              <Link key={answer.href} to={answer.href} className="cy-paper">
                <span className="cy-paper__kind">Answer</span>
                <span className="cy-paper__title">{answer.label}</span>
                <span className="cy-paper__meta">Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title="Have a research question or a collaboration in mind?"
        lead="Tell us the topic and the outcome you are after. Research and partnership inquiries go to the same team."
        source="company"
      />
    </SiteShell>
  );
}
