import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";

const CARDS = [
  {
    n: "01",
    title: "AI Product Sprint",
    outcome:
      "Concept to deployable AI product foundation: architecture, core workflows, model integration.",
    delivered: [
      "production structure from first commit",
      "server-side secrets and permissions",
      "full ownership transfer",
    ],
  },
  {
    n: "02",
    title: "AI Workflow Automation",
    outcome:
      "A high-cost process replaced by a governed workflow, with human approval at points of consequence.",
    delivered: [
      "explicit state machine",
      "deterministic fallbacks",
      "audit logging",
      "rollback procedure",
    ],
  },
  {
    n: "03",
    title: "Internal AI Agents & Copilots",
    outcome:
      "Agents operating inside your business, within your data boundaries and permission model.",
    delivered: [
      "least-privilege access",
      "approval gates on high-impact actions",
      "complete activity records",
    ],
  },
  {
    n: "04",
    title: "AI Knowledge Systems",
    outcome:
      "Institutional knowledge converted into a permission-aware system people and agents can query with confidence.",
    delivered: [
      "structured ingestion",
      "retrieval evaluated against defined accuracy criteria",
      "access mirroring your permission structure",
    ],
  },
  {
    n: "05",
    title: "AI Integrations & Infrastructure",
    outcome:
      "AI capability connected to the systems you already run — without expanding your risk surface.",
    delivered: [
      "server-side integration layer",
      "credentials never client-exposed",
      "security review",
      "interface contracts",
    ],
  },
  {
    n: "06",
    title: "AI Governance & Cost Control",
    outcome:
      "Authority over what your AI does and what it costs: policy, approval structure, spend attribution, evaluation.",
    delivered: [
      "workflow-level cost telemetry",
      "policy enforced in infrastructure, not documentation",
    ],
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="relative py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>Solutions</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            Systems under contract. Not hours under retainer.
          </h2>
          <p className="mt-6 text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
            Every engagement runs under a Master Service Agreement: fixed
            deliverables, acceptance criteria, warranty, and defined IP
            ownership. The output is an operating system for a business
            function — documented, auditable, yours.
          </p>
        </div>
        <div className="cx-stagger mt-10 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <article
              key={c.title}
              className="cx-stagger-item glass-panel flex flex-col rounded-md p-6"
            >
              <span className="hud-label text-[var(--accent-glow)]">{c.n}</span>
              <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {c.outcome}
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-[var(--silver-dim)]">
                <span className="hud-label text-[var(--silver)]">Delivered with:</span>{" "}
                {c.delivered.join(" · ")}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="#contact"
            onClick={() =>
              trackCta({ cta: "start_project", section: "solutions", href: "#contact" })
            }
            className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
          >
            Start a project
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}