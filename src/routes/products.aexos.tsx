import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";

const PATH = "/products/aexos";
const TITLE = "AEXOS — Governed AI-Assisted Software Delivery · Cyryx Labs";
const DESC =
  "AEXOS is a CLI-first system that installs roles, procedures, quality gates and an audit trail into a software project. The Core edition is available on npm.";

const PRINCIPLES = [
  {
    title: "Task contracts, not prompts",
    body: "Each piece of work runs from a procedure with declared inputs, outputs and a completion checklist. Agents route and execute; the method lives in the contract.",
  },
  {
    title: "Gates that can stop work",
    body: "Stories are validated before implementation and gated by QA before anything is published. A failed critical check blocks the next step.",
  },
  {
    title: "A record of what shipped",
    body: "Story files, QA verdicts and state artifacts make delivery inspectable and resumable, so a team can see who decided what and why.",
  },
] as const;

const COMMANDS = [
  { label: "New project", command: AEXOS_PRODUCT.installCommand },
  { label: "Existing repository", command: AEXOS_PRODUCT.existingProjectCommand },
  { label: "Check the installation", command: "aexos doctor --fix" },
] as const;

const EDITIONS = [
  {
    name: "Core",
    state: "Available now",
    body: "Free under the AEXOS license for personal, internal, educational and commercial use. CLI installer and runtime, core agents, tasks and workflows, multi-IDE projections, diagnostics and updates.",
  },
  {
    name: "Pro",
    state: "In beta",
    body: "Advanced capabilities and premium execution packs for individual commercial use. Pricing is not published yet.",
  },
  {
    name: "Teams and enterprise",
    state: "By conversation",
    body: "Private squads and packs, shared governance templates, onboarding and support for engineering teams.",
  },
] as const;

export const Route = createFileRoute("/products/aexos")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "AEXOS", path: PATH },
      ]),
    ]),
  component: AexosPage,
});

function CommandLine({ label, command }: { label: string; command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      trackCta({ cta: "copy_command", section: "product", href: PATH });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
        {label}
      </span>
      <div className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-white/10 bg-[var(--onyx)] px-4 py-3">
        <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-sm text-[var(--silver)]">
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : `Copy command: ${command}`}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-[var(--silver-dim)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}

function AexosPage() {
  const product = AEXOS_PRODUCT;
  const talkHref = buildStartProjectHref({ source: "products", intent: "aexos" });

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <InternalHero
          eyebrow="Cyryx Labs / Products / AEXOS"
          title="Govern AI-assisted delivery from intent to accepted outcome."
          body={product.description}
          primaryCta={{
            label: "Install from npm",
            href: product.npmUrl,
            onClick: () =>
              trackCta({ cta: "view_product", section: "product", href: product.npmUrl }),
          }}
          secondaryCta={{
            label: "Talk to us about AEXOS",
            href: talkHref,
            onClick: () => trackCta({ cta: "start_project", section: "product", href: talkHref }),
          }}
          boundaryNote={`${product.maturity}. Runs on ${product.runtime}.`}
          lifecycleLabel="Story development cycle"
          lifecycle={[
            { number: "01", label: "Create" },
            { number: "02", label: "Validate" },
            { number: "03", label: "Implement" },
            { number: "04", label: "Gate", active: true },
            { number: "05", label: "Publish" },
          ]}
          nextChapter={{
            title: "Built for teams already shipping with AI coding agents.",
            body: "AEXOS gives those agents roles, procedures and gates, and keeps the evidence.",
          }}
        />

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <HudLabel withDot>How it works</HudLabel>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:grid-cols-3">
            {PRINCIPLES.map((item) => (
              <article key={item.title} className="bg-[var(--obsidian)] p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--silver)]">
                  {item.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--silver-dim)]">
            Works inside the AI development environments your team already uses:{" "}
            <span className="text-[var(--silver)]">{product.hosts.join(", ")}</span> and others.
          </p>
        </section>

        <section className="border-y border-white/10 bg-[var(--graphite)] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <HudLabel withDot>Get started</HudLabel>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
              Install the Core edition from npm.
            </h2>
            <div className="mt-8 grid gap-4">
              {COMMANDS.map((item) => (
                <CommandLine key={item.label} label={item.label} command={item.command} />
              ))}
            </div>
            <p className="mt-5 text-sm text-[var(--silver-dim)]">
              Restart your AI development environment after installation so it loads the generated
              commands and rules.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <HudLabel withDot>Editions</HudLabel>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {EDITIONS.map((edition) => (
              <article
                key={edition.name}
                className="flex flex-col rounded-lg border border-white/10 bg-[var(--obsidian)] p-6 sm:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--silver)]">
                    {edition.name}
                  </h2>
                  <span className="rounded-sm border border-white/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent-glow)]">
                    {edition.state}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                  {edition.body}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={product.npmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cx-btn-primary"
              onClick={() =>
                trackCta({ cta: "view_product", section: "product", href: product.npmUrl })
              }
            >
              Install Core <ArrowRight className="h-4 w-4" aria-hidden />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={talkHref}
              className="cx-btn-secondary"
              onClick={() => trackCta({ cta: "start_project", section: "product", href: talkHref })}
            >
              Join the Pro beta or talk to us <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
