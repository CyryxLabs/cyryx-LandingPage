import { Link } from "@tanstack/react-router";
import { getService, SERVICE_BY_SLUG, type Service } from "@/data/services";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
  buildWebPageJsonLd,
} from "@/components/cyryx/seo/seo";
import { MARKET_REVIEWED } from "@/data/market";
import { GUARDRAILS } from "@/data/home";
import { SiteShell } from "./SiteShell";
import { Faq, FinalCta, PageHero, SectionHead, ServiceIcon, SourceNote, StartButton } from "./ui";

/** Route options for a service page: `createFileRoute(path)(serviceRoute(slug))`. */
export function serviceRoute(slug: string) {
  const service = getService(slug);
  return {
    head: () =>
      buildHead(
        { title: service.metaTitle, description: service.metaDescription, path: service.path },
        [
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/solutions" },
            { name: service.name, path: service.path },
          ]),
          buildServiceJsonLd({
            name: service.name,
            serviceType: service.serviceType,
            description: service.metaDescription,
            path: service.path,
          }),
          buildWebPageJsonLd({
            name: service.metaTitle,
            description: service.metaDescription,
            path: service.path,
            dateModified: MARKET_REVIEWED,
          }),
          buildFaqJsonLd(service.faq.map((item) => ({ q: item.q, a: item.a }))),
        ],
      ),
    component: () => <ServicePage service={service} />,
  };
}

export function ServicePage({ service }: { service: Service }) {
  const related = service.related.map((slug) => SERVICE_BY_SLUG[slug]).filter(Boolean);
  return (
    <SiteShell source="solutions" intent={service.intent}>
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: service.name },
        ]}
        eyebrow={`${service.stage} · ${service.name}`}
        title={service.h1}
        lead={service.cardLine}
        aside={
          <dl style={{ display: "grid", gap: 12, margin: 0 }}>
            <div className="cy-kv">
              <dt>Usually starts with</dt>
              <dd>{service.startsWith}</dd>
            </div>
            <div className="cy-kv">
              <dt>Timeline</dt>
              <dd>{service.timeline}</dd>
            </div>
            <div className="cy-kv">
              <dt>Price</dt>
              <dd>Fixed, agreed in writing before work starts</dd>
            </div>
          </dl>
        }
      >
        <StartButton section="hero" source="solutions" intent={service.intent} />
        <a href="#what-you-get" className="cy-btn cy-btn--ghost">
          See what you get
        </a>
      </PageHero>

      <section className="cy-section cy-section--tight" aria-labelledby="answer-heading">
        <div className="cy-container cy-split">
          <div className="cy-split__aside">
            <p className="cy-eyebrow" data-cy-reveal>
              In short
            </p>
            <h2 id="answer-heading" className="cy-h2" data-cy-reveal>
              What it is
            </h2>
          </div>
          <div style={{ display: "grid", gap: 28 }}>
            <p className="cy-answer" data-cy-reveal>
              {service.answer}
            </p>
            {service.stat ? (
              <div className="cy-bigstat" data-cy-reveal>
                <b>{service.stat.value}</b>
                <p style={{ color: "var(--cy-ink)" }}>{service.stat.text}</p>
                <SourceNote id={service.stat.source} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="problem-heading">
        <div className="cy-container">
          <SectionHead
            id="problem-heading"
            eyebrow="The problem"
            title="If this sounds familiar, it is fixable."
          />
          <ul className="cy-grid cy-grid--3">
            {service.problems.map((problem, index) => (
              <li
                key={problem}
                className="cy-card cy-spot"
                data-cy-reveal
                style={{ "--cy-i": index } as React.CSSProperties}
              >
                <span className="cy-card__n">{String(index + 1).padStart(2, "0")}</span>
                <p style={{ fontSize: "1.075rem", color: "var(--cy-ink)" }}>{problem}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="what-you-get" className="cy-section" aria-labelledby="deliver-heading">
        <div className="cy-container cy-split">
          <div className="cy-split__aside">
            <p className="cy-eyebrow" data-cy-reveal>
              What you get
            </p>
            <h2 id="deliver-heading" className="cy-h2" data-cy-reveal>
              Delivered, tested and yours.
            </h2>
            <p className="cy-lead" data-cy-reveal>
              Each item below is written into your plan and checked off before the project is called
              finished.
            </p>
            <div data-cy-reveal>
              <StartButton section="solutions" source="solutions" intent={service.intent} />
            </div>
          </div>
          <ol className="cy-rows">
            {service.deliver.map((item, index) => (
              <li
                key={item.title}
                data-cy-reveal
                style={{ "--cy-i": index } as React.CSSProperties}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="cy-h3">{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="steps-heading">
        <div className="cy-container cy-process">
          <div className="cy-process__aside">
            <p className="cy-eyebrow" data-cy-reveal>
              How it works
            </p>
            <h2 id="steps-heading" className="cy-h2" data-cy-reveal>
              Four steps, nothing hidden.
            </h2>
            <div className="cy-guarantee" data-cy-reveal>
              <strong>The acceptance checklist</strong>
              <p>
                The project is finished when it passes the checklist we agreed in writing, not
                before. We don&apos;t guarantee traffic, rankings or revenue. We guarantee what we
                agreed to build.
              </p>
            </div>
          </div>
          <ol className="cy-process__steps">
            {service.steps.map((step, index) => (
              <li key={step.title} className="cy-pstep" data-cy-reveal>
                <div className="cy-pstep__meta">
                  <span>Step {String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="cy-h3">{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cy-section" aria-labelledby="examples-heading">
        <div className="cy-container">
          <SectionHead
            id="examples-heading"
            eyebrow="What it looks like"
            title="The same service, sized to your company."
            lead="Examples of what this work typically covers. Your scope is set in your own written plan."
            split
          />
          <ul className="cy-grid cy-grid--3">
            {service.examples.map((example, index) => (
              <li
                key={example.who}
                className="cy-card cy-spot"
                data-cy-reveal
                style={{ "--cy-i": index } as React.CSSProperties}
              >
                <span className="cy-product__cat">{example.who}</span>
                <p style={{ fontSize: "1.075rem", color: "var(--cy-ink)" }}>{example.text}</p>
              </li>
            ))}
          </ul>
          <ul
            className="cy-guard"
            style={{ marginTop: 16 }}
            aria-label="How AI is kept under control"
          >
            {GUARDRAILS.map((item) => (
              <li key={item.title} data-cy-reveal>
                <h3 className="cy-h3">{item.title}</h3>
                <p className="cy-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="faq-heading">
        <div className="cy-container cy-split">
          <div className="cy-split__aside">
            <p className="cy-eyebrow" data-cy-reveal>
              Questions
            </p>
            <h2 id="faq-heading" className="cy-h2" data-cy-reveal>
              Asked before every project.
            </h2>
          </div>
          <Faq items={service.faq} idPrefix={`faq-${service.slug}`} />
        </div>
      </section>

      <section className="cy-section cy-section--tight" aria-labelledby="related-heading">
        <div className="cy-container">
          <SectionHead id="related-heading" eyebrow="Related" title="Often built together." />
          <div className="cy-grid cy-grid--3">
            {related.map((item, index) => (
              <Link
                key={item.slug}
                to={item.path}
                className="cy-card cy-spot"
                data-cy-reveal
                style={{ "--cy-i": index } as React.CSSProperties}
              >
                <ServiceIcon name={item.icon} />
                <h3 className="cy-h3">{item.name}</h3>
                <p className="cy-muted">{item.cardLine}</p>
                <span className="cy-card__go">
                  Learn more <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta source="solutions" intent={service.intent} />
    </SiteShell>
  );
}
