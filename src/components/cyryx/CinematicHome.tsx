import { useEffect, useId, useRef, useState, type ComponentType, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  FileText,
  Workflow,
  Check,
  Terminal,
  Code2,
} from "lucide-react";
import { EvidenceBeforeClaims } from "./v4/EvidenceBeforeClaims";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import "./cinematic.css";

const SERVICES = [
  {
    title: "Applications & websites",
    body: "Custom web applications, websites and internal tools designed around your business and the people using them.",
    deliverables: "Web applications / websites / internal tools",
    href: "/solutions/custom-ai-product-development",
    view: "application",
  },
  {
    title: "Connected systems & automation",
    body: "Connect the tools you already use. Move information between systems and automate repetitive steps with review where it matters.",
    deliverables: "API integrations / data connections / workflow automation",
    href: "/solutions/workflow-automation",
    view: "workflow",
  },
  {
    title: "AI agents & applied AI",
    body: "Build assistants, agents and AI features for a defined task, with clear access, boundaries and testing.",
    deliverables: "AI assistants / agents / AI features",
    href: "/solutions/internal-ai-assistants",
    view: "agent",
  },
] as const;

/** Original drawing of a brief becoming a connected, usable application. */
function SystemIllustration({
  view = "application",
  opening = false,
  compact = false,
}: {
  view?: string;
  opening?: boolean;
  compact?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const title =
    view === "workflow"
      ? "Connected work."
      : view === "agent"
        ? "A task, with boundaries."
        : "Your work. In software.";
  return (
    <div
      className={"cinema-composition" + (compact ? " cinema-composition-compact" : "")}
      data-view={view}
      data-opening={opening || undefined}
      role="img"
      aria-label={
        "Illustrative " +
        view +
        " build: a brief becomes interface, logic and connections. Not a client application."
      }
    >
      <svg viewBox={compact ? "0 175 640 200" : "0 0 640 560"} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={id + "-metal"} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ebf0ef" />
            <stop offset=".45" stopColor="#a3b5b4" />
            <stop offset="1" stopColor="#5e7672" />
          </linearGradient>
        </defs>
        {!compact && (
          <g className="studio-grid" stroke="#31514e" strokeWidth=".7" fill="none">
            <path d="M0 80H640M0 480H640M80 0V560M560 0V560" />
            <path d="M68 80h24m-12-12v24M548 80h24m-12-12v24M68 480h24m-12-12v24M548 480h24m-12-12v24" />
          </g>
        )}
        <g className="studio-input" data-build-node>
          <path d="M30 195h96l22 22v130H30z" fill="#152624" stroke="#6a8b88" />
          <path d="M126 195v22h22" fill="none" stroke="#a4c2bf" />
          <text x="46" y="241" fill="#e4eeea" fontSize="14">
            THE BRIEF
          </text>
          <path d="M46 260h80m-80 12h66m-66 12h78" stroke="#729593" />
          <text x="46" y="323" fill="#accbc8" fontSize="10">
            A real problem.
          </text>
        </g>
        <g fill="none" strokeWidth="1.5">
          <path d="M148 272H230M326 272H382" stroke="#638b89" />
          <path
            data-signal
            className="studio-signal"
            pathLength="1"
            d="M148 272H230M326 272H382"
            stroke="#21cfcb"
          />
          {!compact && (
            <>
              <path d="M278 215V129H426V187M278 326v98H426v-42" stroke="#476b69" />
              <path
                data-signal
                className="studio-signal"
                pathLength="1"
                d="M278 215V129H426V187M278 326v98H426v-42"
                stroke="#21cfcb"
              />
            </>
          )}
        </g>
        <g className="studio-processor" data-build-node>
          <rect
            x="230"
            y="215"
            width="96"
            height="112"
            rx="2"
            fill={"url(#" + id + "-metal)"}
            stroke="#daebe9"
          />
          <path d="M252 239l26 24 26-24v56l-26-24-26 24z" fill="#113d3c" />
          <text x="278" y="316" textAnchor="middle" fill="#113d3c" fontSize="9">
            CYRYX
          </text>
        </g>
        <g className="studio-screen cinema-plane-interface" data-build-node>
          <rect x="382" y="187" width="234" height="195" rx="3" fill="#e5ecea" stroke="#b5d2ce" />
          <rect x="382" y="187" width="234" height="27" fill="#bdd0ce" />
          <path d="M395 201h9m5 0h5" stroke="#2a5350" strokeWidth="2" />
          <text x="604" y="204" textAnchor="end" fill="#244d4a" fontSize="8">
            WORKSPACE
          </text>
          <text x="398" y="240" fill="#193b39" fontSize="12">
            {title}
          </text>
          <rect x="398" y="257" width="202" height="29" fill="#cbdcd9" />
          <rect x="398" y="292" width="202" height="29" fill="#d4e1df" />
          <text x="409" y="276" fill="#275955" fontSize="10">
            {view === "agent" ? "Task + permitted tools" : "A useful application"}
          </text>
          <text x="409" y="311" fill="#275955" fontSize="10">
            {view === "workflow" ? "Systems, connected" : "Information, connected"}
          </text>
          <path d="M401 350l5 5 9-10" fill="none" stroke="#126a65" strokeWidth="2" />
          <text x="424" y="354" fill="#275955" fontSize="10">
            Ready for human review
          </text>
        </g>
        {!compact && (
          <g fontSize="10" fill="#b7cfcc">
            <text x="30" y="180">
              01 / UNDERSTAND
            </text>
            <text x="232" y="200">
              02 / DESIGN
            </text>
            <text x="383" y="171">
              03 / BUILD & CONNECT
            </text>
            <text x="289" y="119">
              LOGIC + AI
            </text>
            <text x="289" y="447">
              EXISTING SYSTEMS
            </text>
            <text x="320" y="520" textAnchor="middle" fill="#88aaa8">
              ILLUSTRATIVE BUILD / NOT A CLIENT APPLICATION
            </text>
          </g>
        )}
      </svg>
      {!compact && (
        <div className="cinema-composition-caption">
          <span>Interface</span>
          <span>Logic</span>
          <span>Connections</span>
        </div>
      )}
    </div>
  );
}

/** Complete SSR states, native scrolling, scoped and finite GSAP choreography. */
export function CinematicHome() {
  const root = useRef<HTMLDivElement>(null);
  const [service, setService] = useState(0);
  const startHref = buildStartProjectHref({ source: "home" });
  const assistantEnabled = isAssistantEnabled();
  const [Motion, setMotion] = useState<ComponentType<{
    root: RefObject<HTMLDivElement | null>;
  }> | null>(null);
  useEffect(() => {
    let cancelled = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const loadMotion = () => {
      if (preference.matches || document.documentElement.classList.contains("cx-low-perf")) return;
      // Load the optional choreography after hydration; the complete SVG is already readable.
      void import("./CinematicHomeMotion")
        .then(({ CinematicHomeMotion }) => {
          if (!cancelled) setMotion(() => CinematicHomeMotion);
        })
        .catch(() => {});
    };
    loadMotion();
    preference.addEventListener("change", loadMotion);
    return () => {
      cancelled = true;
      preference.removeEventListener("change", loadMotion);
    };
  }, []);

  return (
    <div ref={root} className="cinema-home">
      {Motion && <Motion root={root} />}
      <section id="top" data-hero aria-labelledby="hero-heading" className="cinema-hero">
        <div className="cinema-hero-inner cinema-width">
          <div className="cinema-hero-copy">
            <p className="cinema-kicker">Cyryx / AI & software company</p>
            <h1 id="hero-heading">
              <span className="cinema-heading-line">
                <span className="cinema-heading-from">From idea</span>{" "}
                <span className="cinema-heading-to">to software.</span>
              </span>{" "}
              <span className="cinema-heading-line">
                <span className="cinema-heading-from">From AI</span>{" "}
                <span className="cinema-heading-to cinema-heading-accent">to action.</span>
              </span>
            </h1>
            <p className="cx-hero-sub">
              We develop our own AI products, build custom software for clients, and help teams
              decide what to build next.
            </p>
            <div className="cinema-mobile-build">
              <SystemIllustration opening compact />
            </div>
            <div className="cx-hero-ctas cinema-actions">
              <a
                href={startHref}
                data-cta="primary"
                className="cx-btn-primary"
                onClick={() => trackCta({ cta: "start_project", section: "hero", href: startHref })}
              >
                <span>Tell us about your project</span>
                <ArrowUpRight size={17} aria-hidden />
              </a>
              <a
                href="#cyryx-offer"
                data-cta="secondary"
                className="cinema-text-link"
                onClick={() =>
                  trackCta({ cta: "see_how_we_work", section: "hero", href: "#cyryx-offer" })
                }
              >
                Explore Cyryx <ArrowDown size={16} aria-hidden />
              </a>
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
          <div className="cinema-hero-software">
            <div className="cinema-studio-label">
              <span>From a real problem</span>
              <span>To working software</span>
            </div>
            <SystemIllustration opening />
            <p className="cinema-studio-note">
              A brief. A designed system. Software people can use.
            </p>
          </div>
        </div>
        <div className="cinema-width cinema-hero-footer">
          <span data-hero-rule />
          <p>Founder-led. Built with intent.</p>
          <span>
            Scroll to explore <ArrowDown size={14} aria-hidden />
          </span>
        </div>
      </section>
      <nav id="cyryx-offer" className="cinema-paths cinema-width" aria-label="Explore Cyryx">
        <Link to="/products">
          <span className="cinema-path-number">01</span>
          <div>
            <strong>Our products</strong>
            <p>AEXOS / our own AI software</p>
          </div>
          <ArrowUpRight size={22} aria-hidden />
        </Link>
        <a
          href={startHref}
          onClick={() => trackCta({ cta: "start_project", section: "paths", href: startHref })}
        >
          <span className="cinema-path-number">02</span>
          <div>
            <strong>Custom development</strong>
            <p>Applications / websites / AI workflows</p>
          </div>
          <ArrowUpRight size={22} aria-hidden />
        </a>
        <Link to="/solutions/ai-strategy-advisory">
          <span className="cinema-path-number">03</span>
          <div>
            <strong>Consulting</strong>
            <p>Strategy / feasibility / a practical plan</p>
          </div>
          <ArrowUpRight size={22} aria-hidden />
        </Link>
      </nav>
      <section
        id="operating-model"
        className="cinema-offer"
        aria-labelledby="operating-model-heading"
        data-story-section
      >
        <div className="cinema-width">
          <div className="cinema-section-label">
            <span>01 / Custom development</span>
            <span>Designed for the way you work</span>
          </div>
          <div className="cinema-offer-intro">
            <h2 id="operating-model-heading">
              Your business.
              <br />
              <em>Your software.</em>
            </h2>
            <p>
              A better customer experience. A missing internal tool. Work that gets stuck between
              systems. We design and build the software that makes the next step possible.
            </p>
          </div>
          <div className="cinema-offer-grid">
            <div id="execution-gap" className="cinema-services">
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
              <span className="cinema-stage-label">One connected system / illustrative build</span>
              <SystemIllustration view={SERVICES[service].view} />
              <p>Choose a capability. See how the work connects.</p>
            </div>
          </div>
          <div className="cinema-build-foot">
            <span>
              <Code2 size={18} aria-hidden /> Interface. Logic. Connections.
            </span>
            <a
              href={startHref}
              className="cinema-text-link"
              onClick={() => trackCta({ cta: "start_project", section: "paths", href: startHref })}
            >
              Build a solution <ArrowUpRight size={16} aria-hidden />
            </a>
          </div>
        </div>
      </section>
      <section
        id="controlled-execution"
        className="cinema-workflow"
        aria-labelledby="controlled-execution-heading"
        data-story-section
      >
        <div className="cinema-width">
          <div className="cinema-section-label">
            <span>02 / Connected work, in practice</span>
            <span>Illustrative workflow / sample data</span>
          </div>
          <div className="cinema-workflow-intro">
            <h2 id="controlled-execution-heading">
              Less moving data.
              <br />
              <em>More moving forward.</em>
            </h2>
            <p>
              One example: an invoice becomes structured information, then a draft in your
              accounting system. A person reviews it before anything proceeds.
            </p>
          </div>
          <div
            className="cinema-invoice-stage"
            data-invoice-example
            role="figure"
            aria-label="Illustrative invoice to accounting draft. Sample data; ready for human review, not approved."
          >
            <div className="cinema-invoice">
              <span className="cinema-plane-label">01 / A document arrives</span>
              <FileText size={26} aria-hidden />
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
              <span className="cinema-plane-label">02 / The fields connect</span>
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
              <span className="cinema-plane-label">03 / A useful next step</span>
              <Workflow size={27} aria-hidden />
              <h3>Accounting draft</h3>
              <p>The invoice and source document together, prepared for a person to check.</p>
              <span className="cinema-draft-status">
                <Check size={14} aria-hidden />
                Ready for review
              </span>
            </div>
          </div>
          <div className="cinema-example-footer">
            <p>
              Design illustration, not a client deployment. No payment or approval has taken place.
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
              Explore automation <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      <section
        id="our-products"
        className="cinema-products"
        aria-labelledby="our-products-heading"
        data-story-section
      >
        <div className="cinema-width">
          <div className="cinema-section-label">
            <span>03 / Our products</span>
            <span>Built in the lab / available independently</span>
          </div>
          <div className="cinema-products-grid">
            <div className="cinema-product-copy">
              <p className="cinema-kicker">Our own product development</p>
              <h2 id="our-products-heading">
                AI software.
                <br />
                <em>By Cyryx.</em>
              </h2>
              <p>
                We turn our own ideas into products, too. AEXOS brings agents, procedures and
                quality gates into AI-assisted development.
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
              <h3 id="cinema-product-heading">AEXOS</h3>
              <p>
                Specialized AI agents, the procedures they follow, and the checks they must
                pass—inside your project.
              </p>
              <div className="cinema-terminal" data-product-terminal>
                <div className="cinema-terminal-bar">
                  <Terminal size={14} aria-hidden />
                  <span>@aexos/core</span>
                  <span>Installation commands</span>
                </div>
                <div data-product-command>
                  <span>NEW PROJECT</span>
                  <code>
                    <span aria-hidden>$ </span>
                    {AEXOS_PRODUCT.installCommand}
                  </code>
                </div>
                <div data-product-command>
                  <span>EXISTING REPOSITORY</span>
                  <code>
                    <span aria-hidden>$ </span>
                    {AEXOS_PRODUCT.existingProjectCommand}
                  </code>
                </div>
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
        </div>
      </section>
      <section
        id="consulting"
        className="cinema-consulting cinema-width"
        aria-labelledby="consulting-heading"
        data-story-section
      >
        <div className="cinema-section-label">
          <span>04 / Consulting & applied research</span>
          <span>From strategy through implementation</span>
        </div>
        <div className="cinema-consulting-intro">
          <div>
            <p className="cinema-kicker">Clarity before commitment</p>
            <h2 id="consulting-heading">
              Find the right
              <br />
              <em>thing to build.</em>
            </h2>
          </div>
          <div>
            <p>
              Work through the opportunity with us. Assess technical feasibility, test the approach
              and define a practical path to implementation.
            </p>
            <Link to="/solutions/ai-strategy-advisory" className="cinema-text-link">
              Explore consulting <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
        <div className="cinema-consulting-steps">
          {[
            [
              "01",
              "Understand the question",
              "Map the problem, existing systems and what a useful result would mean.",
              "Discovery notes / requirements",
            ],
            [
              "02",
              "Test the approach",
              "Investigate the technical unknowns with a focused prototype or feasibility test.",
              "Prototype / feasibility findings",
            ],
            [
              "03",
              "Define the next build",
              "Turn the findings into a practical scope, architecture and implementation plan.",
              "Build plan / technical direction",
            ],
          ].map(([number, title, body, output]) => (
            <article key={number}>
              <span className="cinema-consulting-rule" data-consulting-line />
              <span className="cinema-consulting-number">{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <span className="cinema-consulting-output">{output}</span>
            </article>
          ))}
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
            <span>05 / How we build</span>
            <span>Clear scope / deliberate decisions</span>
          </div>
          <div className="cinema-approach">
            <div>
              <h2 id="security-heading">
                Build it with
                <br />
                <em>intent.</em>
              </h2>
              <p>
                Define the problem. Build and test a useful version. Connect it to the work it needs
                to support.
              </p>
              <Link to="/engagement-model" className="cinema-text-link">
                How an engagement works <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>
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
      </section>
      <div className="cinema-evidence">
        <EvidenceBeforeClaims />
      </div>
      <section
        id="research"
        className="cinema-research cinema-width"
        aria-labelledby="cinema-research-heading"
      >
        <div>
          <p className="cinema-kicker">Public research & product resources</p>
          <h2 id="cinema-research-heading">
            The thinking
            <br />
            <em>behind the work.</em>
          </h2>
          <p>
            Explore published research, technical explanations and public code. A way to inspect our
            approach and the ideas we develop.
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
            <span>
              <small>RESEARCH</small>Cyryx Governance Protocol v1
            </span>
            <ArrowUpRight size={20} aria-hidden />
          </Link>
          <Link
            to="/answers"
            onClick={() =>
              trackCta({ cta: "proof_link", section: "research_band", href: "/answers" })
            }
          >
            <span>
              <small>EXPLAINERS</small>Technical answers
            </span>
            <ArrowUpRight size={20} aria-hidden />
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
            <span>
              <small>CODE</small>Cyryx Labs on GitHub
            </span>
            <ArrowUpRight size={20} aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </section>
      <section id="team" className="cinema-founder" aria-labelledby="team-heading">
        <div className="cinema-width">
          <p className="cinema-kicker">Independent / Founder-led</p>
          <h2 id="team-heading">Direct by design.</h2>
          <div>
            <p>
              Work directly with Paulo. Cyryx Labs is an independent AI and software company
              developing its own products and building software for clients.
            </p>
            <Link to="/company" className="cinema-text-link">
              Meet Cyryx Labs <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
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
            What do you
            <br />
            <em>want to build?</em>
          </h2>
          <div className="cinema-contact-bottom">
            <p>
              Tell us what you have in mind, what’s getting in the way and what a useful outcome
              would look like. The short project brief helps us assess the fit and a practical next
              step.
            </p>
            <div className="cinema-actions">
              <a
                href={startHref}
                className="cx-btn-primary"
                onClick={() =>
                  trackCta({ cta: "start_project", section: "final_cta", href: startHref })
                }
              >
                Tell us about your project <ArrowUpRight size={18} aria-hidden />
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
