import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { FinalCta, PageHero, SectionHead, StartButton } from "@/components/site/ui";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
} from "@/components/cyryx/seo/seo";
import { GUARDRAILS } from "@/data/home";

const PATH = "/company";
const TITLE = "About Cyryx Labs — US AI Systems Company";
const DESC =
  "Cyryx Labs LLC is a US technology company in Port St. Lucie, Florida. It builds AI systems, its own AI products, and runs an applied research lab.";

const PILLARS = [
  {
    name: "Solutions",
    body: "AI systems, workflow automation and integrations built for client companies, from strategy to managed operations.",
    href: "/solutions",
    cta: "See the services",
  },
  {
    name: "Products",
    body: "AI products we design and run ourselves: Onyx, an AI coworker that lives on your Windows PC, and AEXOS, an agentic orchestration framework.",
    href: "/products",
    cta: "See the products",
  },
  {
    name: "Applied AI Lab",
    body: "Research on how AI systems are controlled, measured and trusted, published as open, citable work.",
    href: "/research",
    cta: "Visit the lab",
  },
] as const;

const PRINCIPLES = [
  {
    title: "Start from the business problem",
    body: "We begin with the decision, the workflow and the constraint, not with a technology we want to use.",
  },
  {
    title: "Say it in writing",
    body: "Scope, timeline, price and acceptance checklist are agreed on paper before any work starts.",
  },
  {
    title: "Sometimes the answer is no",
    body: "If AI is the wrong tool, or the project is not worth building, we say so at the fit check.",
  },
  {
    title: "A demo is not a product",
    body: "Systems are tested on real cases, with their limits written down, before anyone depends on them.",
  },
  {
    title: "You own it",
    body: "At final payment you own the code, content and data we create for you. No lock-in.",
  },
  {
    title: "Someone answers for it",
    body: "Every system has a named owner, a way to change it and support that fits how much depends on it.",
  },
] as const;

export const Route = createFileRoute("/company")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Company", path: PATH },
      ]),
      buildOrganizationJsonLd(),
      buildWebPageJsonLd({ name: TITLE, description: DESC, path: PATH }),
    ]),
  component: CompanyPage,
});

function CompanyPage() {
  return (
    <SiteShell source="company">
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Company" }]}
        eyebrow="Company"
        title="AI is easy to buy. Making it work is the job."
        lead="Cyryx Labs LLC is a US technology company based in Port St. Lucie, Florida. We build AI systems for businesses, build AI products of our own, and publish applied research."
        aside={
          <dl style={{ display: "grid", gap: 12, margin: 0 }}>
            <div className="cy-kv">
              <dt>Legal entity</dt>
              <dd>Cyryx Labs LLC · United States</dd>
            </div>
            <div className="cy-kv">
              <dt>Based in</dt>
              <dd>Port St. Lucie, Florida</dd>
            </div>
            <div className="cy-kv">
              <dt>Serving</dt>
              <dd>United States and Latin America · English and Spanish</dd>
            </div>
          </dl>
        }
      >
        <StartButton section="hero" source="company" />
      </PageHero>

      <section className="cy-section" aria-labelledby="pillars-heading">
        <div className="cy-container">
          <SectionHead
            id="pillars-heading"
            eyebrow="What we do"
            title="Three lines of work that feed each other."
            lead="What we learn building for clients shapes our products. What the lab finds shapes both."
            split
          />
          <div className="cy-grid cy-grid--3">
            {PILLARS.map((pillar, index) => (
              <Link
                key={pillar.name}
                to={pillar.href}
                className="cy-card cy-spot"
                data-cy-reveal
                style={{ "--cy-i": index } as React.CSSProperties}
              >
                <span className="cy-card__n">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="cy-h3">{pillar.name}</h3>
                <p>{pillar.body}</p>
                <span className="cy-card__go">
                  {pillar.cta} <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="principles-heading">
        <div className="cy-container cy-split">
          <div className="cy-split__aside">
            <p className="cy-eyebrow" data-cy-reveal>
              How we work
            </p>
            <h2 id="principles-heading" className="cy-h2" data-cy-reveal>
              Six rules we do not bend.
            </h2>
            <p data-cy-reveal>
              <Link to="/engagement-model" className="cy-link">
                Read how an engagement runs <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
          <ol className="cy-rows">
            {PRINCIPLES.map((principle, index) => (
              <li key={principle.title} data-cy-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="cy-h3">{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cy-section" aria-labelledby="trust-heading">
        <div className="cy-container">
          <SectionHead
            id="trust-heading"
            eyebrow="Responsible AI"
            title="Every AI system we build stays inside limits you set."
          />
          <ul className="cy-guard">
            {GUARDRAILS.map((item) => (
              <li key={item.title} data-cy-reveal>
                <h3 className="cy-h3">{item.title}</h3>
                <p className="cy-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta source="company" />
    </SiteShell>
  );
}
