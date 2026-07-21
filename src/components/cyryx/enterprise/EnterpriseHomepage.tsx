import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Blocks,
  BrainCircuit,
  Braces,
  Check,
  CircleGauge,
  Code2,
  Compass,
  FileCheck2,
  Fingerprint,
  Gauge,
  GitBranch,
  Hand,
  Layers3,
  Network,
  Orbit,
  Route,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import maaxImage from "@/assets/cyryx-macbook-ide.webp";
import { ContactSection } from "@/components/cyryx/ContactSection";
import { SectionFrame, StatusBadge, TextLink } from "./SectionFrame";

const operatingModel = [
  {
    label: "Advise",
    number: "01",
    icon: Compass,
    copy: "Find the right intervention before committing to technology.",
    actions: ["Workflow diagnosis", "Architecture and risk", "Prioritized roadmap"],
    output: "A decision-ready execution plan",
  },
  {
    label: "Build",
    number: "02",
    icon: Code2,
    copy: "Engineer the digital system, automation, or AI product around defined acceptance criteria.",
    actions: [
      "Experience and systems design",
      "Software and integrations",
      "Evaluation and validation",
    ],
    output: "A working, documented system",
  },
  {
    label: "Operate",
    number: "03",
    icon: Activity,
    copy: "Maintain, monitor, and improve delivered systems when the engagement calls for it.",
    actions: [
      "Monitoring and maintenance",
      "Optimization and reporting",
      "Transition or ongoing support",
    ],
    output: "An explicit ownership path",
  },
] as const;

const capabilities: {
  icon: LucideIcon;
  title: string;
  proposition: string;
  deliverables: string[];
  href: string;
}[] = [
  {
    icon: Compass,
    title: "AI Strategy & Advisory",
    proposition: "Turn ambiguity into an evidence-based roadmap for controlled adoption.",
    deliverables: ["Readiness assessment", "Opportunity map", "Architecture recommendation"],
    href: "/solutions/ai-strategy-advisory",
  },
  {
    icon: Layers3,
    title: "Digital & Web Systems",
    proposition:
      "Premium websites, landing pages, applications, and lead systems built as business infrastructure.",
    deliverables: ["Experience strategy", "Full-stack build", "Analytics and handover"],
    href: "/solutions/digital-web-systems",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    proposition: "Connect people, tools, and decisions without automating the wrong process.",
    deliverables: ["Workflow mapping", "Integration design", "Approval and exception paths"],
    href: "/solutions/workflow-automation",
  },
  {
    icon: BrainCircuit,
    title: "Internal AI Assistants",
    proposition: "Give teams useful access to knowledge and tools within defined permissions.",
    deliverables: ["Knowledge architecture", "Retrieval and permissions", "Evaluation harness"],
    href: "/solutions/internal-ai-assistants",
  },
  {
    icon: Braces,
    title: "Custom AI Products",
    proposition:
      "Design and build AI-enabled products around a real user, workflow, and operating model.",
    deliverables: [
      "Product definition",
      "Application engineering",
      "Model and provider integration",
    ],
    href: "/solutions/custom-ai-products",
  },
  {
    icon: ShieldCheck,
    title: "AI Governance & Cost Control",
    proposition:
      "Define authority, review, evaluation, and spend visibility according to system risk.",
    deliverables: ["Authority model", "Evaluation design", "Usage and cost instrumentation"],
    href: "/solutions/ai-governance-cost-control",
  },
  {
    icon: CircleGauge,
    title: "Managed Operations",
    proposition:
      "Continue monitoring and evolving systems under responsibilities defined per engagement.",
    deliverables: ["Operating runbook", "Maintenance cadence", "Reporting and escalation model"],
    href: "/solutions/managed-operations",
  },
];

const audiences = [
  [
    "Technology leaders",
    "Move from fragmented experiments to a coherent architecture and provider strategy.",
  ],
  [
    "Operations leaders",
    "Redesign intake, routing, approval, review, and system synchronization workflows.",
  ],
  [
    "Product teams",
    "Build differentiated AI-enabled products with explicit quality and ownership criteria.",
  ],
  [
    "Growth & commercial",
    "Create digital lead systems, qualification flows, and useful automation across the funnel.",
  ],
  [
    "Controlled environments",
    "Introduce human authority, traceability, evaluation, and cost visibility where risk requires it.",
  ],
] as const;

const process = [
  [
    "Discover",
    "Understand the business problem, current workflow, data, security constraints, and desired outcome.",
  ],
  [
    "Design",
    "Define the experience, architecture, responsibilities, acceptance criteria, and implementation path.",
  ],
  [
    "Build",
    "Engineer the system in reviewable increments and connect approved tools, data, and providers.",
  ],
  [
    "Validate",
    "Test behavior, accessibility, performance, failure paths, and agreed evaluation criteria.",
  ],
  [
    "Launch & operate",
    "Handover the system or continue operating it under terms defined for the engagement.",
  ],
] as const;

const controlLayers = [
  {
    icon: Hand,
    title: "Human authority",
    copy: "Decision rights can remain with named people at the points that matter.",
  },
  {
    icon: GitBranch,
    title: "Approval boundaries",
    copy: "Actions can be gated according to system authority, consequence, and risk.",
  },
  {
    icon: Fingerprint,
    title: "Traceable execution",
    copy: "Evidence can be retained where supported by the selected infrastructure.",
  },
  {
    icon: ScanSearch,
    title: "Evaluation",
    copy: "Outputs can be assessed against defined criteria before and after release.",
  },
  {
    icon: Gauge,
    title: "Cost visibility",
    copy: "Usage and provider cost can be instrumented for operational decision-making.",
  },
  {
    icon: FileCheck2,
    title: "Operational ownership",
    copy: "Monitoring, escalation, and handover are designed around explicit responsibility.",
  },
] as const;

export function EnterpriseHomepage() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    const frame = requestAnimationFrame(() => requestAnimationFrame(scrollToHash));
    const timeout = window.setTimeout(scrollToHash, 450);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <div className="cx-enterprise-home">
      <ExecutionGap />
      <OperatingModel />
      <Capabilities />
      <Outcomes />
      <HowWeWork />
      <Governance />
      <Products />
      <Research />
      <WhyCyryx />
      <ProjectStart />
    </div>
  );
}

function ExecutionGap() {
  return (
    <SectionFrame
      id="execution-gap"
      index="01"
      eyebrow="The execution gap"
      title="AI capability has advanced faster than the operating systems required to control it."
      lead="Cyryx Labs is an AI lab and systems company that advises, builds, and operates digital and AI systems for organizations moving from strategy to controlled execution."
      className="cx-execution-gap"
    >
      <div className="cx-gap-layout">
        <div
          className="cx-gap-map"
          aria-label="Operational flow from fragmented inputs to controlled execution"
        >
          <div className="cx-gap-source">
            {[
              ["Data", Network],
              ["Models", Sparkles],
              ["People", Hand],
              ["Tools", Blocks],
            ].map(([label, Icon]) => (
              <div key={label as string}>
                <Icon aria-hidden size={18} />
                <span>{label as string}</span>
              </div>
            ))}
          </div>
          <div className="cx-gap-spine" aria-hidden>
            <span />
            <ArrowRight size={18} />
          </div>
          <div className="cx-gap-control">
            <Orbit aria-hidden size={24} />
            <strong>Controlled execution</strong>
            <small>Authority · evidence · cost · ownership</small>
          </div>
        </div>
        <div className="cx-gap-aside">
          <p>Access to a model is not an operating model.</p>
          <ul>
            <li>
              <Check aria-hidden /> Business context must reach the system.
            </li>
            <li>
              <Check aria-hidden /> Authority must be explicit.
            </li>
            <li>
              <Check aria-hidden /> Outcomes need evidence.
            </li>
            <li>
              <Check aria-hidden /> Someone must own operation.
            </li>
          </ul>
          <TextLink href="#operating-model">See the Cyryx model</TextLink>
        </div>
      </div>
    </SectionFrame>
  );
}

function OperatingModel() {
  return (
    <SectionFrame
      id="operating-model"
      index="02"
      eyebrow="Advise · Build · Operate"
      title="One partner from strategy to operation."
      lead="Engage Cyryx for the stage you need, or carry one operating context from discovery through delivery and ongoing improvement."
      className="cx-operating-model"
    >
      <ol className="cx-operating-rail">
        {operatingModel.map((stage) => (
          <li key={stage.label}>
            <div className="cx-stage-heading">
              <span>{stage.number}</span>
              <stage.icon aria-hidden size={22} />
            </div>
            <h3>{stage.label}</h3>
            <p>{stage.copy}</p>
            <ul>
              {stage.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
            <div className="cx-stage-output">
              <ArrowDownRight aria-hidden size={16} /> {stage.output}
            </div>
          </li>
        ))}
      </ol>
    </SectionFrame>
  );
}

function Capabilities() {
  return (
    <SectionFrame
      id="solutions"
      index="03"
      eyebrow="Capabilities"
      title="Commercial capabilities built around the work, not the hype."
      lead="Every engagement begins with the operating problem. AI is used where it creates leverage; deterministic software is used where it provides greater predictability."
    >
      <div className="cx-capability-index">
        {capabilities.map((item, index) => (
          <article key={item.title}>
            <div className="cx-capability-number">{String(index + 1).padStart(2, "0")}</div>
            <item.icon aria-hidden size={22} />
            <div>
              <h3>{item.title}</h3>
              <p>{item.proposition}</p>
            </div>
            <ul>
              {item.deliverables.map((deliverable) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ul>
            <TextLink href={item.href}>Explore capability</TextLink>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

function Outcomes() {
  return (
    <SectionFrame
      id="outcomes"
      index="04"
      eyebrow="Business outcomes"
      title="Start with the bottleneck your team can already see."
      lead="Cyryx works with leaders responsible for technology, operations, products, and growth—especially where systems cross team or tool boundaries."
      className="cx-outcomes"
    >
      <div className="cx-outcome-map">
        <div className="cx-outcome-core" aria-hidden>
          <Route size={26} />
          <span>
            Operational
            <br />
            system
          </span>
        </div>
        <div className="cx-outcome-list">
          {audiences.map(([title, copy], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="cx-use-case-ticker" aria-label="Representative use cases">
        {[
          "Workflow discovery",
          "Intake and routing",
          "Document-review support",
          "System synchronization",
          "Provider integration",
          "Knowledge access",
          "Approval workflows",
          "Evaluation",
          "Usage and cost monitoring",
        ].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </SectionFrame>
  );
}

function HowWeWork() {
  return (
    <SectionFrame
      id="process"
      index="05"
      eyebrow="How we work"
      title="A disciplined path from problem definition to operational ownership."
      lead="Scope, commercial terms, ownership, licensing, integrations, and support are defined for each engagement."
      className="cx-process"
    >
      <ol className="cx-process-list">
        {process.map(([title, copy], index) => (
          <li key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="cx-process-note">
        <p>One operating context. Reviewable decisions. An explicit handover or support path.</p>
        <TextLink href="/how-we-work">Explore the engagement model</TextLink>
      </div>
    </SectionFrame>
  );
}

function Governance() {
  return (
    <SectionFrame
      id="governance"
      index="06"
      eyebrow="Governance & evidence"
      title="Control is an architectural decision, not a compliance slogan."
      lead="Governance is designed according to the authority of the system, the consequence of an action, and the risk boundaries of the engagement."
      className="cx-governance"
    >
      <div className="cx-control-system">
        <div className="cx-control-orbit" aria-hidden>
          <span>Intent</span>
          <ArrowRight size={16} />
          <strong>Authority</strong>
          <ArrowRight size={16} />
          <span>Action</span>
        </div>
        <div className="cx-control-grid">
          {controlLayers.map((item) => (
            <article key={item.title}>
              <item.icon aria-hidden size={19} />
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function Products() {
  return (
    <SectionFrame
      id="products"
      index="07"
      eyebrow="Product infrastructure"
      title="Products shaped by the systems we believe should exist."
      lead="MAAX Studio and Lyra address different layers of the Cyryx product architecture. Their maturity is stated plainly."
      className="cx-products"
    >
      <div className="cx-product-registry">
        <article id="maax" className="cx-product-feature">
          <div className="cx-product-media">
            <img
              data-no3d="1"
              src={maaxImage}
              alt="Product visualization of the MAAX Studio software execution environment on a laptop"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="cx-product-copy">
            <div className="cx-product-meta">
              <StatusBadge>In active development</StatusBadge>
              <span>Product 01</span>
            </div>
            <h3>MAAX Studio</h3>
            <p className="cx-product-identity">Agentic software execution environment</p>
            <p>
              A software-development command environment intended to coordinate missions, agents,
              project context, review, and controlled execution.
            </p>
            <TextLink href="/products/maax-studio">Explore MAAX Studio</TextLink>
          </div>
        </article>
        <article className="cx-product-feature cx-product-feature--lyra">
          <div
            className="cx-lyra-visual"
            role="img"
            aria-label="Conceptual visualization of a model-agnostic intelligence runtime"
          >
            <span className="cx-lyra-core">LYRA</span>
            <span>Context</span>
            <span>Models</span>
            <span>Tools</span>
            <span>Policy</span>
          </div>
          <div className="cx-product-copy">
            <div className="cx-product-meta">
              <StatusBadge>Private development</StatusBadge>
              <span>Product 02</span>
            </div>
            <h3>Lyra</h3>
            <p className="cx-product-identity">
              Private, model-agnostic intelligence and execution runtime
            </p>
            <p>
              A private Cyryx runtime focused on portable model access, context, tools, and
              execution control. The visual shown is conceptual, not product UI.
            </p>
            <TextLink href="/products/lyra">Explore Lyra</TextLink>
          </div>
        </article>
      </div>
    </SectionFrame>
  );
}

function Research() {
  return (
    <SectionFrame
      id="research"
      index="08"
      eyebrow="Applied research"
      title="Research directed at systems that must work beyond the demo."
      lead="Cyryx studies recurring execution problems and uses relevant findings to inform product and solution architecture."
      className="cx-research"
    >
      <div className="cx-research-index">
        {[
          [
            "01",
            "Authority & governance",
            "How systems preserve human decision rights and make approval boundaries explicit.",
          ],
          [
            "02",
            "Reliability & recovery",
            "How agentic workflows manage state, failure, interruption, and safe continuation.",
          ],
          [
            "03",
            "Evaluation & cost discipline",
            "How teams measure output quality and resource use against an intended result.",
          ],
        ].map(([number, title, copy]) => (
          <article key={title}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <TextLink href="/research">View research directions</TextLink>
    </SectionFrame>
  );
}

function WhyCyryx() {
  return (
    <SectionFrame
      id="why-cyryx"
      index="09"
      eyebrow="Why Cyryx"
      title="The perspective of a lab. The accountability of a systems partner."
      className="cx-why"
    >
      <div className="cx-why-layout">
        <p>
          Cyryx combines advisory, systems engineering, proprietary products, applied research, and
          optional managed operations in one operating model.
        </p>
        <ul>
          <li>
            <span>01</span>Business problem before model choice.
          </li>
          <li>
            <span>02</span>Architecture before automation.
          </li>
          <li>
            <span>03</span>AI where useful; deterministic software where better.
          </li>
          <li>
            <span>04</span>Governance according to authority and risk.
          </li>
          <li>
            <span>05</span>Delivery with an ownership path.
          </li>
        </ul>
      </div>
    </SectionFrame>
  );
}

function ProjectStart() {
  return (
    <section className="cx-project-intro" aria-labelledby="project-start-title">
      <div className="cx-enterprise-shell">
        <p className="cx-eyebrow">Start a project</p>
        <div>
          <h2 id="project-start-title">Bring us the workflow, bottleneck, or system.</h2>
          <p>
            Share the current state, the outcome you need, the people involved, and any timing or
            security constraints. We accept advisory, digital systems, automation, internal
            assistant, custom product, governance, and managed-operations inquiries.
          </p>
        </div>
        <div className="cx-project-steps" aria-label="What happens after submission">
          <span>
            <strong>01</strong> We review fit and context.
          </span>
          <span>
            <strong>02</strong> We respond within one business day.
          </span>
          <span>
            <strong>03</strong> If aligned, we define the next discovery step.
          </span>
        </div>
      </div>
      <ContactSection />
    </section>
  );
}
