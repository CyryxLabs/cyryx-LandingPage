import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, ArrowRight, FileText, Workflow, Layers } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import poster from "@/assets/cyryx-hero-poster-1920.webp";
import posterSmall from "@/assets/cyryx-hero-poster-960.webp";
import { EvidenceBeforeClaims } from "./v4/EvidenceBeforeClaims";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import "./cinematic.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  {
    title: "Custom software & AI development",
    body: "Web applications, internal tools and AI features built around the work you need to do.",
    deliverables: "Applications / internal tools / AI features",
    href: "/solutions/custom-ai-product-development",
    view: "application",
  },
  {
    title: "Integrations & workflow automation",
    body: "Connect your existing systems and turn repetitive steps into workflows, with human review where appropriate.",
    deliverables: "APIs / data connections / workflow automation",
    href: "/solutions/workflow-automation",
    view: "workflow",
  },
  {
    title: "Consulting & applied research",
    body: "Work through a technical problem, test an idea and decide what is worth building.",
    deliverables: "Discovery / prototypes / feasibility testing",
    href: "/solutions/ai-strategy-advisory",
    view: "prototype",
  },
] as const;

/** An original application composition, labelled as a design illustration. */
function SoftwareComposition({
  view = "application",
  opening = false,
}: {
  view?: string;
  opening?: boolean;
}) {
  return (
    <div
      className="cinema-composition"
      data-view={view}
      data-opening={opening || undefined}
      role="img"
      aria-label={`Illustrative ${view} composition: interface, logic and connected systems. Not a client application.`}
    >
      <div className="cinema-plane cinema-plane-connections" data-cinema-plane>
        <span className="cinema-plane-label">03 / Connections</span>
        <div className="cinema-system-nodes">
          <span>Documents</span>
          <i />
          <span>API</span>
          <i />
          <span>Data</span>
        </div>
        <div className="cinema-system-line" />
      </div>
      <div className="cinema-plane cinema-plane-logic" data-cinema-plane>
        <span className="cinema-plane-label">02 / Logic</span>
        <div className="cinema-logic-row">
          <span>Input</span>
          <ArrowRight size={16} />
          <span>Rules + AI</span>
          <ArrowRight size={16} />
          <span>Review</span>
        </div>
        <div className="cinema-logic-code">
          <span>WHEN a task arrives</span>
          <span>CHECK the required information</span>
          <span>ROUTE to the next step</span>
        </div>
      </div>
      <div className="cinema-plane cinema-plane-interface" data-cinema-plane>
        <div className="cinema-app-bar">
          <span className="cinema-app-mark" /> <span>WORKSPACE</span>
          <span>Design illustration</span>
        </div>
        <div className="cinema-app-body">
          <div className="cinema-app-sidebar">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="cinema-app-main">
            <p className="cinema-app-eyebrow">01 / Interface</p>
            <p className="cinema-app-title">
              {view === "workflow"
                ? "Connected work."
                : view === "prototype"
                  ? "An idea, tested."
                  : "Everything in its place."}
            </p>
            <div className="cinema-app-columns">
              <div>
                <span>Incoming</span>
                <i />
                <i />
              </div>
              <div>
                <span>In progress</span>
                <i />
              </div>
              <div>
                <span>For review</span>
                <i />
              </div>
            </div>
            <div className="cinema-app-footer">
              <span className="cinema-app-dot" /> A clear next step <span>→</span>
            </div>
          </div>
        </div>
      </div>
      <div className="cinema-composition-caption">
        <span>Interface</span>
        <span>Logic</span>
        <span>Connections</span>
      </div>
    </div>
  );
}

/** Native scrolling, finite motion and a complete server-rendered fallback. */
export function CinematicHome() {
  const root = useRef<HTMLDivElement>(null);
  const [service, setService] = useState(0);
  const startHref = buildStartProjectHref({ source: "home" });
  const assistantEnabled = isAssistantEnabled();

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 768px)" },
        (context) => {
          if (!context.conditions?.motion) return;
          const desktop = context.conditions.desktop;
          if (document.documentElement.classList.contains("cx-low-perf")) return;
          gsap.fromTo(
            "[data-opening] [data-cinema-plane]",
            { y: 48, x: 24, opacity: 0.35 },
            {
              y: 0,
              x: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.12,
              ease: "power3.out",
              clearProps: "transform,opacity",
            },
          );
          gsap.fromTo(
            "[data-cinema-open]",
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-hero]",
                start: "top top",
                end: "bottom 30%",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            "[data-cinema-art]",
            { y: 0 },
            {
              y: 55,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-hero]",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            "[data-cinema-invoice-line]",
            { scaleX: desktop ? 0 : 1, scaleY: desktop ? 1 : 0 },
            {
              scaleX: 1,
              scaleY: 1,
              duration: 1.2,
              ease: "power2.inOut",
              scrollTrigger: { trigger: "[data-invoice-example]", start: "top 80%", once: true },
            },
          );
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="cinema-home">
      <section id="top" data-hero aria-labelledby="hero-heading" className="cinema-hero">
        <div className="cinema-art" data-cinema-art aria-hidden="true">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/media/hero-sequence/mobile/cyryx-hero-frame-001.webp"
            />
            <img
              src="/media/hero-sequence/desktop/cyryx-hero-frame-001.webp"
              width="1920"
              height="1080"
              alt=""
              fetchPriority="high"
              data-hero-poster
            />
          </picture>
          <picture data-cinema-open className="cinema-open">
            <source media="(max-width: 767px)" srcSet={posterSmall} />
            <img src={poster} width="1920" height="1080" alt="" />
          </picture>
        </div>
        <div className="cinema-hero-inner cinema-width">
          <p className="cinema-kicker">Cyryx Labs / Founder-led software & AI company</p>
          <h1 id="hero-heading">
            Custom software <br />
            and AI for the way <br />
            <em>your business works.</em>
          </h1>
          <div className="cinema-hero-bottom">
            <div>
              <p className="cx-hero-sub">
                We build applications, connect systems and automate workflows. We help you decide
                what’s worth building—and turn it into working software.
              </p>
              <div className="cx-hero-ctas cinema-actions">
                <a
                  href={startHref}
                  data-cta="primary"
                  className="cx-btn-primary"
                  onClick={() =>
                    trackCta({ cta: "start_project", section: "hero", href: startHref })
                  }
                >
                  <span>Tell us about your project</span>
                  <ArrowUpRight size={16} aria-hidden />
                </a>
                <Link
                  to="/engagement-model"
                  data-cta="secondary"
                  className="cinema-text-link"
                  onClick={() =>
                    trackCta({ cta: "see_how_we_work", section: "hero", href: "/engagement-model" })
                  }
                >
                  <span>Explore our services</span>
                  <ArrowUpRight size={16} aria-hidden />
                </Link>
              </div>
              <p className="cinema-first-step">
                Start with a short project brief. We’ll assess the fit.
              </p>
              {assistantEnabled && (
                <button
                  type="button"
                  className="cinema-hero-assistant"
                  onClick={() => openAssistant("hero")}
                >
                  Have a question? Ask the Cyryx assistant.
                </button>
              )}
            </div>
          </div>
          <div className="cinema-hero-software">
            <SoftwareComposition opening />
          </div>
        </div>
        <div className="cinema-hero-caption cinema-width">
          <span>01 / From business problem to working software</span>
          <a href="#operating-model" aria-label="See what Cyryx builds">
            <ArrowDown size={18} aria-hidden />
          </a>
        </div>
      </section>

      <section
        id="operating-model"
        className="cinema-offer"
        aria-labelledby="operating-model-heading"
        data-story-section
      >
        <div className="cinema-width">
          <div className="cinema-section-label">
            <span>02 / What we build</span>
            <span>Client services / defined around your problem</span>
          </div>
          <div className="cinema-offer-intro">
            <h2 id="operating-model-heading">
              Built around
              <br />
              <em>your work.</em>
            </h2>
            <p>
              A missing tool. Disconnected systems. An idea that needs testing. We turn the problem
              into a practical scope—and the scope into software.
            </p>
          </div>
          <div className="cinema-offer-grid">
            <div id="execution-gap" className="cinema-services">
              <p className="cinema-kicker">Three ways to build / around your needs</p>
              {SERVICES.map((item, index) => (
                <article
                  className="cinema-service"
                  key={item.title}
                  data-selected={index === service}
                >
                  <span className="cinema-service-number">0{index + 1}</span>
                  <div>
                    <h3>
                      <button
                        type="button"
                        aria-pressed={index === service}
                        aria-controls="service-visual"
                        onClick={() => setService(index)}
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p>{item.body}</p>
                    <p className="cinema-deliverables">{item.deliverables}</p>
                    <Link
                      to={item.href}
                      className="cinema-service-link"
                      onClick={() =>
                        trackCta({
                          cta: "see_delivery",
                          section: "operating_model",
                          href: item.href,
                        })
                      }
                    >
                      Explore this service <ArrowUpRight size={14} aria-hidden />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div id="service-visual" className="cinema-service-stage">
              <span className="cinema-stage-label">A system takes shape / illustrative design</span>
              <SoftwareComposition view={SERVICES[service].view} />
              <p>Select a service to explore the structure.</p>
            </div>
          </div>
          <div className="cinema-fit" aria-labelledby="cinema-fit-heading">
            <h2 id="cinema-fit-heading">
              What needs to
              <br />
              <em>work better?</em>
            </h2>
            <div>
              <p>“We need a tool our current software doesn’t provide.”</p>
              <p>“Work gets stuck between our systems.”</p>
              <p>“We have an AI idea. We need to know if it’s feasible.”</p>
              <a
                href={startHref}
                className="cinema-text-link"
                onClick={() =>
                  trackCta({ cta: "start_project", section: "paths", href: startHref })
                }
              >
                Tell us where you’re starting <ArrowUpRight size={16} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="controlled-execution"
        className="cinema-workflow cinema-width"
        aria-labelledby="controlled-execution-heading"
        data-story-section
      >
        <div className="cinema-section-label">
          <span>03 / One example of connected work</span>
          <span>Illustrative workflow · not a client deployment</span>
        </div>
        <div className="cinema-workflow-intro">
          <h2 id="controlled-execution-heading">
            From a document.
            <br />
            <em>To a useful next step.</em>
          </h2>
          <p>
            An invoice becomes structured data, then an accounting draft in a connected system. A
            person checks it before anything proceeds. Payments stay outside this workflow.
          </p>
        </div>
        <div
          className="cinema-invoice-stage"
          data-invoice-example
          role="figure"
          aria-label="Illustrative invoice to accounting draft. Sample data; ready for human review, not approved."
        >
          <div className="cinema-invoice">
            <span className="cinema-plane-label">01 / Document</span>
            <FileText size={28} aria-hidden />
            <p>
              Invoice
              <br />
              <strong>INV-2291</strong>
            </p>
            <div className="cinema-invoice-rule" />
            <span>Sample total</span>
            <p className="cinema-invoice-amount">$7,420.00</p>
          </div>
          <div className="cinema-invoice-connector" aria-hidden>
            <span data-cinema-invoice-line />
            <ArrowRight size={20} />
          </div>
          <div className="cinema-structured">
            <span className="cinema-plane-label">02 / Structured data</span>
            <dl>
              <div>
                <dt>reference</dt>
                <dd>INV-2291</dd>
              </div>
              <div>
                <dt>amount</dt>
                <dd>7420.00</dd>
              </div>
              <div>
                <dt>currency</dt>
                <dd>USD</dd>
              </div>
              <div>
                <dt>destination</dt>
                <dd>Accounting draft</dd>
              </div>
            </dl>
            <span className="cinema-review-note">Check extracted fields</span>
          </div>
          <div className="cinema-invoice-connector" aria-hidden>
            <span data-cinema-invoice-line />
            <ArrowRight size={20} />
          </div>
          <div className="cinema-draft">
            <span className="cinema-plane-label">03 / Connected system</span>
            <Workflow size={28} aria-hidden />
            <h3>Accounting draft</h3>
            <p>Invoice and source document together, prepared for a person to check.</p>
            <span className="cinema-draft-status">Ready for review</span>
          </div>
        </div>
        <div className="cinema-example-footer">
          <p>Sample data / No payment or approval has taken place.</p>
          <Link
            to="/solutions/workflow-automation"
            className="cinema-text-link"
            onClick={() =>
              trackCta({
                cta: "see_delivery",
                section: "operating_model",
                href: "/solutions/workflow-automation",
              })
            }
          >
            Explore workflow automation <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      </section>

      <section
        id="security"
        className="cinema-principle"
        aria-labelledby="security-heading"
        data-story-section
      >
        <div className="cinema-width">
          <div className="cinema-section-label">
            <span>04 / How we build</span>
            <span>A practical path from problem to software</span>
          </div>
          <div className="cinema-approach">
            <h2 id="security-heading">
              Understand.
              <br />
              Build.
              <br />
              <em>Connect.</em>
            </h2>
            <div>
              <p>
                Define the problem, the people using the system and what a useful result looks like.
                Build and test the smallest useful version. Connect it to the work it needs to
                support.
              </p>
              <div className="cinema-controls">
                {[
                  ["Permissions", "Agree what the system may read, write and change."],
                  ["Human review", "Keep people involved where a decision needs judgment."],
                  ["Testing", "Check real scenarios and exceptions against the agreed scope."],
                  [
                    "Cost visibility",
                    "Make model and operating costs visible as the system develops.",
                  ],
                ].map(([title, body], index) => (
                  <div key={title} data-governance-control>
                    <span>0{index + 1}</span>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="cinema-evidence">
        <EvidenceBeforeClaims />
      </div>

      <section id="our-products" className="cinema-products" aria-labelledby="our-products-heading">
        <div className="cinema-width cinema-products-grid">
          <div>
            <p className="cinema-kicker">05 / Our products</p>
            <h2 id="our-products-heading">
              We build for clients.
              <br />
              <em>And for ourselves.</em>
            </h2>
            <p>
              Our own product development is part of the lab. AEXOS is available independently of a
              client engagement.
            </p>
            <Link to="/products" className="cinema-text-link">
              Explore our products <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
          <article className="cinema-product" aria-labelledby="cinema-product-heading">
            <div className="cinema-product-top">
              <span>CLI-first framework</span>
              <span className="cinema-product-status">Core available on npm</span>
            </div>
            <Layers size={48} strokeWidth={1} className="cinema-product-icon" aria-hidden />
            <h3 id="cinema-product-heading">AEXOS</h3>
            <p>
              A framework for AI-assisted development. Specialized agents follow defined procedures
              and quality gates inside your project.
            </p>
            <div className="cinema-command">
              <span aria-hidden>$ </span>
              <code>{AEXOS_PRODUCT.installCommand}</code>
            </div>
            <Link
              to="/products/aexos"
              className="cinema-text-link"
              onClick={() =>
                trackCta({
                  cta: "view_product",
                  section: "operating_model",
                  href: "/products/aexos",
                })
              }
            >
              Explore AEXOS & its license <ArrowUpRight size={16} aria-hidden />
            </Link>
          </article>
        </div>
      </section>

      <section
        id="research"
        className="cinema-research cinema-width"
        aria-labelledby="cinema-research-heading"
      >
        <div>
          <p className="cinema-kicker">The lab behind the work</p>
          <h2 id="cinema-research-heading">Thinking, made public.</h2>
          <p>
            Research, technical explanations and public code give you a way to inspect our thinking.
            These are research and product resources, not client case studies.
          </p>
        </div>
        <div className="cinema-research-links">
          <Link
            to="/research/$slug"
            params={{ slug: "cgp-v1" }}
            onClick={() =>
              trackCta({ cta: "read_cgp", section: "research_band", href: "/research/cgp-v1" })
            }
          >
            Cyryx Governance Protocol v1 <ArrowUpRight size={18} aria-hidden />
          </Link>
          <Link
            to="/answers"
            onClick={() =>
              trackCta({ cta: "proof_link", section: "research_band", href: "/answers" })
            }
          >
            Technical answers <ArrowUpRight size={18} aria-hidden />
          </Link>
          <a
            href="https://github.com/CyryxLabs"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackCta({
                cta: "proof_link",
                section: "proof_strip",
                href: "https://github.com/CyryxLabs",
              })
            }
          >
            Public code on GitHub <ArrowUpRight size={18} aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>

      <section id="team" className="cinema-founder" aria-labelledby="team-heading">
        <div className="cinema-width">
          <p className="cinema-kicker">Founder-led / Direct by design</p>
          <h2 id="team-heading">Work with Paulo.</h2>
          <p>
            Cyryx Labs is an independent, founder-led software and AI company. Work directly with
            Paulo to define the problem and shape the software.
          </p>
          <Link to="/company" className="cinema-text-link">
            Meet Cyryx Labs <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      </section>
      <section
        id="contact"
        className="cinema-contact"
        aria-labelledby="contact-heading"
        data-story-section
      >
        <div className="cinema-width">
          <p className="cinema-kicker">06 / Start with the problem</p>
          <h2 id="contact-heading">
            Let’s make
            <br />
            <em>the work work.</em>
          </h2>
          <div className="cinema-contact-bottom">
            <p>
              Start with a short project brief: what you need, what is getting in the way and what a
              useful outcome would look like. We’ll assess the fit and a practical next step.
            </p>
            <div className="cinema-actions">
              <a
                href={startHref}
                className="cx-btn-primary"
                onClick={() =>
                  trackCta({ cta: "start_project", section: "final_cta", href: startHref })
                }
              >
                Tell us about your project <ArrowRight size={18} aria-hidden />
              </a>
              <Link to="/contact" className="cinema-text-link">
                Get in touch <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
          {assistantEnabled && (
            <button
              type="button"
              className="cinema-assistant"
              onClick={() => openAssistant("final_cta")}
            >
              Prefer to ask first? Chat with the Cyryx assistant.
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
