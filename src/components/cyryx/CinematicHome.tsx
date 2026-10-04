import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import poster from "@/assets/cyryx-hero-poster-1920.webp";
import posterSmall from "@/assets/cyryx-hero-poster-960.webp";
import { ExecutionTrace } from "./ExecutionTrace";
import { EvidenceBeforeClaims } from "./v4/EvidenceBeforeClaims";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import "./cinematic.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  {
    number: "01",
    title: "Build the product.",
    body: "Custom software, AI features and internal tools, shaped around the people who use them.",
    href: "/solutions/custom-ai-product-development",
    note: "Product engineering",
  },
  {
    number: "02",
    title: "Connect the work.",
    body: "Integrations and AI-enabled workflows that connect your existing systems, data and decisions.",
    href: "/solutions/workflow-automation",
    note: "Workflow automation",
  },
  {
    number: "03",
    title: "Find the right starting point.",
    body: "Consulting to define the problem, assess feasibility and decide what is worth building.",
    href: "/solutions/ai-strategy-advisory",
    note: "Strategy & advisory",
  },
  {
    number: "04",
    title: "Keep people in control.",
    body: "Permissions, human approval, evaluation and cost visibility designed into the system.",
    href: "/solutions/ai-governance-cost-control",
    note: "Governance & cost control",
  },
] as const;

/** A native-scroll narrative. Text is never hidden behind a motion prerequisite. */
export function CinematicHome() {
  const root = useRef<HTMLDivElement>(null);
  const startHref = buildStartProjectHref({ source: "home" });
  const assistantEnabled = isAssistantEnabled();

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (document.documentElement.classList.contains("cx-low-perf")) return;
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
          "[data-cinema-wire]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "#controlled-execution",
              start: "top 75%",
              end: "center 45%",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          "[data-cinema-aperture]",
          { scaleX: 0.1 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "#security",
              start: "top 90%",
              end: "center 55%",
              scrub: true,
            },
          },
        );
      });
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
          <p className="cinema-kicker">Cyryx Labs / Applied AI & software engineering</p>
          <h1 id="hero-heading">
            AI, built for <br />
            the <em>real</em> world<span className="cinema-period">.</span>
          </h1>
          <div className="cinema-hero-bottom">
            <div>
              <p className="cx-hero-sub">
                We build AI products and custom software that turns business problems into working
                systems.
              </p>
              <div className="cx-hero-ctas cinema-actions">
                <a
                  href={startHref}
                  data-cta="primary"
                  aria-label="Start a project with Cyryx Labs"
                  className="cx-btn-primary"
                  onClick={() =>
                    trackCta({ cta: "start_project", section: "hero", href: startHref })
                  }
                >
                  <span>Start a project</span>
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
                  <span>See how we work</span>
                  <ArrowUpRight size={16} aria-hidden />
                </Link>
              </div>
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
            <p className="cinema-hero-note">
              <span>From a useful idea</span>
              <span>to a system you can use.</span>
              <a href="#controlled-execution" aria-label="See an illustrative AI workflow">
                <ArrowDown size={18} aria-hidden />
              </a>
            </p>
          </div>
        </div>
        <div className="cinema-hero-caption cinema-width">
          <span>01 / The possibility</span>
          <span>Products. Custom systems. Applied research.</span>
        </div>
      </section>

      <section
        id="controlled-execution"
        className="cinema-workflow cinema-width"
        aria-labelledby="controlled-execution-heading"
        data-story-section
      >
        <div className="cinema-section-label">
          <span>02 / The work, made visible</span>
          <span>Illustrative workflow · not a client deployment</span>
        </div>
        <div className="cinema-workflow-grid">
          <div className="cinema-workflow-copy">
            <h2 id="controlled-execution-heading">
              An invoice arrives.
              <br />
              <em>A decision follows.</em>
            </h2>
            <p>
              AI can classify the invoice. Useful software connects that result to the right
              systems, the right person and a record of what happened.
            </p>
            <p>
              For example: read an invoice, check an agreed approval limit, route the exception to
              finance, and keep the decision on record. Payments stay outside this workflow.
            </p>
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
          <div className="cinema-workflow-evidence">
            <div
              className="cinema-invoice"
              role="img"
              aria-label="Illustrative invoice INV-2291 for $7,420, above a $5,000 automatic approval limit"
            >
              <div>
                <span>INVOICE / INV-2291</span>
                <span>Sample data</span>
              </div>
              <p>
                $7,420<span>.00</span>
              </p>
              <div className="cinema-invoice-rule" />
              <div>
                <span>Automatic approval limit</span>
                <strong>$5,000</strong>
              </div>
              <p className="cinema-approval">
                <span aria-hidden>↳</span> Human approval required
              </p>
            </div>
            <div className="cinema-wire" aria-hidden>
              <span data-cinema-wire />
            </div>
            <ExecutionTrace />
          </div>
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
            <span>03 / What we do</span>
            <span>Two ways to build with Cyryx</span>
          </div>
          <h2 id="operating-model-heading">
            Your business.
            <br />
            <em>Our engineering.</em>
          </h2>
          <div className="cinema-offer-grid">
            <div id="execution-gap" className="cinema-services">
              <p className="cinema-kicker">Custom systems / built around your needs</p>
              {SERVICES.map((service) => (
                <Link
                  key={service.number}
                  to={service.href}
                  className="cinema-service"
                  onClick={() =>
                    trackCta({
                      cta: "see_delivery",
                      section: "operating_model",
                      href: service.href,
                    })
                  }
                >
                  <span className="cinema-service-number">{service.number}</span>
                  <div>
                    <span className="cinema-service-note">{service.note}</span>
                    <h3>{service.title}</h3>
                    <p>{service.body}</p>
                  </div>
                  <ArrowUpRight size={22} aria-hidden />
                </Link>
              ))}
            </div>
            <article className="cinema-product" aria-labelledby="cinema-product-heading">
              <div className="cinema-product-top">
                <span>Our own software</span>
                <span className="cinema-product-status">Core available on npm</span>
              </div>
              <div className="cinema-product-symbol" aria-hidden>
                <span />
                <span />
                <span />
              </div>
              <div className="cinema-product-copy">
                <p className="cinema-kicker">Agentic execution & orchestration</p>
                <h3 id="cinema-product-heading">AEXOS</h3>
                <p>
                  A CLI-first framework for AI-assisted development. Specialized agents follow
                  defined procedures and quality gates inside your project.
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
                <p className="cinema-product-boundary">
                  A product you can install. Custom client systems have their own scope and
                  agreement.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        id="security"
        className="cinema-principle"
        aria-labelledby="security-heading"
        data-story-section
      >
        <div className="cinema-width">
          <p className="cinema-kicker">04 / The standard</p>
          <h2 id="security-heading">
            Power to act.
            <br />
            <em>Room for judgment.</em>
          </h2>
          <div className="cinema-aperture" data-cinema-aperture aria-hidden />
          <div className="cinema-controls">
            {[
              ["Authority", "Define what AI may read, write and change."],
              ["Human approval", "Keep consequential decisions with the right person."],
              ["Evidence", "Record the inputs, actions and approval behind a result."],
              ["Evaluation", "Check quality, exceptions and cost before expanding scope."],
            ].map(([title, body], index) => (
              <div key={title} data-governance-control>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="cinema-evidence">
        <EvidenceBeforeClaims />
      </div>

      <section
        id="research"
        className="cinema-research cinema-width"
        aria-labelledby="cinema-research-heading"
      >
        <p className="cinema-kicker">05 / The lab behind the work</p>
        <div className="cinema-research-grid">
          <h2 id="cinema-research-heading">
            Ideas tested.
            <br />
            <em>Thinking shared.</em>
          </h2>
          <div>
            <p>
              Applied research informs how we build. Explore the published Cyryx Governance
              Protocol, technical explanations and public code, and judge the work for yourself.
            </p>
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
          </div>
        </div>
      </section>

      <section id="team" className="cinema-founder cinema-width" aria-labelledby="team-heading">
        <p className="cinema-kicker">Founder-led. Direct by design.</p>
        <h2 id="team-heading">Work with Paulo.</h2>
        <p>
          Cyryx Labs is an independent, founder-led lab. You work directly with Paulo to define the
          problem and shape the software, from the first conversation through implementation.
        </p>
        <Link to="/company" className="cinema-text-link">
          Meet Cyryx Labs <ArrowUpRight size={16} aria-hidden />
        </Link>
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
            What should
            <br />
            <em>work better?</em>
          </h2>
          <div className="cinema-contact-bottom">
            <p>
              Tell us what you want to change. We’ll assess the fit and define a practical next
              step, including when a simpler approach makes more sense.
            </p>
            <div className="cinema-actions">
              <a
                href={startHref}
                className="cx-btn-primary"
                onClick={() =>
                  trackCta({ cta: "start_project", section: "final_cta", href: startHref })
                }
              >
                Start a project <ArrowRight size={18} aria-hidden />
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
