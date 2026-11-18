import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { WorkflowDemo } from "@/components/home/WorkflowDemo";
import { AEXOS, ONYX, ORBIT } from "@/data/products";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import {
  ACCEPTANCE_GUARANTEE,
  DELIVERY_STEPS,
  EVIDENCE,
  HOME_CLOSE,
  HOME_COMPANY,
  HOME_HERO,
  HOME_INTENTS,
  HOME_PATHS,
  SCOPE_CONTROLS,
  SOLUTION_GROUPS,
  WORKFLOW_DEMO,
} from "@/data/home";
import { absoluteSiteUrl, SITE_URL } from "@/lib/site-url";
import { buildStartProjectHref, type StartContextIntent } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
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
        href: "/media/precision/hero-metal-tall-600.webp",
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
  useHomeMotion();
  return (
    <SiteShell source="home">
      <div className="hm">
        <Hero />
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

/** Short entrances and a light parallax. Content is visible without JS. */
function useHomeMotion() {
  useEffect(() => {
    const root = document.documentElement;
    // Reduced motion and the low-performance path (Save-Data, weak devices)
    // get the content at rest, with no entrance states.
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.classList.contains("cx-low-perf");
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".hm [data-hm-in]"));
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    root.classList.add("hm-js");
    const pending = new Set(targets);
    const reveal = (el: Element) => {
      el.classList.add("is-in");
      pending.delete(el as HTMLElement);
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    targets.forEach((el) => io.observe(el));

    const hero = document.querySelector<HTMLElement>(".hm-hero");
    const plates = Array.from(document.querySelectorAll<HTMLElement>(".hm [data-hm-par]"));
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let mx = 0;
    let my = 0;
    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      // A jump (anchor link, restored scroll) can skip past elements without
      // them ever intersecting; reveal anything already above the fold line.
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.92) reveal(el);
      });
      if (hero) {
        hero.style.setProperty("--mx", mx.toFixed(3));
        hero.style.setProperty("--my", my.toFixed(3));
        if (window.scrollY < vh * 1.2)
          hero.style.setProperty("--sy", `${(window.scrollY * 0.18).toFixed(1)}px`);
      }
      plates.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh)
          el.style.setProperty("--py", `${((r.top + r.height / 2 - vh / 2) * -0.06).toFixed(1)}px`);
      });
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onPointer = (event: PointerEvent) => {
      mx = event.clientX / window.innerWidth - 0.5;
      my = event.clientY / window.innerHeight - 0.5;
      request();
    };
    window.addEventListener("scroll", request, { passive: true });
    if (fine) window.addEventListener("pointermove", onPointer, { passive: true });
    frame();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("pointermove", onPointer);
      root.classList.remove("hm-js");
    };
  }, []);
}

function Arrow({ external = false }: { external?: boolean }) {
  return (
    <span className="hm-ar" aria-hidden="true">
      {external ? "↗" : "→"}
    </span>
  );
}

function Kicker({ children }: { children: string }) {
  return (
    <p className="hm-kicker" data-hm-in>
      {children}
    </p>
  );
}

/* ═════════ 1 · Hero ═════════ */
function Hero() {
  const start = buildStartProjectHref({ source: "home" });
  return (
    <section className="hm-hero" id="top" data-hero aria-labelledby="hero-heading">
      <div className="hm-plate" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 960px)"
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
      <div className="hm-sweep" aria-hidden="true" />
      <div className="hm-wrap hm-hero-grid">
        <div className="hm-hero-copy">
          <p className="hm-eyebrow">{HOME_HERO.eyebrow}</p>
          <h1 id="hero-heading">
            {HOME_HERO.title} <span>{HOME_HERO.titleLine2}</span>
          </h1>
          <p className="hm-hero-body">{HOME_HERO.body}</p>
          <div className="hm-ctas">
            <a
              href={start}
              className="hm-btn hm-btn--pri"
              data-cta="primary"
              onClick={() => trackCta({ cta: "start_project", section: "hero", href: start })}
            >
              {HOME_HERO.primary} <Arrow />
            </a>
            <a
              href="#products"
              className="hm-btn hm-btn--sec"
              data-cta="secondary"
              onClick={() => trackCta({ cta: "view_product", section: "hero", href: "#products" })}
            >
              {HOME_HERO.secondary}
            </a>
          </div>
          <ul className="hm-support" aria-label="How we work">
            {HOME_HERO.support.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div
          className="hm-surfaces"
          role="img"
          aria-label="Illustrative workflow with sample data: an inquiry, an AI summary, and a reply waiting for approval"
        >
          <div className="hm-surf hm-s1" aria-hidden="true">
            <div className="hm-surf-top">
              <span>Inbox</span>
              <span className="hm-chip">New</span>
            </div>
            <b>“Can we move Thursday’s onboarding call?”</b>
            <p>Maria Chen · Northline Dental</p>
          </div>
          <div className="hm-surf hm-s2" aria-hidden="true">
            <div className="hm-surf-top">
              <span>AI step · summary</span>
              <span className="hm-chip hm-chip--t">Ready</span>
            </div>
            <b>Reschedule request · next week</b>
            <p>Contact found in CRM. Two open slots suggested.</p>
          </div>
          <div className="hm-surf hm-s3" aria-hidden="true">
            <div className="hm-surf-top">
              <span>Reply draft</span>
              <span className="hm-chip hm-chip--a">Needs approval</span>
            </div>
            <b>“Tuesday at 10:00 or Wednesday at 10:30?”</b>
            <div className="hm-surf-row">
              <span className="hm-chip">Edit</span>
              <span className="hm-chip hm-chip--t">Approve &amp; send</span>
            </div>
          </div>
          <p className="hm-surf-note" aria-hidden="true">
            Sample data · illustrative
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═════════ 2 · Two starting points ═════════ */
function Paths() {
  return (
    <section className="hm-sec" id="paths" aria-labelledby="hm-paths-title">
      <div className="hm-wrap">
        <div className="hm-head">
          <Kicker>Where to start</Kicker>
          <h2 className="hm-h2" id="hm-paths-title" data-hm-in>
            {HOME_PATHS.title}
          </h2>
        </div>
        <div className="hm-paths">
          <Link
            to={HOME_PATHS.products.href}
            className="hm-path"
            data-hm-in
            onClick={() =>
              trackCta({ cta: "intent_selected", section: "paths", href: HOME_PATHS.products.href })
            }
          >
            <div className="hm-path-art hm-path-art--prod" aria-hidden="true">
              <img
                src="/media/precision/hero-metal-1280.webp"
                alt=""
                loading="lazy"
                width={1280}
                height={720}
              />
              <div className="hm-plaques">
                <div className="hm-plaque">
                  <b>{ONYX.name}</b>
                  <span>Free beta</span>
                </div>
                <div className="hm-plaque">
                  <b>{AEXOS.name}</b>
                  <span>Core on npm</span>
                </div>
                <div className="hm-plaque hm-plaque--dev">
                  <b>{ORBIT.name}</b>
                  <span>{ORBIT.stage}</span>
                </div>
              </div>
            </div>
            <div className="hm-path-txt">
              <p className="hm-label">{HOME_PATHS.products.kicker}</p>
              <h3>{HOME_PATHS.products.title}</h3>
              <p>{HOME_PATHS.products.body}</p>
              <span className="hm-lnk">
                {HOME_PATHS.products.cta} <Arrow />
              </span>
            </div>
          </Link>
          <Link
            to={HOME_PATHS.solutions.href}
            className="hm-path"
            data-hm-in
            style={{ "--d": "80ms" } as CSSProperties}
            onClick={() =>
              trackCta({
                cta: "intent_selected",
                section: "paths",
                href: HOME_PATHS.solutions.href,
              })
            }
          >
            <div className="hm-path-art hm-path-art--sol" aria-hidden="true">
              <svg viewBox="0 0 560 240" preserveAspectRatio="xMidYMid meet">
                <path className="w" d="M92 70 C170 70 190 120 250 120" />
                <path className="w" d="M92 170 C170 170 190 120 250 120" />
                <path className="w w--t" d="M330 120 L400 120" />
                <path className="w" d="M480 120 C488 120 486 70 492 70" />
                <path className="w" d="M480 120 C488 120 486 170 492 170" />
                <g className="n">
                  <rect x="20" y="52" width="80" height="36" rx="8" />
                  <text x="60" y="75" textAnchor="middle">
                    Email
                  </text>
                </g>
                <g className="n">
                  <rect x="20" y="152" width="80" height="36" rx="8" />
                  <text x="60" y="175" textAnchor="middle">
                    Forms
                  </text>
                </g>
                <g className="n n--ai">
                  <rect x="250" y="100" width="80" height="40" rx="10" />
                  <text x="290" y="125" textAnchor="middle">
                    AI step
                  </text>
                </g>
                <g className="n n--p">
                  <rect x="400" y="100" width="80" height="40" rx="10" />
                  <text x="440" y="125" textAnchor="middle">
                    Approve
                  </text>
                </g>
                <g className="n">
                  <rect x="492" y="52" width="64" height="36" rx="8" />
                  <text x="524" y="75" textAnchor="middle">
                    CRM
                  </text>
                </g>
                <g className="n">
                  <rect x="492" y="152" width="64" height="36" rx="8" />
                  <text x="524" y="175" textAnchor="middle">
                    Reply
                  </text>
                </g>
              </svg>
            </div>
            <div className="hm-path-txt">
              <p className="hm-label">{HOME_PATHS.solutions.kicker}</p>
              <h3>{HOME_PATHS.solutions.title}</h3>
              <p>{HOME_PATHS.solutions.body}</p>
              <span className="hm-lnk">
                {HOME_PATHS.solutions.cta} <Arrow />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═════════ 3 · Workflow example ═════════ */
function Workflow() {
  const start = buildStartProjectHref({ source: "home", intent: "workflow-automation" });
  return (
    <section className="hm-sec hm-sec--flush" id="workflow" aria-labelledby="hm-wf-title">
      <div className="hm-wrap">
        <div className="hm-head">
          <Kicker>Example workflow</Kicker>
          <h2 className="hm-h2" id="hm-wf-title" data-hm-in>
            {WORKFLOW_DEMO.title}
          </h2>
          <p className="hm-lede" data-hm-in>
            {WORKFLOW_DEMO.lead}
          </p>
        </div>
        <WorkflowDemo />
        <div className="hm-wf-foot">
          <p className="hm-disclaim">
            <b>{WORKFLOW_DEMO.label}</b> {WORKFLOW_DEMO.note}
          </p>
          <a
            href={start}
            className="hm-btn hm-btn--sec"
            onClick={() =>
              trackCta({ cta: "start_project", section: "workflow_demo", href: start })
            }
          >
            {WORKFLOW_DEMO.cta} <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═════════ 4 · Solutions ═════════ */
const ICONS: Record<(typeof SOLUTION_GROUPS)[number]["icon"], ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  connect: (
    <>
      <rect x="3" y="4" width="6" height="6" rx="1.5" />
      <rect x="15" y="14" width="6" height="6" rx="1.5" />
      <path d="M9 7h4a2 2 0 0 1 2 2v5" />
    </>
  ),
  build: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 13l-2 2 2 2M15 13l2 2-2 2" />
    </>
  ),
  pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
};

function Solutions() {
  return (
    <section className="hm-sec hm-sec--tint" id="solutions" aria-labelledby="hm-sol-title">
      <div className="hm-wrap">
        <div className="hm-head">
          <Kicker>Solutions</Kicker>
          <h2 className="hm-h2" id="hm-sol-title" data-hm-in>
            Start with the work you want to improve.
          </h2>
        </div>
        <div className="hm-sols">
          {SOLUTION_GROUPS.map((group, i) => (
            <article
              className="hm-sol"
              key={group.id}
              data-hm-in
              style={{ "--d": `${i * 60}ms` } as CSSProperties}
            >
              <span className="hm-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">{ICONS[group.icon]}</svg>
              </span>
              <h3>{group.title}</h3>
              <p>{group.body}</p>
              <Link
                to={group.href}
                className="hm-lnk hm-lnk--cover"
                onClick={() =>
                  trackCta({ cta: "intent_selected", section: "solutions", href: group.href })
                }
              >
                {group.cta} <Arrow />
              </Link>
            </article>
          ))}
        </div>
        <div className="hm-all">
          <Link to="/solutions" className="hm-lnk">
            All solutions <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═════════ 5 · Products ═════════ */
function useProductViewed(id: string) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          trackCta({ cta: "product_viewed", section: "product", href: `#${id}` });
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return ref;
}

function Products() {
  const onyxRef = useProductViewed("onyx");
  const aexosRef = useProductViewed("aexos");
  return (
    <section className="hm-sec" id="products" aria-labelledby="hm-prod-title">
      <div className="hm-wrap">
        <div className="hm-head">
          <Kicker>Products</Kicker>
          <h2 className="hm-h2" id="hm-prod-title" data-hm-in>
            Built by Cyryx. Designed for specific jobs.
          </h2>
        </div>
        <div className="hm-prods">
          <article className="hm-prod hm-prod--onyx" id="onyx" ref={onyxRef} data-hm-in>
            <div className="hm-shot">
              <img
                src="/media/onyx/cc-hq.webp"
                alt="Onyx Command Center showing items that need the owner’s approval, tasks in flight and today’s events, with example data"
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
              />
              <span className="hm-tag">Internal product · example data</span>
            </div>
            <div className="hm-prod-body">
              <div className="hm-prod-nm">
                <h3>{ONYX.name}</h3>
                <span className="hm-status">Free beta</span>
              </div>
              <dl>
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
              <div className="hm-prod-acts">
                <a
                  className="hm-lnk"
                  href={ONYX.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackCta({ cta: "view_product", section: "product", href: ONYX.site })
                  }
                >
                  Try the beta <Arrow external />
                </a>
                <Link className="hm-lnk" to={ONYX.path}>
                  How Onyx works <Arrow />
                </Link>
              </div>
            </div>
          </article>
          <article
            className="hm-prod"
            id="aexos"
            ref={aexosRef}
            data-hm-in
            style={{ "--d": "80ms" } as CSSProperties}
          >
            <div
              className="hm-term"
              aria-label="AEXOS install command and documented story cycle"
              role="img"
            >
              <div>
                <span className="hm-term-p">$</span> {AEXOS_PRODUCT.installCommand}
              </div>
              <div className="hm-term-c"># then, inside your AI coding environment:</div>
              <div>create → validate → implement → QA gate → push</div>
              <div className="hm-term-c"># a failing quality gate stops the change</div>
            </div>
            <div className="hm-prod-body">
              <div className="hm-prod-nm">
                <h3>{AEXOS.name}</h3>
                <span className="hm-status">Core free on npm</span>
              </div>
              <dl>
                <dt>What it is</dt>
                <dd>An agent framework for software projects</dd>
                <dt>For</dt>
                <dd>Developers using AI coding tools</dd>
                <dt>Its job</dt>
                <dd>Runs AI coding agents through defined steps and quality checks.</dd>
                <dt>Requires</dt>
                <dd>Node.js 18 or later</dd>
              </dl>
              <div className="hm-prod-acts">
                <Link
                  className="hm-lnk"
                  to={AEXOS.path}
                  onClick={() =>
                    trackCta({ cta: "view_product", section: "product", href: AEXOS.path })
                  }
                >
                  Explore AEXOS <Arrow />
                </Link>
              </div>
            </div>
          </article>
          <article
            className="hm-prod hm-prod--orbit"
            data-hm-in
            style={{ "--d": "140ms" } as CSSProperties}
          >
            <div className="hm-prod-body">
              <div className="hm-prod-nm">
                <h3>{ORBIT.name}</h3>
                <span className="hm-status hm-status--dev">{ORBIT.stage}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ═════════ 6 · Evidence ═════════ */
function Evidence() {
  return (
    <section className="hm-sec hm-sec--flush" id="evidence" aria-labelledby="hm-ev-title">
      <div className="hm-wrap">
        <div className="hm-head">
          <Kicker>Evidence</Kicker>
          <h2 className="hm-h2" id="hm-ev-title" data-hm-in>
            See the work. Understand the decisions.
          </h2>
          <p className="hm-lede" data-hm-in>
            Every example says what it is, what is real, and what is simulated.
          </p>
        </div>
        <div className="hm-ev">
          {EVIDENCE.map((item, i) => (
            <article
              className="hm-evc"
              key={item.title}
              data-hm-in
              style={{ "--d": `${i * 60}ms` } as CSSProperties}
            >
              <span className="hm-tag">{item.type}</span>
              <h3>{item.title}</h3>
              <dl>
                <div>
                  <dt>What is real</dt>
                  <dd>{item.real}</dd>
                </div>
                <div>
                  <dt>What is simulated</dt>
                  <dd>{item.simulated}</dd>
                </div>
              </dl>
              <Link className="hm-lnk" to={item.href}>
                {item.cta} <Arrow />
              </Link>
            </article>
          ))}
        </div>
        <div className="hm-lab" data-hm-in>
          <span>
            <b>From the lab:</b> a governance protocol for human-approved agent work, published with
            a DOI.
          </span>
          <Link
            className="hm-lnk"
            to="/research/$slug"
            params={{ slug: "cgp-v1" }}
            onClick={() =>
              trackCta({ cta: "view_research", section: "evidence", href: "/research/cgp-v1" })
            }
          >
            Read the protocol <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═════════ 7 · Delivery and trust ═════════ */
function Delivery() {
  return (
    <section className="hm-sec hm-sec--band" id="delivery" aria-labelledby="hm-dlv-title">
      <div className="hm-wrap">
        <div className="hm-head">
          <Kicker>How we deliver</Kicker>
          <h2 className="hm-h2" id="hm-dlv-title" data-hm-in>
            Know what is being built—and how it will be accepted.
          </h2>
        </div>
        <ol className="hm-dlv" data-hm-in>
          {DELIVERY_STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="hm-label hm-label--t">Step {i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="hm-trust" data-hm-in>
          <div className="hm-trust-l">
            <h3>The controls are part of the scope.</h3>
            <p>
              Before anything runs, we write down—with you—what the system may touch and who
              decides.
            </p>
            <p className="hm-accept">{ACCEPTANCE_GUARANTEE}</p>
          </div>
          <div className="hm-trust-r">
            {SCOPE_CONTROLS.map((item) => (
              <div key={item.title}>
                <b>{item.title}</b>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═════════ 8 · Company and close ═════════ */
function Company() {
  return (
    <section className="hm-sec hm-co" id="company" aria-labelledby="hm-co-title">
      <div className="hm-co-plate" aria-hidden="true">
        <img
          src="/media/precision/channel-1600.webp"
          srcSet="/media/precision/channel-960.webp 960w, /media/precision/channel-1600.webp 1600w"
          sizes="100vw"
          alt=""
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
          data-hm-par
        />
      </div>
      <div className="hm-wrap hm-co-grid">
        <div>
          <Kicker>Company</Kicker>
          <h2 className="hm-h2" id="hm-co-title" data-hm-in>
            {HOME_COMPANY.title}
          </h2>
        </div>
        <div data-hm-in>
          <p>{HOME_COMPANY.body}</p>
          <Link className="hm-lnk" to="/company">
            About Cyryx Labs <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Close() {
  const [intent, setIntent] = useState<StartContextIntent>(HOME_INTENTS[0].intent);
  const [choice, setChoice] = useState(0);
  const href = buildStartProjectHref({ source: "home", intent });
  return (
    <section className="hm-close" id="contact" aria-labelledby="hm-close-title">
      <div className="hm-wrap">
        <div className="hm-close-box" data-hm-in>
          <div>
            <h2 className="hm-h2" id="hm-close-title">
              {HOME_CLOSE.title}
            </h2>
            <p className="hm-lede">{HOME_CLOSE.body}</p>
          </div>
          <div>
            <fieldset className="hm-intent">
              <legend>{HOME_CLOSE.legend}</legend>
              <div className="hm-chips">
                {HOME_INTENTS.map((item, i) => (
                  <label key={item.label}>
                    <input
                      type="radio"
                      name="hm-intent"
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
              href={href}
              className="hm-btn hm-btn--pri hm-close-btn"
              onClick={() => trackCta({ cta: "start_project", section: "final_cta", href })}
            >
              Discuss your project <Arrow />
            </a>
            <p className="hm-after">{HOME_CLOSE.after}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
