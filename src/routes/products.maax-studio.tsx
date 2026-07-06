import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { GlassPanel } from "@/components/cyryx/primitives/GlassPanel";
import { ChevronRight } from "lucide-react";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";

const PATH = "/products/maax-studio";
const TITLE = "MAAX Studio — Agentic Execution OS for AI-Native Builders";
const DESC =
  "MAAX Studio is a local-first agentic software execution environment for AI-native builders, designed around missions, memory, operators, gates, ledgers, and human-governed delivery.";

const softwareAppLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MAAX Studio",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Agentic AI execution environment",
  operatingSystem: "Web, macOS, Windows",
  description: DESC,
  url: "https://cyryxlabs.com/products/maax-studio",
  publisher: {
    "@type": "Organization",
    name: "Cyryx Labs",
    url: "https://cyryxlabs.com",
  },
  featureList: [
    "Mission-based execution",
    "Command gates",
    "Goal-grounded generation",
    "Project context graph",
    "Mission ledgers and audit trails",
    "Human-governed delivery",
  ],
};

const FAQ = [
  {
    q: "Is MAAX Studio a framework, a platform, or an application?",
    a: "It is an execution environment — the runtime that sits between an operator's intent and the model. Missions, gates, ledgers, and evaluators are first-class objects, not code you assemble from a framework. The application surfaces those primitives; the runtime enforces them.",
  },
  {
    q: "How does it differ from LangChain, LangGraph, AutoGen, or CrewAI?",
    a: "Those are agent frameworks — libraries you use to compose loops of model calls. MAAX Studio is the layer above them: a runtime that treats each agent step as a candidate action passing through independent command gates and landing in an append-only ledger. You can run agents built in any of those frameworks under MAAX governance.",
  },
  {
    q: "Which models can it run?",
    a: "Any. Model routing is a first-class runtime concern. Missions declare requirements (capabilities, cost ceiling, data class); the runtime routes to the eligible model per call. Swapping a model is a routing change validated by evaluator replay, not a rewrite.",
  },
  {
    q: "Where does it run?",
    a: "In your cloud of record. MAAX Studio deploys as a self-contained runtime on your VPC (AWS, GCP, Azure, or Cloudflare) with your data plane. Cyryx does not operate a managed multi-tenant SaaS for governed workloads — governance depends on the runtime living where your data does.",
  },
  {
    q: "Is it available today?",
    a: "MAAX Studio is in active development with a small cohort of early-access customers. New engagements start through Cyryx Solutions, which builds on the runtime and graduates teams to a standalone MAAX deployment as it stabilizes.",
  },
  {
    q: "How does licensing work?",
    a: "Runtime license per environment plus a support tier. Customer data never leaves your VPC, and the runtime is deliverable as source under a commercial license for teams that require it. Pricing is contract-based; no self-serve tier during early access.",
  },
];

export const Route = createFileRoute("/products/maax-studio")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH, ogType: "product" },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: "MAAX Studio", path: PATH },
        ]),
        softwareAppLd,
        buildFaqJsonLd(FAQ),
      ],
    ),
  component: MaaxStudioPage,
});

function MaaxStudioPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
          <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
          <span className="mx-2 opacity-60">/</span>
          <Link to="/products" className="hover:text-[var(--accent-glow)]">Products</Link>
          <span className="mx-2 opacity-60">/</span>
          <span className="text-[var(--silver)]">MAAX Studio</span>
        </nav>

        <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">Flagship Product</HudLabel>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
          MAAX Studio
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--silver-dim)]">
          The execution layer for operational AI. Missions, gates, and ledgers as first-class primitives — running in your cloud, under your governance.
        </p>

        <div className="mt-8 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-6 backdrop-blur-sm">
          <p className="text-[15px] leading-relaxed text-[var(--silver)]">
            MAAX Studio runs AI work as missions, not pipelines. Every step is a candidate action that passes through command gates and is recorded in a mission ledger. The model is one component; the system holds the goal, the context, the gates, and the audit trail.
          </p>
        </div>

        <Sec heading="At a glance">
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {[
              { k: "Category", v: "Agentic execution environment" },
              { k: "Deployment", v: "Self-hosted in your VPC" },
              { k: "Data plane", v: "Your cloud, your keys" },
              { k: "Model policy", v: "Routable per mission" },
              { k: "Audit model", v: "Append-only mission ledger" },
              { k: "Status", v: "Early access via Cyryx Solutions" },
            ].map((row) => (
              <div key={row.k} className="rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_45%,transparent)] p-4">
                <div className="hud-label text-[var(--accent-glow)]">{row.k}</div>
                <div className="mt-1 text-sm text-[var(--silver)]">{row.v}</div>
              </div>
            ))}
          </div>
        </Sec>

        <Sec heading="What MAAX Studio is">
          <p>
            A governed execution environment for agentic AI workflows. Built on the <strong className="text-[var(--silver)]">MAAX Runtime</strong> — the underlying architecture that coordinates agents, gates, context resolution, and evaluation.
          </p>
        </Sec>

        <Sec heading="Core primitives">
          <ul className="mt-2 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
            <li><strong className="text-[var(--silver)]">Missions</strong> — explicit goals with acceptance criteria, owners, and escalation rules.</li>
            <li><strong className="text-[var(--silver)]">Project context graph</strong> — the structured knowledge each mission draws from.</li>
            <li><strong className="text-[var(--silver)]"><Link to="/answers/what-is-goal-grounded-generation" className="hover:text-[var(--accent-glow)]">Goal-grounded generation</Link></strong> — every model call carries mission, context, and acceptance criteria.</li>
            <li><strong className="text-[var(--silver)]"><Link to="/answers/what-are-command-gates-in-ai-systems" className="hover:text-[var(--accent-glow)]">Command gates</Link></strong> — independent checkpoints between candidate output and downstream action.</li>
            <li><strong className="text-[var(--silver)]">Mission ledger</strong> — full audit and regression replay of every decision.</li>
            <li><strong className="text-[var(--silver)]">Human-governed delivery</strong> — explicit escalation paths, not implicit overrides.</li>
          </ul>
        </Sec>

        <Sec heading="Runtime architecture">
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {[
              { name: "Mission plane", detail: "Missions, acceptance criteria, owners, and escalation rules — the durable contract every model call is measured against." },
              { name: "Context resolver", detail: "Structured, permissioned retrieval from your systems with provenance attached to every field entering a model call." },
              { name: "Model router", detail: "Policy-driven routing across OpenAI, Anthropic, Google, and open-weight models based on capability, cost, and data class." },
              { name: "Gate engine", detail: "Independent policy, structure, task-quality, and safety gates that must pass before any downstream write." },
              { name: "Mission ledger", detail: "Append-only record of every candidate action, gate verdict, escalation, and outcome — the substrate for audit, replay, and evaluator training." },
              { name: "Evaluator plane", detail: "Automated evaluators that run on a schedule and gate model or prompt promotion against real historical missions." },
              { name: "Escalation router", detail: "Failed gates land with the correct human or queue with full context, SLA, and reopen semantics." },
              { name: "Operator console", detail: "Cockpit surface for mission health, gate calibration, ledger inspection, and evaluator management." },
            ].map((layer) => (
              <GlassPanel key={layer.name} className="p-5">
                <div className="hud-label text-[var(--accent-glow)]">{layer.name}</div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">{layer.detail}</p>
              </GlassPanel>
            ))}
          </div>
        </Sec>

        <Sec heading="Capability areas">
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {[
              { title: "Governance by construction", body: "Policies compile into runtime gates. Data-class rules, tenant scopes, and action-type permissions cannot be bypassed by prompt engineering." },
              { title: "Evidence-grade auditability", body: "Every action carries mission ID, gate verdicts, model provenance, and cost — replayable end-to-end from the ledger." },
              { title: "Model-agnostic execution", body: "Missions declare intent; the router picks the model. Swapping vendors is a config change validated by evaluator replay." },
              { title: "Operator ergonomics", body: "Mission health, escalations, and gate calibration surface in one console — designed for the operators who own the system in production." },
            ].map((c) => (
              <div key={c.title} className="rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_45%,transparent)] p-5">
                <div className="font-display text-sm font-semibold text-[var(--silver)]">{c.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">{c.body}</p>
              </div>
            ))}
          </div>
        </Sec>

        <Sec heading="Who it's for">
          <ul className="mt-2 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
            <li>Teams shipping AI-native products who need a runtime they can audit.</li>
            <li>Operators replacing ungoverned agent stacks with a governed execution layer.</li>
            <li>Engineering leads who want missions, gates, and ledgers as first-class objects, not custom code.</li>
          </ul>
        </Sec>

        <Sec heading="How it differs">
          <p>
            MAAX Studio is not a chat UI, an automation builder, or a generic agent framework. It is an execution OS: the system holds the mission and verifies every action. The model is replaceable; the governance is the product.
          </p>
          <div className="mt-5 overflow-hidden rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)]">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] text-xs uppercase tracking-[0.1em] text-[var(--silver-dim)]">
                <tr>
                  <th className="px-4 py-3">Concern</th>
                  <th className="px-4 py-3">Agent framework</th>
                  <th className="px-4 py-3">MAAX Studio</th>
                </tr>
              </thead>
              <tbody className="text-[var(--silver-dim)]">
                {[
                  ["Unit of work", "Loop of model calls", "Mission with acceptance criteria"],
                  ["Policy enforcement", "Prompt discipline", "Independent runtime gates"],
                  ["Audit trail", "App logs (if any)", "Append-only mission ledger"],
                  ["Model swap", "Rewrite prompts + tools", "Config change + evaluator replay"],
                  ["Failure handling", "Retry the loop", "Escalate with full context"],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-[color-mix(in_oklab,var(--silver)_8%,transparent)] align-top">
                    <td className="px-4 py-3 font-medium text-[var(--silver)]">{row[0]}</td>
                    <td className="px-4 py-3">{row[1]}</td>
                    <td className="px-4 py-3 text-[var(--silver)]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        <Sec heading="Security & deployment posture">
          <ul className="mt-2 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
            <li>Runtime deploys inside your VPC on AWS, GCP, Azure, or Cloudflare — never a shared multi-tenant control plane for governed workloads.</li>
            <li>Data plane, secrets, and model keys stay under your existing IAM and KMS.</li>
            <li>SSO / SCIM through your IdP (Okta, Entra ID, WorkOS, Google) for the operator console.</li>
            <li>Ledger tables designed for retention policies, legal hold, and export to your data warehouse.</li>
            <li>Source-available option for teams that require code review as part of procurement.</li>
          </ul>
          <p className="mt-4 text-sm text-[var(--silver-dim)]">
            Cyryx makes no compliance certification claims. MAAX Studio is engineered to make certification programs (SOC 2, ISO 27001, sector-specific frameworks) achievable on your infrastructure; the certification is yours to hold.
          </p>
        </Sec>

        <Sec heading="Where MAAX Studio fits the stack">
          <div className="mt-2 rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_45%,transparent)] p-5">
            <ul className="space-y-2 text-sm text-[var(--silver-dim)]">
              {[
                "Above your model vendors — they supply capability; MAAX supplies governance.",
                "Alongside your agent frameworks — they compose steps; MAAX gates and audits them.",
                "Above your workflow engines — they schedule; MAAX defines missions and outcomes.",
                "Under your product surfaces — they render; MAAX guarantees what they render is grounded and governed.",
              ].map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--accent-glow)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </Sec>

        <Sec heading="Roadmap themes">
          <p>
            Directional themes shared publicly; specific dates are shared under early-access agreements only.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
            <li><strong className="text-[var(--silver)]">Runtime hardening</strong> — deeper policy-engine integration, richer gate primitives, and stronger evaluator DSL.</li>
            <li><strong className="text-[var(--silver)]">Operator console</strong> — mission health, gate calibration, and evaluator workflows aimed at day-2 operability.</li>
            <li><strong className="text-[var(--silver)]">Ecosystem</strong> — first-class adapters for the major agent frameworks and enterprise policy engines.</li>
            <li><strong className="text-[var(--silver)]">Governance packs</strong> — reference configurations aligned to common regulatory frames, without claiming certification on our behalf.</li>
          </ul>
        </Sec>

        <Sec heading="Questions we get from procurement">
          <div className="mt-4 divide-y divide-[color-mix(in_oklab,var(--silver)_10%,transparent)] rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_40%,transparent)]">
            {FAQ.map((f, i) => (
              <details key={i} className="group p-5" open={i === 0}>
                <summary className="cursor-pointer list-none text-sm font-medium text-[var(--silver)] hover:text-[var(--accent-glow)]">
                  <span className="mr-2 text-[var(--accent-glow)]">Q.</span>
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{f.a}</p>
              </details>
            ))}
          </div>
        </Sec>

        <Sec heading="Status">
          <p>
            MAAX Studio is in active development at <Link to="/" className="text-[var(--accent-glow)] hover:underline">Cyryx Labs</Link>. Early access engagements are coordinated through <Link to="/solutions" className="text-[var(--accent-glow)] hover:underline">Cyryx Solutions</Link>. The underlying frameworks are published openly by the <Link to="/research" className="text-[var(--accent-glow)] hover:underline">Cyryx Applied AI Lab</Link>.
          </p>
        </Sec>

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href="/#contact"
            className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
          >
            Request early access
            <span aria-hidden className="text-[var(--accent-glow)]">→</span>
          </a>
          <Link
            to="/research"
            className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
          >
            Read the research
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Sec({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--silver)]">
        {heading}
      </h2>
      <div className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">{children}</div>
    </section>
  );
}