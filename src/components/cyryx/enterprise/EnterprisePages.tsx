import {
  ArrowRight,
  Check,
  FlaskConical,
  Layers3,
  Network,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { ContactSection } from "@/components/cyryx/ContactSection";
import maaxImage from "@/assets/cyryx-macbook-ide.webp";
import { PageShell, InteriorHero, InteriorSection, QualificationBand } from "./PageShell";
import { solutionKeys, solutions } from "./internalContent";
import { StatusBadge, TextLink } from "./SectionFrame";

export function SolutionsHubPage() {
  return (
    <PageShell>
      <InteriorHero
        eyebrow="Solutions"
        title="From strategic direction to operated systems."
        lead="Cyryx combines advisory, digital engineering, AI product development, governance, and optional managed operations around a single operating problem."
      />
      <div id="page-content">
        <InteriorSection
          eyebrow="Commercial portfolio"
          title="Seven capabilities. One connected execution model."
          lead="Begin with a defined capability or ask Cyryx to diagnose where the work should begin."
        >
          <div className="cx-solution-map">
            {solutionKeys.map((key, index) => {
              const item = solutions[key];
              return (
                <article key={key}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.eyebrow}</h3>
                  <p>{item.promise}</p>
                  <TextLink href={`/solutions/${item.slug}`}>Explore solution</TextLink>
                </article>
              );
            })}
          </div>
        </InteriorSection>
        <InteriorSection
          eyebrow="Operating logic"
          title="Advise when the direction is unclear. Build when the system is defined. Operate when continued ownership creates value."
        >
          <div className="cx-three-model">
            {[
              ["Advise", "Decisions, architecture, risk, and roadmap."],
              ["Build", "Experience, software, AI, integrations, and evaluation."],
              ["Operate", "Monitoring, maintenance, optimization, and handover."],
            ].map(([title, copy]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </InteriorSection>
        <QualificationBand />
      </div>
    </PageShell>
  );
}

const products = {
  maax: {
    eyebrow: "MAAX Studio",
    title: "A command environment for controlled software execution.",
    lead: "MAAX Studio is an agentic software execution environment in active development, intended to coordinate missions, agents, project context, review, and controlled execution.",
    status: "In active development",
    identity: "Agentic software execution environment",
    users: [
      "Software builders coordinating complex implementation work",
      "Technical leaders seeking reviewable mission context",
      "Teams exploring structured human-and-agent execution",
    ],
    focus: [
      "Mission and project coordination",
      "Context continuity",
      "Review and decision points",
      "Controlled software execution",
    ],
    limits: [
      "Not presented as generally available",
      "No claim of guaranteed autonomous delivery",
      "Current capabilities remain subject to product development and verification",
    ],
  },
  lyra: {
    eyebrow: "Lyra",
    title: "Private intelligence infrastructure without model lock-in.",
    lead: "Lyra is a private, model-agnostic intelligence and execution runtime in private development.",
    status: "Private development",
    identity: "Private, model-agnostic intelligence and execution runtime",
    users: [
      "Cyryx product and systems research",
      "Private internal execution experiments",
      "Future controlled intelligence workloads where portability matters",
    ],
    focus: [
      "Provider-portable model access",
      "Context and knowledge boundaries",
      "Tool and execution interfaces",
      "Evaluation, trace, and cost discipline",
    ],
    limits: [
      "Not a proprietary foundation model",
      "Not generally available",
      "Not presented as production validated",
      "Conceptual architecture does not represent released product UI",
    ],
  },
} as const;

export function ProductPage({ product }: { product: keyof typeof products }) {
  const item = products[product];
  return (
    <PageShell>
      <InteriorHero
        eyebrow={item.eyebrow}
        title={item.title}
        lead={item.lead}
        status={item.status}
      />
      <div id="page-content">
        <InteriorSection eyebrow="Product identity" title={item.identity}>
          <div className="cx-product-page-visual">
            {product === "maax" ? (
              <img
                data-no3d="1"
                src={maaxImage}
                alt="Product visualization of the MAAX Studio command environment on a laptop"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className="cx-runtime-diagram"
                role="img"
                aria-label="Conceptual Lyra runtime architecture"
              >
                <span>Models</span>
                <span>Context</span>
                <strong>LYRA</strong>
                <span>Tools</span>
                <span>Evaluation</span>
              </div>
            )}
            <p>
              {product === "maax"
                ? "Product visualization — interface direction in active development. MAAX Studio explores how software missions, agents, project knowledge, and human review can share one command environment."
                : "Lyra explores a portable runtime layer between models, approved context, tools, evaluation, and execution policy. This diagram is conceptual."}
            </p>
          </div>
        </InteriorSection>
        <InteriorSection eyebrow="Intended users" title="Built around a specific operating need.">
          <ul className="cx-deliverable-list">
            {item.users.map((x) => (
              <li key={x}>
                <Check aria-hidden size={16} />
                {x}
              </li>
            ))}
          </ul>
        </InteriorSection>
        <InteriorSection
          eyebrow="Current focus"
          title="What product development is concentrating on now."
        >
          <div className="cx-focus-grid">
            {item.focus.map((x, i) => (
              <article key={x}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{x}</h3>
              </article>
            ))}
          </div>
        </InteriorSection>
        <InteriorSection
          eyebrow="Architecture"
          title="An execution environment above a portable systems layer."
        >
          <div className="cx-architecture-stack">
            <span>Human direction and review</span>
            <ArrowRight aria-hidden />
            <span>{item.eyebrow}</span>
            <ArrowRight aria-hidden />
            <span>Approved models, context, tools, and infrastructure</span>
          </div>
        </InteriorSection>
        <InteriorSection
          eyebrow="Limitations & access"
          title="Maturity is part of the product truth."
        >
          <ul className="cx-boundary-list">
            {item.limits.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="mt-10">
            <StatusBadge>{item.status}</StatusBadge>
          </div>
        </InteriorSection>
        <QualificationBand title={`Talk to Cyryx about ${item.eyebrow}.`} />
      </div>
    </PageShell>
  );
}

export function ProductsHubPage() {
  return (
    <PageShell>
      <InteriorHero
        eyebrow="Products"
        title="Two products. Different layers of execution."
        lead="Cyryx develops product infrastructure alongside client systems and applied research. Public maturity is stated without ambiguity."
      />
      <div id="page-content">
        <InteriorSection eyebrow="Product registry" title="Built for controlled execution.">
          <div className="cx-product-hub">
            <article>
              <StatusBadge>In active development</StatusBadge>
              <h3>MAAX Studio</h3>
              <p>Agentic software execution environment.</p>
              <TextLink href="/products/maax-studio">Explore MAAX Studio</TextLink>
            </article>
            <article>
              <StatusBadge>Private development</StatusBadge>
              <h3>Lyra</h3>
              <p>Private, model-agnostic intelligence and execution runtime.</p>
              <TextLink href="/products/lyra">Explore Lyra</TextLink>
            </article>
          </div>
        </InteriorSection>
        <QualificationBand />
      </div>
    </PageShell>
  );
}

export function ResearchPage() {
  return (
    <PageShell>
      <InteriorHero
        eyebrow="Applied research"
        title="Research for reliable, controlled AI execution."
        lead="Cyryx investigates recurring systems problems where authority, state, failure, evaluation, evidence, and cost shape whether AI can operate responsibly."
      />
      <div id="page-content">
        <InteriorSection eyebrow="Research directions" title="Questions that inform architecture.">
          <div className="cx-research-directions">
            {[
              [
                ShieldCheck,
                "Authority & governance",
                "How human decision rights, approvals, and system permissions can remain explicit.",
              ],
              [
                Network,
                "Reliability & recovery",
                "How agentic workflows manage state, interruption, failure, and controlled continuation.",
              ],
              [
                ScanSearch,
                "Evaluation & cost discipline",
                "How output quality and resource use can be measured against defined objectives.",
              ],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <article key={title as string}>
                  <I aria-hidden />
                  <h3>{title as string}</h3>
                  <p>{copy as string}</p>
                </article>
              );
            })}
          </div>
        </InteriorSection>
        <InteriorSection eyebrow="Publication standard" title="Evidence before identifiers.">
          <div className="cx-editorial-note">
            <FlaskConical aria-hidden />
            <p>
              Only research that is verifiably public and supported by current source data will
              appear here. No unverified papers, identifiers, quotes, control counts,
              certifications, or standards mappings are published.
            </p>
          </div>
        </InteriorSection>
        <InteriorSection
          eyebrow="Relationship to delivery"
          title="Research is useful when it improves a system."
        >
          <div className="cx-three-model">
            <article>
              <h3>Observe</h3>
              <p>Identify recurring failure, authority, evaluation, and cost patterns.</p>
            </article>
            <article>
              <h3>Model</h3>
              <p>Develop testable architectural patterns and evaluation methods.</p>
            </article>
            <article>
              <h3>Apply</h3>
              <p>Use relevant findings in products and engagements where they fit.</p>
            </article>
          </div>
        </InteriorSection>
        <QualificationBand />
      </div>
    </PageShell>
  );
}

export function CompanyPage() {
  return (
    <PageShell>
      <InteriorHero
        eyebrow="Company"
        title="Cyryx exists to close the gap between AI capability and operational execution."
        lead="Cyryx Labs is an AI lab and systems company that advises, builds, and operates digital and AI systems for organizations moving from strategy to controlled execution."
      />
      <div id="page-content">
        <InteriorSection
          eyebrow="Company thesis"
          title="Access to intelligence is not the same as an operating system for it."
        >
          <div className="cx-company-thesis">
            <p>
              Organizations need architecture around the model: business context, software,
              integrations, authority, evaluation, cost visibility, and a clear owner.
            </p>
            <p>
              Cyryx brings those layers together through advisory, systems engineering, proprietary
              products, applied research, and optional managed operations.
            </p>
          </div>
        </InteriorSection>
        <InteriorSection
          eyebrow="Founder"
          title="Built from a systems point of view."
          lead="Cyryx is founder-led and at an active development stage. The company is building its public products, delivery system, research practice, and operating partnerships deliberately."
        >
          <div className="cx-founder-block">
            <span>Founder-led</span>
            <p>
              No fabricated team scale, office footprint, advisors, customers, investors,
              certifications, or partnerships are used to manufacture credibility. The work,
              architecture, and product truth must carry the story.
            </p>
          </div>
        </InteriorSection>
        <InteriorSection eyebrow="Operating principles" title="Five decisions that shape the work.">
          <ol className="cx-question-list">
            {[
              "Business problem before model choice",
              "Architecture before automation",
              "AI where useful; deterministic software where better",
              "Governance according to authority and risk",
              "Delivery with an ownership path",
            ].map((x, i) => (
              <li key={x}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {x}
              </li>
            ))}
          </ol>
        </InteriorSection>
        <QualificationBand />
      </div>
    </PageShell>
  );
}

export function HowWeWorkPage() {
  const stages = [
    ["Discover", "Business problem, workflow, data, security, constraints, and success criteria."],
    [
      "Design",
      "Experience, architecture, responsibilities, acceptance criteria, and implementation plan.",
    ],
    [
      "Build",
      "Incremental engineering across software, integrations, AI, data, and operational controls.",
    ],
    [
      "Validate",
      "Functional, accessibility, performance, failure-path, and agreed evaluation testing.",
    ],
    [
      "Launch & operate",
      "Handover or continued operation under responsibilities and terms defined for the engagement.",
    ],
  ];
  return (
    <PageShell>
      <InteriorHero
        eyebrow="How we work"
        title="A disciplined lifecycle with explicit decisions and ownership."
        lead="The engagement model adapts to advisory, digital systems, automation, custom products, and managed operations without hiding commercial or operating boundaries."
      />
      <div id="page-content">
        <InteriorSection eyebrow="Lifecycle" title="Five stages. One shared operating context.">
          <ol className="cx-work-timeline">
            {stages.map(([title, copy], i) => (
              <li key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </InteriorSection>
        <InteriorSection
          eyebrow="Defined per engagement"
          title="Specificity belongs in the agreement, not in universal promises."
        >
          <div className="cx-deliverable-list">
            {[
              "Scope and acceptance criteria",
              "Ownership and licensing",
              "Integrations and provider dependencies",
              "Security and data responsibilities",
              "Commercial terms and timing",
              "Support, response, and escalation expectations",
              "Handover or managed-operations model",
            ].map((x) => (
              <div key={x}>{x}</div>
            ))}
          </div>
        </InteriorSection>
        <QualificationBand />
      </div>
    </PageShell>
  );
}

export function CareersPage() {
  return (
    <PageShell>
      <InteriorHero
        eyebrow="Careers"
        title="A talent network for people drawn to difficult systems work."
        lead="Cyryx is not advertising active roles at this time. We welcome concise introductions from exceptional designers, engineers, researchers, and operators for future collaboration."
      />
      <div id="page-content">
        <InteriorSection
          eyebrow="Future collaborators"
          title="Curious across disciplines. Precise about evidence."
        >
          <div className="cx-three-model">
            <article>
              <h3>Design</h3>
              <p>
                Enterprise experience, information architecture, motion, and systems visualization.
              </p>
            </article>
            <article>
              <h3>Engineering</h3>
              <p>
                Product, platform, AI systems, integrations, reliability, security, and evaluation.
              </p>
            </article>
            <article>
              <h3>Operations</h3>
              <p>
                Delivery systems, customer context, quality, documentation, and managed operations.
              </p>
            </article>
          </div>
        </InteriorSection>
        <InteriorSection eyebrow="Talent network" title="Send signal, not ceremony.">
          <div className="cx-editorial-note">
            <p>
              Introduce yourself, the problems you are best at solving, and two or three examples
              that show how you think. Email{" "}
              <a href="mailto:contact@cyryxlabs.com">contact@cyryxlabs.com</a> with “Talent Network”
              in the subject.
            </p>
          </div>
        </InteriorSection>
      </div>
    </PageShell>
  );
}

export function StartPage() {
  return (
    <PageShell>
      <InteriorHero
        eyebrow="Start a project"
        title="Bring us the workflow, bottleneck, or system."
        lead="Share enough context for Cyryx to understand the business problem, current state, desired outcome, stakeholders, timing, and relevant data or security constraints."
      />
      <div id="page-content">
        <InteriorSection
          eyebrow="Good starting points"
          title="Work that connects strategy to implementation."
        >
          <div className="cx-focus-grid">
            {[
              "AI strategy or readiness",
              "Corporate website or digital system",
              "Workflow automation",
              "Internal AI assistant",
              "Custom AI product",
              "Governance or cost control",
              "Continuing operational support",
            ].map((x, i) => (
              <article key={x}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{x}</h3>
              </article>
            ))}
          </div>
        </InteriorSection>
        <ContactSection />
      </div>
    </PageShell>
  );
}

export function ContactPage() {
  return (
    <PageShell>
      <InteriorHero
        eyebrow="Contact"
        title="The right route depends on the conversation."
        lead="Use the project qualification flow for potential engagements. For general company, research, product, privacy, or talent inquiries, contact Cyryx directly."
      />
      <div id="page-content">
        <InteriorSection eyebrow="Choose a path" title="Keep the next step clear.">
          <div className="cx-contact-paths">
            <article>
              <h3>Project inquiry</h3>
              <p>
                Advisory, websites, digital systems, automation, assistants, custom products,
                governance, or operations.
              </p>
              <a href="/start">
                Start a project <ArrowRight aria-hidden size={16} />
              </a>
            </article>
            <article>
              <h3>General inquiry</h3>
              <p>Company, product, research, privacy, media, or talent-network conversations.</p>
              <a href="mailto:contact@cyryxlabs.com">
                contact@cyryxlabs.com <ArrowRight aria-hidden size={16} />
              </a>
            </article>
          </div>
        </InteriorSection>
      </div>
    </PageShell>
  );
}
