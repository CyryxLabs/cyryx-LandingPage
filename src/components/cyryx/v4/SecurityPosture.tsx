import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { CGP_V1 } from "@/data/publications";

const CONTROLS = [
  [
    "Authority",
    "Agents receive bounded permissions. Consequential actions can require explicit human approval.",
  ],
  [
    "Gates",
    "Quality, security, cost, and completion checks can stop a mission before changes land.",
  ],
  ["Ledger", "Material actions preserve a record of context, execution, authorization, and cost."],
  ["Transfer", "Client systems are engineered for documented ownership and operational handover."],
] as const;

const FRAMEWORKS = ["EU AI Act", "NIST AI RMF", "ISO/IEC 42001"];

export function SecurityPosture() {
  return (
    <section
      id="security"
      className="relative overflow-hidden bg-[var(--graphite)] py-24 sm:py-32 lg:py-44"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[color-mix(in_oklab,var(--accent-glow)_22%,transparent)]"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal max-w-4xl">
          <HudLabel withDot>Proof before promise</HudLabel>
          <h2 className="mt-7 max-w-[16ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-7xl">
            Control is not a claim. It is a system of record.
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            The same primitives shape our product architecture, custom systems, and published
            research. We state what is ready, what is experimental, and what remains unknown.
          </p>
        </div>

        <div className="mt-14 grid gap-12 sm:mt-20 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <dl className="cx-stagger">
            {CONTROLS.map(([term, description]) => (
              <div
                key={term}
                className="cx-stagger-item grid gap-3 border-t border-[color-mix(in_oklab,var(--steel)_18%,transparent)] py-7 first:pt-0 sm:grid-cols-[8rem_1fr] sm:gap-6"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
                  {term}
                </dt>
                <dd className="text-[15px] leading-relaxed text-[var(--silver-dim)]">
                  {description}
                </dd>
              </div>
            ))}
          </dl>

          <article
            id="research"
            className="cx-reveal relative overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--silver)_16%,transparent)] bg-[var(--obsidian)] p-7 sm:p-10"
          >
            <div
              aria-hidden
              className="absolute right-0 top-0 h-32 w-32 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--accent-glow)_14%,transparent),transparent_70%)]"
            />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <HudLabel>{CGP_V1.category}</HudLabel>
                <span className="rounded-sm border border-[color-mix(in_oklab,var(--silver)_16%,transparent)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--steel)]">
                  {CGP_V1.license}
                </span>
              </div>
              <h3 className="mt-10 max-w-[20ch] font-display text-3xl font-medium leading-[1.04] tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                {CGP_V1.title}
              </h3>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--steel)]">
                {CGP_V1.subtitle} / {CGP_V1.date}
              </p>
              <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                An open control model for extending existing governance frameworks into agentic
                execution. The protocol is published for review and includes a MAAX Studio reference
                implementation.
              </p>
              <ul
                className="mt-6 flex flex-wrap gap-2"
                aria-label="Frameworks mapped by the Cyryx Governance Protocol"
              >
                {FRAMEWORKS.map((framework) => (
                  <li
                    key={framework}
                    className="rounded-sm bg-[color-mix(in_oklab,var(--silver)_7%,transparent)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--steel)]"
                  >
                    {framework}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3 border-t border-[color-mix(in_oklab,var(--silver)_12%,transparent)] pt-7 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  to="/research/$slug"
                  params={{ slug: CGP_V1.slug }}
                  className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
                >
                  Read the protocol <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                {CGP_V1.doiUrl && (
                  <a
                    href={CGP_V1.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-[var(--steel)] underline decoration-white/20 underline-offset-4 transition hover:text-[var(--accent-glow)]"
                  >
                    DOI {CGP_V1.doi} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
