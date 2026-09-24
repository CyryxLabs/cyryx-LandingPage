import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";

type ArtifactKey = "brief" | "acceptance" | "record";

const ARTIFACTS: readonly { key: ArtifactKey; title: string; body: string }[] = [
  {
    key: "brief",
    title: "Architecture brief",
    body: "What should exist, how it should work, and where its limits begin.",
  },
  {
    key: "acceptance",
    title: "Acceptance matrix",
    body: "What must be true before the system can be trusted to advance.",
  },
  {
    key: "record",
    title: "Operating record",
    body: "What happened, who approved it, and what it cost.",
  },
];

const BRIEF_ROWS: readonly [string, string][] = [
  ["Objective", "Route supplier-invoice exceptions to the right approver the same day."],
  ["In scope", "Invoice intake, classification, exception routing"],
  ["Out of scope", "Payment execution, vendor onboarding"],
  ["Systems", "ERP (read) · shared inbox (read) · ticketing (write)"],
  ["Authority limits", "No approvals above $5,000 · no changes to vendor master data"],
  ["Open risks", "Duplicate invoices across two legal entities"],
];

const ACCEPTANCE_ROWS: readonly [string, string, string, string][] = [
  ["Classification accuracy on 500 held-out invoices", "≥ 97%", "Evaluation report", "Met"],
  ["Exceptions reaching a person within the agreed window", "100%", "Queue log", "Met"],
  ["Model cost per processed invoice", "≤ $0.05", "Cost ledger", "Met"],
  ["Actions outside granted authority", "0", "Policy gate log", "Met"],
];

const RECORD_LINES: readonly [string, string, string][] = [
  ["09:14:02", "agent · classifier", "Classified INV-2291 as price variance · $0.004"],
  ["09:14:05", "policy gate", "Blocked auto-approval: $7,420 exceeds the $5,000 limit"],
  ["09:14:05", "router", "Assigned to finance lead"],
  ["10:02:40", "finance lead", "Approved with note: contract rate updated"],
  ["10:02:41", "ledger", "Decision stored with inputs, approver and cost"],
];

function SampleBadge() {
  return (
    <span className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--steel)]">
      Sample · illustrative data
    </span>
  );
}

function ArtifactPreview({ artifact }: { artifact: ArtifactKey }) {
  if (artifact === "brief") {
    return (
      <dl className="grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 text-sm">
        {BRIEF_ROWS.map(([term, value]) => (
          <div
            key={term}
            className="grid gap-1 bg-[var(--onyx)] px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
          >
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--steel)]">
              {term}
            </dt>
            <dd className="text-[var(--silver)]">{value}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (artifact === "acceptance") {
    return (
      <div className="overflow-x-auto rounded-md border border-white/10">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="bg-[var(--graphite)] font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--steel)]">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Criterion
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Threshold
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Evidence
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-[var(--onyx)]">
            {ACCEPTANCE_ROWS.map(([criterion, threshold, evidence, status]) => (
              <tr key={criterion}>
                <td className="px-4 py-3 text-[var(--silver)]">{criterion}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--silver)]">
                  {threshold}
                </td>
                <td className="px-4 py-3 text-[var(--silver-dim)]">{evidence}</td>
                <td className="px-4 py-3 font-mono text-[var(--accent-glow)]">{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <ol className="overflow-x-auto rounded-md border border-white/10 bg-[var(--onyx)] font-mono text-[12.5px] leading-relaxed">
      {RECORD_LINES.map(([time, actor, event]) => (
        <li
          key={`${time}-${actor}`}
          className="grid min-w-[34rem] grid-cols-[5.5rem_9.5rem_1fr] gap-3 border-b border-white/5 px-4 py-2.5 last:border-b-0"
        >
          <span className="tabular-nums text-[var(--steel)]">{time}</span>
          <span className="text-[var(--accent-glow)]">{actor}</span>
          <span className="text-[var(--silver)]">{event}</span>
        </li>
      ))}
    </ol>
  );
}

export function EvidenceBeforeClaims() {
  const [active, setActive] = useState<ArtifactKey>("brief");
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (key: ArtifactKey) => {
    setActive(key);
    trackCta({ cta: "evidence_sample", section: "evidence", href: `#${key}` });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      (index + (event.key === "ArrowRight" ? 1 : ARTIFACTS.length - 1)) % ARTIFACTS.length;
    select(ARTIFACTS[next].key);
    tabRefs.current[next]?.focus();
  };

  const activeArtifact = ARTIFACTS.find((a) => a.key === active) ?? ARTIFACTS[0];

  return (
    <section
      id="evidence"
      aria-labelledby="evidence-heading"
      data-story-section
      className="relative overflow-hidden bg-[var(--graphite)] py-12 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-6 sm:gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-20">
          <div>
            <HudLabel withDot>What you receive</HudLabel>
            <h2
              id="evidence-heading"
              className="mt-6 max-w-[15ch] font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-6xl"
            >
              Every engagement leaves evidence you can review.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            Before a system gets more trust, three documents make its design, its limits and its
            behavior explicit. Here is what each one looks like.
          </p>
        </div>

        <div className="cx-reveal mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <div role="tablist" aria-label="Evidence documents" className="grid gap-2">
            {ARTIFACTS.map((artifact, index) => {
              const selected = artifact.key === active;
              return (
                <button
                  key={artifact.key}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${artifact.key}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(artifact.key)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`rounded-md border px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] ${
                    selected
                      ? "border-[color-mix(in_oklab,var(--accent-glow)_55%,transparent)] bg-[color-mix(in_oklab,var(--accent-glow)_7%,var(--obsidian))]"
                      : "border-white/10 bg-[var(--obsidian)] hover:border-white/25"
                  }`}
                >
                  <span className="block font-display text-xl font-semibold tracking-[-0.02em] text-[var(--silver)]">
                    {artifact.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-[var(--silver-dim)]">
                    {artifact.body}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${active}`}
            className="rounded-lg border border-white/10 bg-[var(--obsidian)] p-4 sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-lg font-semibold text-[var(--silver)]">
                {activeArtifact.title}
              </p>
              <SampleBadge />
            </div>
            <ArtifactPreview artifact={active} />
          </div>
        </div>

        <div className="cx-reveal mt-8 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            to="/research/$slug"
            params={{ slug: "cgp-v1" }}
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent-glow)]"
          >
            Read the Cyryx Governance Protocol <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            to="/answers"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--silver-dim)] transition-colors hover:text-[var(--silver)]"
          >
            Read Cyryx Answers <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
