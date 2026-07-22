import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { setContactIntent } from "@/lib/contact-intent";
import { trackCta } from "@/lib/track-cta";

const PATHS = [
  {
    n: "01",
    eyebrow: "Custom systems",
    title: "Build an AI capability your business can own.",
    body: "Turn a high-cost workflow, product opportunity, or fragmented operation into an integrated system with explicit acceptance criteria and operational handover.",
    cta: "Discuss a project",
    href: "#contact",
    intent: "project" as const,
  },
  {
    n: "02",
    eyebrow: "Product",
    title: "Adopt the command layer with MAAX Studio.",
    body: "Join the early-access cohort and evaluate mission-based, governed agentic execution inside a product built by Cyryx for AI-native teams.",
    cta: "Request early access",
    href: "#contact",
    intent: "maax-early-access" as const,
  },
  {
    n: "03",
    eyebrow: "Research",
    title: "Use the protocol.",
    body: "Read the open Cyryx Governance Protocol and inspect the control model that informs our products and delivery work.",
    cta: "Explore research",
    href: "/research",
    intent: null,
  },
];

const DELIVERY = [
  ["01", "Diagnose", "Clarify the workflow, authority, data, risk, and economic case."],
  ["02", "Scope", "Fix deliverables, exclusions, acceptance criteria, timeline, and price."],
  [
    "03",
    "Build + verify",
    "Engineer the system and test material behavior against written criteria.",
  ],
  ["04", "Transfer", "Hand over documentation, access, training, and operational control."],
] as const;

export function WhatWeBuild() {
  return (
    <section id="what-we-build" className="relative py-24 sm:py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-20">
          <div>
            <HudLabel withDot>How we create the capability</HudLabel>
            <h2 className="mt-7 max-w-[12ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-7xl">
              From AI opportunity to an operating system.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg lg:pb-2">
            Start with the business constraint, not a fashionable tool. Commission a custom system,
            adopt our product, or inspect the open research behind our execution model.
          </p>
        </div>

        <div className="cx-stagger mt-14 grid gap-px overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[color-mix(in_oklab,var(--silver)_14%,transparent)] sm:mt-20 lg:grid-cols-3">
          {PATHS.map((path) => {
            const content = (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.24em] text-[var(--accent-glow)]">
                    {path.n}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--steel)]">
                    {path.eyebrow}
                  </span>
                </div>
                <h3 className="mt-16 max-w-[12ch] font-display text-3xl font-medium leading-[1.02] tracking-[-0.035em] text-[var(--silver)]">
                  {path.title}
                </h3>
                <p className="mt-5 flex-1 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                  {path.body}
                </p>
                <span className="mt-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] transition group-hover:text-[var(--accent-glow)]">
                  {path.cta}{" "}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </>
            );

            const className =
              "cx-stagger-item group flex min-h-[29rem] flex-col bg-[var(--obsidian)] p-7 transition-colors hover:bg-[color-mix(in_oklab,var(--graphite)_88%,var(--teal))] sm:p-9";

            if (path.href.startsWith("#")) {
              return (
                <a
                  key={path.n}
                  href={path.href}
                  onClick={() => {
                    if (path.intent) setContactIntent(path.intent);
                    trackCta({
                      cta:
                        path.intent === "maax-early-access"
                          ? "request_early_access"
                          : "start_project",
                      section: "paths",
                      href: path.href,
                    });
                  }}
                  className={className}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={path.n} to={path.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>

        <div className="mt-24 border-t border-[color-mix(in_oklab,var(--silver)_14%,transparent)] pt-10 sm:mt-32 sm:pt-14">
          <div className="cx-reveal flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <HudLabel>One accountable delivery model</HudLabel>
              <h3 className="mt-5 font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                Clear decisions. Verifiable delivery. Operational ownership.
              </h3>
            </div>
            <Link
              to="/engagement-model"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--steel)] transition hover:text-[var(--accent-glow)]"
            >
              Full engagement model <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <ol className="cx-stagger mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERY.map(([n, title, body]) => (
              <li
                key={n}
                className="cx-stagger-item border-l border-[color-mix(in_oklab,var(--steel)_22%,transparent)] pl-5"
              >
                <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--accent-glow)]">
                  {n}
                </span>
                <h4 className="mt-4 font-display text-lg font-medium text-[var(--silver)]">
                  {title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
