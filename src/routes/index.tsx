import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { HeroStill, HeroStrip, useHeroVideo } from "@/components/site/HeroVideo";
import { LightField } from "@/components/site/LightField";
import { AexosShowcase, OnyxShowcase } from "@/components/site/ProductShowcase";
import { WorkflowConsole } from "@/components/site/WorkflowConsole";
import { Scorecard } from "@/components/site/Scorecard";
import {
  AskAssistant,
  Faq,
  FinalCta,
  SectionHead,
  SourceNote,
  StartButton,
  Words,
} from "@/components/site/ui";
import { ADOPTION_GAP, MARKET_REVIEWED, SEGMENTS } from "@/data/market";
import { SERVICES } from "@/data/services";
import { PUBLICATIONS } from "@/data/publications";
import { GUARDRAILS, HOME_FAQ, PROCESS_STEPS } from "@/data/home";
import { absoluteSiteUrl, SITE_URL } from "@/lib/site-url";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import {
  buildCyryxOrganizationNode,
  CYRYX_ORGANIZATION_ID,
  CYRYX_WEBSITE_ID,
} from "@/data/seo-entities";

const HOME_URL = SITE_URL;
const HOME_TITLE = "Cyryx Labs — AI Systems, Automation & Integration";
const HOME_DESCRIPTION =
  "Cyryx Labs builds AI systems, workflow automations and integrations for US companies, and makes its own AI products, Onyx and AEXOS. A human stays in control.";
const HOME_SOCIAL_IMAGE = absoluteSiteUrl("/cyryx-og.png?v=20261113-1");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: HOME_URL },
      { property: "og:image", content: HOME_SOCIAL_IMAGE },
      { property: "og:image:secure_url", content: HOME_SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "Cyryx Labs" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
      { name: "twitter:image", content: HOME_SOCIAL_IMAGE },
      { name: "twitter:image:alt", content: "Cyryx Labs" },
      { name: "theme-color", content: "#050607" },
    ],
    links: [
      { rel: "canonical", href: HOME_URL },
      // The hero picture is the largest element on the first screen.
      {
        rel: "preload",
        as: "image",
        href: "/media/hero-touch-1920.webp",
        imageSrcSet: "/media/hero-touch-1280.webp 1280w, /media/hero-touch-1920.webp 1920w",
        imageSizes: "114vw",
        media: "(min-width: 900px)",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: "/media/hero-touch-tall.webp",
        media: "(max-width: 899px)",
        fetchPriority: "high",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            buildCyryxOrganizationNode(),
            {
              "@type": "WebSite",
              "@id": CYRYX_WEBSITE_ID,
              url: HOME_URL,
              name: "Cyryx Labs",
              inLanguage: "en-US",
              publisher: {
                "@type": "Organization",
                "@id": CYRYX_ORGANIZATION_ID,
                name: "Cyryx Labs",
              },
            },
            {
              "@type": "WebPage",
              "@id": `${HOME_URL}#webpage`,
              url: HOME_URL,
              name: HOME_TITLE,
              description: HOME_DESCRIPTION,
              dateModified: MARKET_REVIEWED,
              isPartOf: { "@id": CYRYX_WEBSITE_ID },
              about: { "@id": CYRYX_ORGANIZATION_ID },
              publisher: {
                "@type": "Organization",
                "@id": CYRYX_ORGANIZATION_ID,
                name: "Cyryx Labs",
                url: HOME_URL,
              },
            },
            {
              "@type": "ItemList",
              "@id": `${HOME_URL}#services`,
              name: "Cyryx Labs services",
              itemListElement: SERVICES.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: service.name,
                url: absoluteSiteUrl(service.path),
              })),
            },
            {
              "@type": "FAQPage",
              "@id": `${HOME_URL}#faq`,
              mainEntity: HOME_FAQ.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteShell source="home">
      <LightField />
      <Hero />
      <Assurances />
      <Pillars />
      <Gap />
      <Demo />
      <Audiences />
      <Services />
      <Process />
      <Control />
      <Products />
      <Research />
      <Readiness />
      <Questions />
      <FinalCta source="home" />
    </SiteShell>
  );
}

function Hero() {
  const hostRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useHeroVideo(hostRef, videoRef);
  return (
    <section
      id="top"
      ref={hostRef}
      className="cy-cmd cy-hv"
      data-hero
      aria-labelledby="hero-heading"
    >
      <HeroStill videoRef={videoRef} />
      <div className="cy-cmd__screen">
        <div className="cy-container cy-cmd__stage">
          <div className="cy-cmd__head">
            <p className="cy-cmd__eyebrow cy-pill cy-in">Cyryx Labs · AI technology company</p>
            <h1 id="hero-heading" className="cy-cmd__title">
              <span className="cy-hero__l">
                <Words auto text="We build AI systems" />
              </span>{" "}
              <span className="cy-hero__l">
                <Words auto start={4} text="that do *real work.*" />
              </span>
            </h1>
          </div>
          <div className="cy-cmd__side">
            <p className="cy-cmd__sub cy-in" style={{ "--cy-i": 9 } as React.CSSProperties}>
              We design, build and operate AI systems, workflow automation and system integration
              for companies across the United States, with human approval, audit logs and cost
              limits built in.
            </p>
            <div className="cy-actions cy-in" style={{ "--cy-i": 11 } as React.CSSProperties}>
              <StartButton section="hero" source="home" />
              <a
                href="#services"
                data-cta="secondary"
                className="cy-cmd__more"
                onClick={() =>
                  trackCta({ cta: "see_delivery", section: "hero", href: "#services" })
                }
              >
                <span>See what we build</span>
                <i aria-hidden="true">→</i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="cy-cmd__strip cy-in" style={{ "--cy-i": 13 } as React.CSSProperties}>
        <div className="cy-container cy-cmd__striprow">
          <HeroStrip />
          <AskAssistant source="hero" label="Ask the Cyryx assistant" />
        </div>
      </div>
    </section>
  );
}

function Assurances() {
  return (
    <div className="cy-assure">
      <ul className="cy-container cy-assure__list">
        <li>Fixed scope and quote in writing</li>
        <li>Human approval on what matters</li>
        <li>You own the code and data</li>
      </ul>
    </div>
  );
}

const PILLARS = [
  {
    n: "01",
    kind: "Solutions",
    title: "We build AI into your business.",
    body: "AI systems, workflow automations and integrations, designed around the tools and rules you already have. Fixed written scope, and you own the result.",
    cta: "See the ten services",
    href: "#services",
  },
  {
    n: "02",
    kind: "Products",
    title: "We make our own AI products.",
    body: "Onyx, an AI coworker that lives on your Windows PC, and AEXOS, a framework that makes AI agents follow a method. Both are available today.",
    cta: "Meet Onyx and AEXOS",
    href: "#products",
  },
  {
    n: "03",
    kind: "Applied AI Lab",
    title: "We publish what we learn.",
    body: "Our lab studies how AI systems should be controlled, measured and trusted, and publishes the results as open, citable research.",
    cta: "Read the research",
    href: "#research",
  },
] as const;

function Pillars() {
  return (
    <section id="what-we-do" className="cy-ways" aria-labelledby="pillars-heading">
      <div className="cy-ways__media" aria-hidden="true">
        <img
          src="/media/network-aerial.webp"
          alt=""
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="cy-container cy-ways__inner">
        <div className="cy-ways__col">
          <div className="cy-ways__head" data-cy-reveal>
            <p className="cy-eyebrow">What Cyryx Labs does</p>
            <h2 id="pillars-heading" className="cy-ways__title">
              One AI company.{" "}
              <span>
                Three ways it works <em className="cy-it">for you.</em>
              </span>
            </h2>
            <p className="cy-ways__lead">
              Cyryx Labs is an applied AI company based in Florida. We build AI for other companies,
              ship products of our own, and publish the research behind both.
            </p>
          </div>
          <ul className="cy-ways__list">
            {PILLARS.map((pillar, index) => (
              <li key={pillar.n} data-cy-reveal style={{ "--cy-i": index } as React.CSSProperties}>
                <a
                  href={pillar.href}
                  className="cy-ways__row"
                  onClick={() =>
                    trackCta({ cta: "see_delivery", section: "paths", href: pillar.href })
                  }
                >
                  <span className="cy-ways__n" aria-hidden="true">
                    {pillar.n}
                  </span>
                  <div className="cy-ways__main">
                    <span className="cy-ways__kind">{pillar.kind}</span>
                    <h3 className="cy-ways__t">{pillar.title}</h3>
                    <span className="cy-ways__d">{pillar.body}</span>
                    <span className="cy-ways__cta">{pillar.cta}</span>
                  </div>
                  <span className="cy-ways__go" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Gap() {
  return (
    <section id="market" className="cy-section cy-scene--market" aria-labelledby="gap-heading">
      <div className="cy-scene__stage">
        <div className="cy-scene__glow" aria-hidden="true" />
        <div className="cy-container cy-scene__inner">
          <p className="cy-eyebrow" data-cy-reveal>
            The state of AI in US business, 2026
          </p>
          <h2 id="gap-heading" className="cy-mega">
            <span data-cy-reveal>Almost everyone has AI.</span>{" "}
            <span data-cy-reveal className="cy-mega__accent">
              Very few have it <em className="cy-it">working.</em>
            </span>
          </h2>
          <div className="cy-stats">
            {ADOPTION_GAP.map((item, index) => (
              <article
                key={item.id}
                className="cy-stat"
                data-cy-reveal
                style={{ "--cy-i": index } as React.CSSProperties}
              >
                <p className="cy-product__cat">{item.segment}</p>
                <div className="cy-stat__pair">
                  <span className="cy-stat__big">
                    <span data-cy-count={item.uses}>{item.uses}</span>%
                  </span>
                  <span className="cy-stat__vs">
                    <span data-cy-count={item.works}>{item.works}</span>%<small>working</small>
                  </span>
                </div>
                <div className="cy-gapbar" aria-hidden="true">
                  <i style={{ "--w": `${item.uses}%` } as React.CSSProperties} />
                  <i style={{ "--w": `${item.works}%` } as React.CSSProperties} />
                </div>
                <p>
                  <strong style={{ color: "var(--cy-ink)" }}>{item.uses}%</strong> {item.usesLabel}.
                  Only <strong style={{ color: "var(--cy-teal)" }}>{item.works}%</strong>{" "}
                  {item.worksLabel}.
                </p>
                <SourceNote id={item.source} />
              </article>
            ))}
          </div>
          <p className="cy-lead cy-scene__close" data-cy-reveal>
            The tools are everywhere. What is missing is the connection to real work: the data, the
            systems, the rules and the people. <strong>That gap is what we close.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section
      id="demo"
      className="cy-section cy-demo"
      data-cy-scene="enter"
      aria-labelledby="demo-heading"
    >
      <div className="cy-container">
        <div className="cy-center">
          <SectionHead
            id="demo-heading"
            eyebrow="See it work"
            title="One request in. Five steps. *Nothing retyped.*"
            lead="An example of the kind of workflow we build: your systems connected, AI on the reading, and a person approving what matters."
          />
        </div>
        <div className="cy-demo__stage">
          <div className="cy-demo__glow" aria-hidden="true" />
          <WorkflowConsole />
        </div>
      </div>
    </section>
  );
}

function Audiences() {
  const [active, setActive] = useState(0);
  const segment = SEGMENTS[active];
  const href = buildStartProjectHref({ source: "home", intent: segment.intent });
  return (
    <section id="who" className="cy-section cy-section--alt" aria-labelledby="who-heading">
      <div className="cy-container">
        <SectionHead
          id="who-heading"
          eyebrow="Who we work with"
          title="Pick your size. See what is *in the way.*"
          lead="The obstacles change as a company grows. So does the right first project."
          split
        />
        <div className="cy-tabs" data-cy-reveal>
          <div className="cy-tabs__list" role="tablist" aria-label="Company size">
            {SEGMENTS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`segment-tab-${item.id}`}
                aria-selected={index === active}
                aria-controls="segment-panel"
                tabIndex={index === active ? 0 : -1}
                className="cy-tabs__tab"
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                  const next =
                    (active + (event.key === "ArrowRight" ? 1 : -1) + SEGMENTS.length) %
                    SEGMENTS.length;
                  setActive(next);
                  document.getElementById(`segment-tab-${SEGMENTS[next].id}`)?.focus();
                }}
              >
                {item.name}
                <small>{item.size}</small>
              </button>
            ))}
          </div>
          <div
            key={segment.id}
            id="segment-panel"
            role="tabpanel"
            aria-labelledby={`segment-tab-${segment.id}`}
            className="cy-tabs__panel"
          >
            <div style={{ display: "grid", gap: 24, alignContent: "start" }}>
              <h3 className="cy-h3" style={{ fontSize: "clamp(1.4rem, 1.4vw + 1rem, 2rem)" }}>
                {segment.headline}
              </h3>
              <ul className="cy-pains">
                {segment.pains.map((pain) => (
                  <li key={pain.text} className="cy-pain">
                    <b>{pain.value}</b>
                    <span>
                      {pain.text}
                      <br />
                      <SourceNote id={pain.source} prefix="" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "grid", gap: 22, alignContent: "start" }}>
              <p className="cy-eyebrow">What we deliver</p>
              <ul className="cy-checks">
                {segment.deliver.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <dl className="cy-kvs">
                <div className="cy-kv">
                  <dt>Usually starts with</dt>
                  <dd>{segment.startsWith}</dd>
                </div>
                <div className="cy-kv">
                  <dt>Typical timeline</dt>
                  <dd>{segment.timeline}</dd>
                </div>
              </dl>
              <div className="cy-actions">
                <a
                  href={href}
                  className="cy-btn cy-btn--primary"
                  onClick={() => trackCta({ cta: "start_project", section: "paths", href })}
                >
                  Get a free fit check
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="cy-section cy-index" aria-labelledby="services-heading">
      <div className="cy-container">
        <SectionHead
          id="services-heading"
          eyebrow="What we build"
          title="Ten services. *One for each* thing in the way."
          lead="Every service answers a problem US companies report in 2026. Start with one; they are built to connect."
          split
        />
        <ul className="cy-index__list">
          {SERVICES.map((service, index) => (
            <li
              key={service.slug}
              data-cy-reveal
              style={{ "--cy-i": index % 2 } as React.CSSProperties}
            >
              <Link
                to={service.path}
                className="cy-index__row"
                onClick={() =>
                  trackCta({ cta: "see_delivery", section: "solutions", href: service.path })
                }
              >
                <span className="cy-index__n" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="cy-index__main">
                  <h3 className="cy-index__t">{service.name}</h3>
                  <span className="cy-index__d">{service.cardLine}</span>
                </span>
                <span className="cy-index__meta">{service.stage}</span>
                <span className="cy-index__go" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="cy-index__ask" data-cy-reveal>
          <div>
            <h3 className="cy-h3">Not sure which one you need?</h3>
            <p>
              That is what the fit check is for. Twenty minutes, free, and you leave with a clear
              next step.
            </p>
          </div>
          <StartButton section="solutions" source="home" small />
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section
      id="how-it-works"
      className="cy-section cy-section--alt"
      aria-labelledby="process-heading"
    >
      <div className="cy-container cy-process">
        <div className="cy-process__aside">
          <p className="cy-eyebrow" data-cy-reveal>
            How it works
          </p>
          <h2 id="process-heading" className="cy-h2" data-cy-reveal>
            You see the plan and the price <em className="cy-it">before you commit.</em>
          </h2>
          <p className="cy-lead" data-cy-reveal>
            No open-ended retainers and no surprise invoices. Every project runs the same four
            steps.
          </p>
          <div className="cy-guarantee" data-cy-reveal>
            <strong>Our one guarantee</strong>
            <p>
              The project is finished when it passes the acceptance checklist we agreed in writing,
              not before. We don&apos;t guarantee traffic, rankings or revenue. We guarantee what we
              agreed to build.
            </p>
          </div>
          <div data-cy-reveal>
            <StartButton section="operating_model" source="home" />
          </div>
        </div>
        <ol className="cy-process__steps">
          {PROCESS_STEPS.map((step) => (
            <li key={step.n} className="cy-pstep" data-cy-reveal>
              <div className="cy-pstep__meta">
                <span>Step {step.n}</span>
                <b>{step.time}</b>
              </div>
              <h3 className="cy-h3">{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Control() {
  return (
    <section id="control" className="cy-section" aria-labelledby="control-heading">
      <div className="cy-container">
        <SectionHead
          id="control-heading"
          eyebrow="AI within limits you set"
          title="Powerful enough to do the work. *Controlled enough to trust.*"
          lead="Data privacy and security is the concern businesses raise first about AI. So control is built into every system we deliver, not added afterwards."
          split
        />
        <ul className="cy-guard">
          {GUARDRAILS.map((item, index) => (
            <li key={item.title} data-cy-reveal style={{ "--cy-i": index } as React.CSSProperties}>
              <span className="cy-card__n">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="cy-h3">{item.title}</h3>
              <p className="cy-muted">{item.body}</p>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 24 }} data-cy-reveal>
          <Link to="/solutions/ai-governance-cost-control" className="cy-link">
            How we handle AI governance and cost control <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="products" className="cy-section cy-prod" aria-labelledby="products-heading">
      <div className="cy-container">
        <SectionHead
          id="products-heading"
          eyebrow="Our own products"
          title="Two AI products you can use *today.*"
          lead="The engineering that goes into client work also ships in products we design, run and answer for ourselves. Both are live: open each one to see it."
          split
        />
        <OnyxShowcase />
        <AexosShowcase />
        <p className="cy-prod__more" data-cy-reveal>
          <Link to="/products" className="cy-link">
            All Cyryx Labs products <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="cy-section" aria-labelledby="research-heading">
      <div className="cy-container">
        <SectionHead
          id="research-heading"
          eyebrow="Applied AI Lab"
          title="Research we publish *under our own name.*"
          lead="Our lab studies how AI systems should be controlled, measured and trusted, and publishes what it finds as open, citable work."
          split
        />
        <div data-cy-reveal>
          {PUBLICATIONS.map((publication) => (
            <Link
              key={publication.slug}
              to="/research/$slug"
              params={{ slug: publication.slug }}
              className="cy-paper"
              onClick={() =>
                trackCta({
                  cta: "view_research",
                  section: "research_band",
                  href: `/research/${publication.slug}`,
                })
              }
            >
              <span className="cy-paper__kind">{publication.category}</span>
              <span>
                <span className="cy-paper__title">{publication.title}</span>
                <span className="cy-paper__meta" style={{ display: "block", marginTop: 4 }}>
                  {publication.subtitle}
                </span>
              </span>
              <span className="cy-paper__meta">
                {publication.doi ? `DOI ${publication.doi}` : publication.date}
              </span>
            </Link>
          ))}
          <Link to="/answers" className="cy-paper">
            <span className="cy-paper__kind">Explainers</span>
            <span>
              <span className="cy-paper__title">Direct answers on AI governance and execution</span>
              <span className="cy-paper__meta" style={{ display: "block", marginTop: 4 }}>
                Short, sourced explanations of the terms buyers ask about.
              </span>
            </span>
            <span className="cy-paper__meta">Read →</span>
          </Link>
        </div>
        <p style={{ marginTop: 24 }} data-cy-reveal>
          <Link to="/research" className="cy-link">
            Visit the research lab <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

function Readiness() {
  return (
    <section
      id="readiness"
      className="cy-section cy-section--alt"
      aria-labelledby="readiness-heading"
    >
      <div className="cy-container cy-score">
        <div style={{ display: "grid", gap: 20 }}>
          <p className="cy-eyebrow" data-cy-reveal>
            Free · 60 seconds
          </p>
          <h2 id="readiness-heading" className="cy-h2" data-cy-reveal>
            How ready is your company <em className="cy-it">for AI?</em>
          </h2>
          <p className="cy-lead" data-cy-reveal>
            Five questions. You get a score and a recommended first step straight away, with no
            email required to see it.
          </p>
          <ul className="cy-checks" data-cy-reveal>
            <li>See where you stand on data, systems, rules and results</li>
            <li>Get the one project we would start with</li>
            <li>Ask for it as a written plan, if you want</li>
          </ul>
        </div>
        <Scorecard />
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section id="faq" className="cy-section" aria-labelledby="faq-heading">
      <div className="cy-container cy-split">
        <div className="cy-split__aside">
          <p className="cy-eyebrow" data-cy-reveal>
            Questions
          </p>
          <h2 id="faq-heading" className="cy-h2" data-cy-reveal>
            What companies <em className="cy-it">ask us first.</em>
          </h2>
          <div data-cy-reveal>
            <AskAssistant source="final_cta" label="Ask the assistant something else" />
          </div>
        </div>
        <Faq items={HOME_FAQ} idPrefix="home-faq" />
      </div>
    </section>
  );
}
