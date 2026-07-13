import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { CGP_V1 } from "@/data/publications";
import { trackCta } from "@/lib/track-cta";

const FRAMEWORKS = ["EU AI Act", "NIST AI RMF", "ISO/IEC 42001"];

export function ResearchBand() {
  return (
    <section id="research" className="relative py-20 sm:py-28 lg:py-40 bg-[var(--graphite)]">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:items-center">
          <div className="cx-reveal">
            <HudLabel withDot>Applied Research</HudLabel>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
              Our claims are published, mapped, and citable.
            </h2>
            <p className="mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
              The governance model behind every Cyryx system is not a slide — it is a published
              protocol with a DOI, mapped control-by-control to the EU AI Act, NIST AI RMF, and
              ISO/IEC 42001, and implemented in MAAX Studio.
            </p>
            <div className="mt-8">
              <Link
                to="/research"
                onClick={() =>
                  trackCta({ cta: "view_research", section: "research_band", href: "/research" })
                }
                className="inline-flex min-h-11 items-center gap-2 hud-label text-[var(--accent-glow)] hover:gap-3 transition-all"
              >
                All research &amp; publications <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>

          <article className="cx-reveal glass-panel relative rounded-md p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <HudLabel className="text-[var(--accent-glow)]">{CGP_V1.category}</HudLabel>
              <span className="hud-label rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] px-2 py-0.5 text-[var(--accent-glow)]">
                {CGP_V1.license}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--silver)]">
              {CGP_V1.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--silver-dim)]">
              {CGP_V1.subtitle} · {CGP_V1.date}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)]">
              Seven control domains and twenty-eight normative controls — designed as an extension
              to existing frameworks, not a replacement. Every control has a reference
              implementation in {CGP_V1.referenceImplementation}.
            </p>

            <ul
              className="mt-5 flex flex-wrap gap-2"
              aria-label="Frameworks mapped by the protocol"
            >
              {FRAMEWORKS.map((f) => (
                <li
                  key={f}
                  className="rounded-sm border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--silver)]"
                >
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[color-mix(in_oklab,var(--silver)_10%,transparent)] pt-5">
              <Link
                to="/research/$slug"
                params={{ slug: CGP_V1.slug }}
                onClick={() =>
                  trackCta({
                    cta: "read_cgp",
                    section: "research_band",
                    href: `/research/${CGP_V1.slug}`,
                  })
                }
                className="inline-flex min-h-11 items-center gap-2 hud-label text-[var(--accent-glow)]"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden /> Read the protocol
              </Link>
              {CGP_V1.doiUrl && (
                <a
                  href={CGP_V1.doiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-mono text-[11px] tracking-[0.08em] text-[var(--silver-dim)] underline underline-offset-4 hover:text-[var(--accent-glow)]"
                >
                  DOI {CGP_V1.doi}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
