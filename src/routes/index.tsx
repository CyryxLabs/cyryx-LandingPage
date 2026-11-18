import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type MouseEvent } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Split, Statement } from "@/components/home/Split";
import { WorkflowAsText, WorkflowScene } from "@/components/home/WorkflowScene";
import { useHomeCinema } from "@/components/home/useHomeCinema";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import {
  HOME_CLOSE,
  HOME_COMPANY,
  HOME_HERO,
  HOME_INTENTS,
  SOLUTION_GROUPS,
  WORKFLOW_DEMO,
} from "@/data/home";
import { absoluteSiteUrl, SITE_URL } from "@/lib/site-url";
import { buildStartProjectHref, type StartContextIntent } from "@/lib/cta";
import { trackCta, type CtaName, type CtaSection } from "@/lib/track-cta";
import {
  buildCyryxOrganizationNode,
  CYRYX_ORGANIZATION_ID,
  CYRYX_WEBSITE_ID,
} from "@/data/seo-entities";

const HOME_URL = SITE_URL;
const HOME_TITLE = "Cyryx Labs — AI Products, Automation & Integration";
const HOME_DESCRIPTION =
  "Cyryx Labs builds AI software and helps businesses connect AI to their existing systems, automate workflows, and develop custom solutions.";
const HOME_SOCIAL_IMAGE = absoluteSiteUrl("/cyryx-og.png?v=20261113-1");
const HOME_REVIEWED = "2026-11-17";

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
      // The hero plate is the largest image on the first screen.
      {
        rel: "preload",
        as: "image",
        href: "/media/precision/hero-metal-1920.webp",
        media: "(min-width: 961px)",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: "/media/precision/hero-metal-tall-900.webp",
        media: "(max-width: 960px)",
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
              dateModified: HOME_REVIEWED,
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
              "@id": `${HOME_URL}#solutions`,
              name: "Cyryx Labs solutions",
              itemListElement: SOLUTION_GROUPS.map((group, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: group.title,
                url: absoluteSiteUrl(group.href),
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
  const ref = useRef<HTMLDivElement>(null);
  useHomeCinema(ref);

  // Links marked `data-track="event|section"` report one privacy-safe click.
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-track]");
    if (!link) return;
    const [cta, section] = (link.dataset.track ?? "").split("|");
    trackCta({
      cta: cta as CtaName,
      section: section as CtaSection,
      href: link.getAttribute("href") ?? undefined,
    });
  };

  return (
    <SiteShell source="home">
      <div className="hx" ref={ref} onClick={onClick}>
        <div className="cring" aria-hidden="true" />
        <Rail />
        <svg className="thread" aria-hidden="true" focusable="false">
          <path className="ghost" d="" />
          <path className="live" d="" />
          <circle r="4" cx="-20" cy="-20" />
        </svg>
        <Hero />
        <What />
        <Paths />
        <Workflow />
        <Solutions />
        <Products />
        <Evidence />
        <Delivery />
        <Company />
        <Close />
      </div>
    </SiteShell>
  );
}

function Arrow() {
  return (
    <span className="ar" aria-hidden="true">
      →
    </span>
  );
}

/* ═════════ 00 · Hero ═════════ */
function Hero() {
  const start = buildStartProjectHref({ source: "home" });
  return (
    <section className="hero" id="top" data-hero aria-labelledby="hero-heading" data-chapter="">
      <div className="hero-plate hm-plate" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 760px)"
            srcSet="/media/precision/hero-metal-tall-600.webp 600w, /media/precision/hero-metal-tall-900.webp 900w"
            sizes="100vw"
          />
          <img
            src="/media/precision/hero-metal-1920.webp"
            srcSet="/media/precision/hero-metal-1280.webp 1280w, /media/precision/hero-metal-1920.webp 1920w"
            sizes="100vw"
            alt=""
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
      <div className="hero-glint" aria-hidden="true" />
      <div className="wrap">
        <p className="mono kicker">{HOME_HERO.eyebrow}</p>
        <h1 id="hero-heading" data-split="">
          <span className="l1">
            <Split text={HOME_HERO.title} />
          </span>{" "}
          <span className="l2">
            <Split text={HOME_HERO.titleLine2} from={HOME_HERO.title.split(" ").length} />
          </span>
        </h1>
        <p className="hero-body hm-hero-body">{HOME_HERO.body}</p>
        <div className="hero-acts hm-ctas">
          <a
            className="btn btn--pri"
            href={start}
            data-cta="primary"
            data-magnet=""
            onClick={() => trackCta({ cta: "start_project", section: "hero", href: start })}
          >
            {HOME_HERO.primary} <Arrow />
          </a>
          <a
            className="btn btn--ghost"
            href="#products"
            data-cta="secondary"
            onClick={() => trackCta({ cta: "view_product", section: "hero", href: "#products" })}
          >
            {HOME_HERO.secondary}
          </a>
        </div>
        <ul className="support" aria-label="How we work">
          {HOME_HERO.support.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="cue mono" aria-hidden="true">
        Scroll <i />
      </p>
      <i className="anchor" data-anchor="" data-x="50" data-dy="-70" />
    </section>
  );
}

/* ═════════ 03 · Workflow example ═════════ */
function Workflow() {
  const start = buildStartProjectHref({ source: "home", intent: "workflow-automation" });
  return (
    <>
      <i className="anchor" data-anchor="" data-x="96" data-dy="90" />
      <section className="wf" id="workflow" aria-labelledby="wf-title" data-chapter="">
        <WorkflowScene />
        <i className="anchor" data-anchor="" data-x="96" />
        <div className="wrap">
          <div className="wf-foot">
            <p>
              <b>{WORKFLOW_DEMO.label}</b> {WORKFLOW_DEMO.note}
            </p>
            <a
              className="btn btn--ghost"
              href={start}
              onClick={() =>
                trackCta({ cta: "start_project", section: "workflow_demo", href: start })
              }
            >
              {WORKFLOW_DEMO.cta} <Arrow />
            </a>
          </div>
          <WorkflowAsText />
        </div>
        <i className="anchor" data-anchor="" data-x="96" data-dy="-60" />
      </section>
    </>
  );
}

/* ═════════ 09 · Close ═════════ */
function Close() {
  const [intent, setIntent] = useState<StartContextIntent>(HOME_INTENTS[0].intent);
  const [choice, setChoice] = useState(0);
  const href = buildStartProjectHref({ source: "home", intent });
  return (
    <section className="close" id="contact" aria-labelledby="close-title" data-chapter="">
      <div className="close-glow" aria-hidden="true" />
      <div className="wrap">
        <i className="anchor" data-anchor="" data-x="50" data-dy="-24" />
        <p className="mono kicker">Start a conversation</p>
        <h2 id="close-title" data-split="">
          <Split text={HOME_CLOSE.title} />
        </h2>
        <p className="lede">{HOME_CLOSE.body}</p>
        <fieldset className="intent">
          <legend>{HOME_CLOSE.legend}</legend>
          <div className="chips">
            {HOME_INTENTS.map((item, i) => (
              <label key={item.label}>
                <input
                  type="radio"
                  name="home-intent"
                  checked={choice === i}
                  onChange={() => {
                    setChoice(i);
                    setIntent(item.intent);
                    trackCta({ cta: "intent_selected", section: "final_cta" });
                  }}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <a
          className="btn btn--pri"
          href={href}
          data-magnet=""
          onClick={() => trackCta({ cta: "start_project", section: "final_cta", href })}
        >
          Discuss your project <Arrow />
        </a>
        <p className="after">{HOME_CLOSE.after}</p>
      </div>
    </section>
  );
}

function What() {
  return (
    <>
      {/* 01 · what we do */}
      <i className="anchor" data-anchor="" data-x="4"></i>
      <section className="what" id="what" aria-labelledby="what-title" data-chapter="">
        <div className="what-track">
          <div className="what-pin">
            <div className="wrap">
              <p className="mono kicker">What we do</p>
              <h2 id="what-title" data-split="">
                <Split text="Cyryx Labs" />{" "}
                <span className="ph">
                  <Split text="builds AI software" />
                </span>{" "}
                <Split text="and helps businesses" />{" "}
                <span className="ph">
                  <Split text="connect AI to their existing systems" tail="," />
                </span>{" "}
                <span className="ph">
                  <Split text="automate workflows" tail="," />
                </span>{" "}
                <Split text="and" />{" "}
                <span className="ph">
                  <Split text="develop custom solutions" tail="." />
                </span>
              </h2>
              <div className="wstage">
                <article className="wpanel" data-wpanel="">
                  <div className="wtxt">
                    <p className="mono idx">01 / 04 · Products</p>
                    <h3>We build AI software.</h3>
                    <p>
                      Meet the software we are building. See what each product does, who it is for,
                      and what is available now.
                    </p>
                    <a className="lnk" href="#products">
                      Explore our products{" "}
                      <span className="ar" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </div>
                  <div className="wvis wvis--metal" aria-hidden="true">
                    <img
                      src="/media/precision/hero-metal-1280.webp"
                      alt=""
                      loading="lazy"
                      width={1280}
                      height={720}
                    />
                    <div className="wplates">
                      <div className="wplate">
                        <b>Onyx</b>
                        <span>Free beta</span>
                      </div>
                      <div className="wplate">
                        <b>AEXOS</b>
                        <span>Core free on npm</span>
                      </div>
                      <div className="wplate wplate--dev">
                        <b>Orbit</b>
                        <span>In development</span>
                      </div>
                    </div>
                  </div>
                </article>
                <article className="wpanel" data-wpanel="">
                  <div className="wtxt">
                    <p className="mono idx">02 / 04 · Integration</p>
                    <h3>We connect AI to your existing systems.</h3>
                    <p>Connect business tools and reduce repetitive steps between them.</p>
                    <a className="lnk" href="/solutions/workflow-automation">
                      Explore automation &amp; integration{" "}
                      <span className="ar" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </div>
                  <div className="wvis" aria-hidden="true">
                    <svg className="wnet" viewBox="0 0 520 300">
                      <path className="ln" pathLength={1} d="M110 60 C190 60 190 150 215 150" />
                      <path className="ln" pathLength={1} d="M110 240 C190 240 190 150 215 150" />
                      <path className="ln" pathLength={1} d="M410 60 C330 60 330 150 305 150" />
                      <path className="ln" pathLength={1} d="M410 240 C330 240 330 150 305 150" />
                      <g className="nd">
                        <rect x="20" y="40" width="90" height="40" rx="10" />
                        <text x="65" y="65" textAnchor="middle">
                          Email
                        </text>
                      </g>
                      <g className="nd">
                        <rect x="20" y="220" width="90" height="40" rx="10" />
                        <text x="65" y="245" textAnchor="middle">
                          Forms
                        </text>
                      </g>
                      <g className="nd">
                        <rect x="410" y="40" width="90" height="40" rx="10" />
                        <text x="455" y="65" textAnchor="middle">
                          CRM
                        </text>
                      </g>
                      <g className="nd">
                        <rect x="410" y="220" width="90" height="40" rx="10" />
                        <text x="455" y="245" textAnchor="middle">
                          Documents
                        </text>
                      </g>
                      <g className="nd ai">
                        <rect x="215" y="122" width="90" height="56" rx="14" />
                        <text x="260" y="156" textAnchor="middle">
                          AI
                        </text>
                      </g>
                    </svg>
                    <p className="wcap mono">Illustration</p>
                  </div>
                </article>
                <article className="wpanel" data-wpanel="">
                  <div className="wtxt">
                    <p className="mono idx">03 / 04 · Automation</p>
                    <h3>We automate the work between them.</h3>
                    <p>AI handles defined steps. Your team approves important actions.</p>
                    <a className="lnk" href="#workflow">
                      See an example workflow{" "}
                      <span className="ar" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </div>
                  <div className="wvis" aria-hidden="true">
                    <div className="wpipe">
                      <span className="wpipe-fill"></span>
                      <ol>
                        <li>
                          <i></i>Inquiry
                        </li>
                        <li>
                          <i></i>Summary
                        </li>
                        <li>
                          <i></i>Record
                        </li>
                        <li className="ok">
                          <i></i>Approval
                        </li>
                        <li>
                          <i></i>Sent
                        </li>
                      </ol>
                    </div>
                    <p className="wcap mono">Illustration</p>
                  </div>
                </article>
                <article className="wpanel" data-wpanel="">
                  <div className="wtxt">
                    <p className="mono idx">04 / 04 · Custom software</p>
                    <h3>We develop custom solutions.</h3>
                    <p>
                      Build an assistant, internal application, or product around a defined use
                      case.
                    </p>
                    <a className="lnk" href="/solutions/custom-ai-product-development">
                      Discuss a custom build{" "}
                      <span className="ar" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </div>
                  <div className="wvis" aria-hidden="true">
                    <div className="wwire">
                      <div className="wbar">
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                      <div className="wgrid">
                        <span className="wb s"></span>
                        <span className="wb a"></span>
                        <span className="wb b"></span>
                        <span className="wb c"></span>
                      </div>
                    </div>
                    <p className="wchips">
                      <span>Assistant</span>
                      <span>Internal application</span>
                      <span>Product</span>
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
      <i className="anchor" data-anchor="" data-x="4"></i>
    </>
  );
}

function Paths() {
  return (
    <>
      {/* 02 · two paths */}
      <section className="paths" id="paths" aria-labelledby="paths-title" data-chapter="">
        <div className="wrap paths-head">
          <p className="mono kicker">Where to start</p>
          <h2 id="paths-title" data-split="">
            <Split text="Two ways to put AI to work." />
          </h2>
        </div>
        <i className="anchor" data-anchor="" data-x="4" data-dy="-40"></i>
        <i className="anchor" data-anchor="" data-x="50" data-mx="4" data-dy="60"></i>
        <div className="split">
          <a className="half half--prod" href="/products" data-track="intent_selected|paths">
            <div className="half-art" aria-hidden="true">
              <img
                src="/media/precision/hero-metal-1280.webp"
                alt=""
                loading="lazy"
                width={1280}
                height={720}
              />
            </div>
            <p className="mono kicker">Products</p>
            <h3>Explore Cyryx products</h3>
            <p>
              Meet the software we are building. See what each product does, who it is for, and what
              is available now.
            </p>
            <div className="tags" aria-hidden="true">
              <span>Onyx · Free beta</span>
              <span>AEXOS · Core on npm</span>
              <span>Orbit · In development</span>
            </div>
            <span className="lnk">
              Explore products{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </span>
          </a>
          <a className="half half--sol" href="/solutions" data-track="intent_selected|paths">
            <div className="half-art" aria-hidden="true">
              <svg viewBox="0 0 560 240">
                <path d="M92 70 C170 70 190 120 250 120" />
                <path d="M92 170 C170 170 190 120 250 120" />
                <path className="t" d="M330 120 L400 120" />
                <path d="M480 120 C488 120 486 70 492 70" />
                <path d="M480 120 C488 120 486 170 492 170" />
                <g>
                  <rect x="20" y="52" width="80" height="36" rx="8" />
                  <text x="60" y="75" textAnchor="middle">
                    Email
                  </text>
                </g>
                <g>
                  <rect x="20" y="152" width="80" height="36" rx="8" />
                  <text x="60" y="175" textAnchor="middle">
                    Forms
                  </text>
                </g>
                <g className="ai">
                  <rect x="250" y="100" width="80" height="40" rx="10" />
                  <text x="290" y="125" textAnchor="middle">
                    AI step
                  </text>
                </g>
                <g className="ok">
                  <rect x="400" y="100" width="80" height="40" rx="10" />
                  <text x="440" y="125" textAnchor="middle">
                    Approve
                  </text>
                </g>
                <g>
                  <rect x="492" y="52" width="64" height="36" rx="8" />
                  <text x="524" y="75" textAnchor="middle">
                    CRM
                  </text>
                </g>
                <g>
                  <rect x="492" y="152" width="64" height="36" rx="8" />
                  <text x="524" y="175" textAnchor="middle">
                    Reply
                  </text>
                </g>
              </svg>
            </div>
            <p className="mono kicker">Solutions</p>
            <h3>Build AI into your business</h3>
            <p>
              Connect your tools, automate a workflow, or develop a custom AI application around
              your team’s needs.
            </p>
            <span className="lnk">
              Explore solutions{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </span>
          </a>
        </div>
        <i className="anchor" data-anchor="" data-x="50" data-mx="4"></i>
      </section>
    </>
  );
}

function Solutions() {
  return (
    <>
      {/* 04 · solutions */}
      <section className="sols" id="solutions" aria-labelledby="sol-title" data-chapter="">
        <div className="wrap">
          <i className="anchor" data-anchor="" data-x="4" data-dy="-70"></i>
          <div className="sec-head">
            <p className="mono kicker">Solutions</p>
            <h2 id="sol-title" data-split="">
              <Split text="Start with the work you want to improve." />
            </h2>
          </div>
          <ol className="rows">
            <li className="row" data-row="">
              <span className="idx mono">01</span>
              <h3>AI strategy &amp; consulting</h3>
              <p>Decide where AI is useful, what to build first, and what controls are needed.</p>
              <a
                className="go cover"
                data-track="intent_selected|solutions"
                href="/solutions/ai-strategy-advisory"
                aria-label="Explore AI consulting"
              >
                →
              </a>
            </li>
            <li className="row" data-row="">
              <span className="idx mono">02</span>
              <h3>Automation &amp; integration</h3>
              <p>Connect business tools and reduce repetitive steps between them.</p>
              <a
                className="go cover"
                data-track="intent_selected|solutions"
                href="/solutions/workflow-automation"
                aria-label="Explore automation and integration"
              >
                →
              </a>
            </li>
            <li className="row" data-row="">
              <span className="idx mono">03</span>
              <h3>Custom AI software</h3>
              <p>Build an assistant, internal application, or product around a defined use case.</p>
              <a
                className="go cover"
                data-track="intent_selected|solutions"
                href="/solutions/custom-ai-product-development"
                aria-label="Discuss a custom build"
              >
                →
              </a>
            </li>
            <li className="row" data-row="">
              <span className="idx mono">04</span>
              <h3>Managed AI operations</h3>
              <p>
                Monitor and maintain implemented systems, with support and changes defined in an
                agreement.
              </p>
              <a
                className="go cover"
                data-track="intent_selected|solutions"
                href="/managed-operations"
                aria-label="Explore ongoing support"
              >
                →
              </a>
            </li>
          </ol>
          <i className="anchor" data-anchor="" data-x="4"></i>
          <p style={{ marginTop: 28 }}>
            <a className="lnk" href="/solutions">
              All solutions{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

function Products() {
  return (
    <>
      {/* 05 · products */}
      <section className="prods" id="products" aria-labelledby="prod-title" data-chapter="">
        <div className="wrap">
          <i className="anchor" data-anchor="" data-x="96" data-dy="-70"></i>
          <div className="sec-head">
            <p className="mono kicker">Products</p>
            <h2 id="prod-title" data-split="">
              <Split text="Built by Cyryx. Designed for specific jobs." />
            </h2>
          </div>
          <article className="prod" id="onyx" aria-labelledby="onyx-name">
            <div className="prod-media">
              <figure className="shot" data-tilt-in="">
                <img
                  src="/media/onyx/cc-hq.webp"
                  alt="Onyx Command Center showing items that need the owner’s approval, tasks in flight and today’s events, with example data"
                  width="1600"
                  height="1000"
                  loading="lazy"
                />
                <figcaption className="tag">Internal product · example data</figcaption>
              </figure>
            </div>
            <div>
              <h3 className="prod-name" id="onyx-name">
                Onyx
              </h3>
              <p className="status mono">Free beta</p>
              <dl className="facts">
                <dt>What it is</dt>
                <dd>An AI coworker for Windows</dd>
                <dt>For</dt>
                <dd>One owner on their own PC</dd>
                <dt>Its job</dt>
                <dd>
                  Works your inbox, research and apps—and asks before it acts outside your machine.
                </dd>
                <dt>Requires</dt>
                <dd>Windows 10 or 11 (64-bit) and your own AI provider keys</dd>
              </dl>
              <div className="acts">
                <a
                  className="lnk"
                  data-track="view_product|product"
                  href="https://onyx.cyryxlabs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Try the beta{" "}
                  <span className="ar" aria-hidden="true">
                    ↗
                  </span>
                  <span className="sr"> (opens in a new tab)</span>
                </a>
                <a className="lnk" href="/products/onyx">
                  How Onyx works{" "}
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </article>
          <article className="prod prod--flip" id="aexos" aria-labelledby="aexos-name">
            <div className="prod-media">
              <div
                className="term"
                id="term"
                role="img"
                aria-label="AEXOS install command and its documented story cycle: create, validate, implement, QA gate, push. A failing quality gate stops the change."
              >
                <div data-type="">
                  <span className="p">$</span> {AEXOS_PRODUCT.installCommand}
                </div>
                <div data-type="" className="c">
                  # then, inside your AI coding environment:
                </div>
                <div data-type="">create → validate → implement → QA gate → push</div>
                <div data-type="" className="c">
                  # a failing quality gate stops the change
                </div>
                <div>
                  <span className="caret"></span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="prod-name" id="aexos-name">
                AEXOS
              </h3>
              <p className="status mono">Core free on npm</p>
              <dl className="facts">
                <dt>What it is</dt>
                <dd>An agent framework for software projects</dd>
                <dt>For</dt>
                <dd>Developers using AI coding tools</dd>
                <dt>Its job</dt>
                <dd>Runs AI coding agents through defined steps and quality checks.</dd>
                <dt>Requires</dt>
                <dd>Node.js 18 or later</dd>
              </dl>
              <div className="acts">
                <a className="lnk" data-track="view_product|product" href="/products/aexos">
                  Explore AEXOS{" "}
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </article>
          <i className="anchor" data-anchor="" data-x="96"></i>
        </div>
        <div className="orbit" aria-labelledby="orbit-name">
          <h3 className="prod-name" id="orbit-name" data-split="">
            <Split text="Orbit" />
          </h3>
          <p className="status mono">In development</p>
          <i className="anchor" data-anchor="" data-x="96" data-dy="-40"></i>
        </div>
      </section>
    </>
  );
}

function Evidence() {
  return (
    <>
      {/* 06 · evidence */}
      <section className="ev" id="evidence" aria-labelledby="ev-title" data-chapter="">
        <div className="wrap">
          <i className="anchor" data-anchor="" data-x="4" data-dy="-40"></i>
          <div className="sec-head">
            <p className="mono kicker">Evidence</p>
            <h2 id="ev-title" data-split="">
              <Split text="See the work. Understand the decisions." />
            </h2>
            <p>Every example says what it is, what is real, and what is simulated.</p>
          </div>
          <div className="ev-grid">
            <article className="evc" data-card="">
              <span className="tag">Internal product</span>
              <h3>Onyx Command Center</h3>
              <dl className="rs">
                <div>
                  <dt>Real</dt>
                  <dd>The product’s own interface, captured from the beta.</dd>
                </div>
                <div>
                  <dt>Simulated</dt>
                  <dd>The names, tasks and numbers are example data.</dd>
                </div>
              </dl>
              <a className="lnk" href="/products/onyx">
                See the product{" "}
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </a>
            </article>
            <article className="evc" data-card="">
              <span className="tag">Internal demo</span>
              <h3>Inquiry-to-reply workflow</h3>
              <dl className="rs">
                <div>
                  <dt>Real</dt>
                  <dd>The sequence of steps and where a person approves.</dd>
                </div>
                <div>
                  <dt>Simulated</dt>
                  <dd>Everything else: sample data, no live email or CRM.</dd>
                </div>
              </dl>
              <a className="lnk" href="/demos">
                Open the demo{" "}
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </a>
            </article>
            <article className="evc" data-card="">
              <span className="tag">Internal product</span>
              <h3>AEXOS story cycle</h3>
              <dl className="rs">
                <div>
                  <dt>Real</dt>
                  <dd>The published package and its documented commands.</dd>
                </div>
                <div>
                  <dt>Simulated</dt>
                  <dd>The terminal on this page is a written summary, not a recording.</dd>
                </div>
              </dl>
              <a className="lnk" href="/products/aexos">
                Read about AEXOS{" "}
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </a>
            </article>
          </div>
          <div className="lab" data-card="">
            <span>
              <b>From the lab:</b> a governance protocol for human-approved agent work, published
              with a DOI.
            </span>
            <a className="lnk" data-track="view_research|evidence" href="/research/cgp-v1">
              Read the protocol{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <i className="anchor" data-anchor="" data-x="4"></i>
        </div>
      </section>
    </>
  );
}

function Delivery() {
  return (
    <>
      {/* 07 · delivery */}
      <section className="dlv" id="delivery" aria-labelledby="dlv-title" data-chapter="">
        <div className="wrap">
          <div className="sec-head">
            <p className="mono kicker">How we deliver</p>
            <h2 id="dlv-title" data-split="">
              <Split text="Know what is being built—and how it will be accepted." />
            </h2>
          </div>
          <i className="anchor" data-anchor="" data-x="4" data-dy="-30"></i>
          <ol className="stairs">
            <li className="stair">
              <span className="dotx" data-anchor="" data-x="self" data-mx="4"></span>
              <p className="mono kicker">Step 1</p>
              <h3>Understand</h3>
              <p>Identify the workflow, tools, constraints, and decision-makers.</p>
            </li>
            <li className="stair">
              <span className="dotx" data-anchor="" data-x="self" data-mx="4"></span>
              <p className="mono kicker">Step 2</p>
              <h3>Define</h3>
              <p>Agree scope, responsibilities, controls, and acceptance criteria.</p>
            </li>
            <li className="stair">
              <span className="dotx" data-anchor="" data-x="self" data-mx="4"></span>
              <p className="mono kicker">Step 3</p>
              <h3>Build and test</h3>
              <p>Review working increments against realistic cases.</p>
            </li>
            <li className="stair">
              <span className="dotx" data-anchor="" data-x="self" data-mx="4"></span>
              <p className="mono kicker">Step 4</p>
              <h3>Launch and support</h3>
              <p>
                Complete acceptance, hand over documentation, and define ongoing support where
                applicable.
              </p>
            </li>
          </ol>
          <i className="anchor" data-anchor="" data-x="96" data-dy="60"></i>
        </div>
        <div className="quiet-track">
          <div className="quiet">
            <p className="mono kicker">The controls are part of the scope</p>
            <ul className="checks" aria-label="Defined with you in each written scope">
              <li>
                <svg viewBox="0 0 26 26" aria-hidden="true">
                  <rect x="1" y="1" width="24" height="24" rx="6" />
                  <path d="M7 13.5l4 4 8-9" pathLength={1} />
                </svg>
                <div>
                  <b>Access</b>
                  <span>Which systems and data the AI may read.</span>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 26 26" aria-hidden="true">
                  <rect x="1" y="1" width="24" height="24" rx="6" />
                  <path d="M7 13.5l4 4 8-9" pathLength={1} />
                </svg>
                <div>
                  <b>Actions</b>
                  <span>What it may change, and which steps wait for a person.</span>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 26 26" aria-hidden="true">
                  <rect x="1" y="1" width="24" height="24" rx="6" />
                  <path d="M7 13.5l4 4 8-9" pathLength={1} />
                </svg>
                <div>
                  <b>Records</b>
                  <span>What is logged, where, and who can see it.</span>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 26 26" aria-hidden="true">
                  <rect x="1" y="1" width="24" height="24" rx="6" />
                  <path d="M7 13.5l4 4 8-9" pathLength={1} />
                </svg>
                <div>
                  <b>Support</b>
                  <span>Who responds after launch, and how changes are requested.</span>
                </div>
              </li>
            </ul>
            <h2 data-split="">
              <Split text="A project is done when it passes the acceptance checklist we agree on." />
            </h2>
          </div>
        </div>
        <i className="anchor" data-anchor="" data-x="96" data-dy="-40"></i>
      </section>
    </>
  );
}

function Company() {
  return (
    <>
      {/* 08 · company */}
      <section className="co" id="company" aria-labelledby="co-title" data-chapter="">
        <div className="co-plate" aria-hidden="true">
          <img
            src="/media/precision/channel-1600.webp"
            srcSet="/media/precision/channel-960.webp 960w, /media/precision/channel-1600.webp 1600w"
            sizes="100vw"
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="wrap">
          <i className="anchor" data-anchor="" data-x="4" data-dy="-60"></i>
          <p className="mono kicker">Company</p>
          <h2 id="co-title" data-split="">
            <Split text="A product company. An implementation partner." />
          </h2>
          <p className="say">
            <Statement text={HOME_COMPANY.body} />
          </p>
          <p style={{ marginTop: 30 }}>
            <a className="lnk" href="/company">
              About Cyryx Labs{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
          </p>
          <i className="anchor" data-anchor="" data-x="4" data-dy="80"></i>
        </div>
      </section>
    </>
  );
}

function Rail() {
  return (
    <>
      <nav className="rail" aria-label="Chapters">
        <p className="rail-now" aria-hidden="true">
          <b>00</b> Intro
        </p>
        <ol>
          <li>
            <a href="#top" data-ch="00" data-label="Intro">
              <span className="sr">Intro</span>
            </a>
          </li>
          <li>
            <a href="#what" data-ch="01" data-label="What we do">
              <span className="sr">What we do</span>
            </a>
          </li>
          <li>
            <a href="#paths" data-ch="02" data-label="Two paths">
              <span className="sr">Two ways to start</span>
            </a>
          </li>
          <li>
            <a href="#workflow" data-ch="03" data-label="Workflow">
              <span className="sr">Workflow example</span>
            </a>
          </li>
          <li>
            <a href="#solutions" data-ch="04" data-label="Solutions">
              <span className="sr">Solutions</span>
            </a>
          </li>
          <li>
            <a href="#products" data-ch="05" data-label="Products">
              <span className="sr">Products</span>
            </a>
          </li>
          <li>
            <a href="#evidence" data-ch="06" data-label="Evidence">
              <span className="sr">Evidence</span>
            </a>
          </li>
          <li>
            <a href="#delivery" data-ch="07" data-label="Delivery">
              <span className="sr">How we deliver</span>
            </a>
          </li>
          <li>
            <a href="#company" data-ch="08" data-label="Company">
              <span className="sr">Company</span>
            </a>
          </li>
          <li>
            <a href="#contact" data-ch="09" data-label="Start">
              <span className="sr">Start a conversation</span>
            </a>
          </li>
        </ol>
      </nav>
    </>
  );
}
