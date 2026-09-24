import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Copy, Minus, Plus, X } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { AexosCycleSimulation } from "@/components/cyryx/aexos/AexosCycleSimulation";
import { AexosRoutingSimulation } from "@/components/cyryx/aexos/AexosRoutingSimulation";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import {
  AEXOS_ANSWERS,
  AEXOS_CONCEPTS,
  AEXOS_EDITIONS,
  AEXOS_ENVIRONMENTS,
  AEXOS_FAQ,
  AEXOS_GATES,
  AEXOS_NUMBERS,
  AEXOS_PRINCIPLES,
  AEXOS_PROBLEMS,
  AEXOS_REQUIREMENTS,
  AEXOS_ROLES,
  AEXOS_SQUADS,
  AEXOS_VERSION,
} from "@/data/aexos";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";

const PATH = "/products/aexos";
const TITLE = "AEXOS — Agentic Execution & Orchestration System · Cyryx Labs";
const DESC =
  "AEXOS is a CLI-first framework that installs AI agents, the procedures they follow and the quality gates they must pass into your project. Core is on npm.";

const COMMANDS = [
  { label: "New project", command: AEXOS_PRODUCT.installCommand },
  { label: "Existing repository", command: AEXOS_PRODUCT.existingProjectCommand },
  { label: "Check the installation", command: "aexos doctor --fix" },
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

function SectionIntro({
  label,
  title,
  body,
  id,
}: {
  label: string;
  title: string;
  body?: string;
  id: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-20">
      <div>
        <HudLabel withDot>{label}</HudLabel>
        <h2
          id={id}
          className="mt-6 max-w-[18ch] font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-silver-gradient sm:text-5xl"
        >
          {title}
        </h2>
      </div>
      {body ? (
        <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
          {body}
        </p>
      ) : null}
    </div>
  );
}

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
          <span className="select-none text-[var(--steel)]">$ </span>
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : `Copy command: ${command}`}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 text-[var(--silver-dim)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
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

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-white/10 py-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-medium tracking-[-0.02em] text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] sm:text-xl">
        {q}
        <Plus
          className="h-4 w-4 shrink-0 text-[var(--accent-glow)] group-open:hidden"
          aria-hidden
        />
        <Minus
          className="hidden h-4 w-4 shrink-0 text-[var(--accent-glow)] group-open:block"
          aria-hidden
        />
      </summary>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--silver-dim)]">{a}</p>
    </details>
  );
}

function AexosPage() {
  const product = AEXOS_PRODUCT;
  const talkHref = buildStartProjectHref({ source: "products", intent: "aexos" });
  const trackInstall = () =>
    trackCta({ cta: "view_product", section: "product", href: product.npmUrl });
  const trackTalk = () => trackCta({ cta: "start_project", section: "product", href: talkHref });

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <InternalHero
          eyebrow="Cyryx Labs / Products / AEXOS"
          title="AI agents that work to a method."
          body="AEXOS, the Agentic eXecution & Orchestration System, installs specialised AI agents, the procedures they follow and the gates they must pass into your project. You talk to one orchestrator; it routes the work to the specialist that owns it."
          primaryCta={{ label: "Install from npm", href: product.npmUrl, onClick: trackInstall }}
          secondaryCta={{ label: "Talk to us about AEXOS", href: talkHref, onClick: trackTalk }}
          boundaryNote={`Core available on npm · v${AEXOS_VERSION} · ${product.runtime}`}
          lifecycleLabel="Story development cycle"
          lifecycle={[
            { number: "01", label: "Create" },
            { number: "02", label: "Validate" },
            { number: "03", label: "Implement" },
            { number: "04", label: "QA gate", active: true },
            { number: "05", label: "Push" },
          ]}
          nextChapter={{
            title: "What it is, what it is for, and how it runs.",
            body: "Two simulations below show a story moving through the cycle and a request being routed.",
          }}
        />

        {/* What it is */}
        <section
          aria-labelledby="aexos-what"
          className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div aria-hidden className="cx-aurora" />
          <div className="relative mx-auto max-w-7xl">
            <SectionIntro
              id="aexos-what"
              label="What it is"
              title="A team with roles, procedures and gates, not a smarter prompt."
              body="AEXOS is a command-line framework. It scaffolds a team of AI specialists into your repository, together with the procedures they run, the checklists that decide when work is done, and the routing layer that decides who handles what. It works from your terminal and inside the AI coding environment you already use."
            />
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
              {[
                [
                  "Installs into your project",
                  "One command adds the agents, tasks, templates and checklists to the repository.",
                ],
                [
                  "Runs where you work",
                  "From the terminal and inside supported AI coding environments, with the same roster everywhere.",
                ],
                [
                  "Leaves a record",
                  "Stories, QA verdicts and state live in files you own and can review.",
                ],
              ].map(([title, body]) => (
                <article key={title} className="cx-spotlight bg-[var(--obsidian)] p-6 sm:p-8">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.025em] text-[var(--silver)]">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why it exists */}
        <section
          aria-labelledby="aexos-why"
          className="border-y border-white/10 bg-[var(--graphite)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              id="aexos-why"
              label="What it is for"
              title="AI-assisted delivery breaks in the same four places."
              body="AEXOS enforces the method instead of recommending it. Each failure on the left has a rule on the right."
            />
            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              <ul className="grid gap-3" aria-label="Without a method">
                {AEXOS_PROBLEMS.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-4 rounded-lg border border-white/10 bg-[var(--onyx)] p-5 sm:p-6"
                  >
                    <X className="mt-1 h-4 w-4 shrink-0 text-[#d3b36a]" aria-hidden />
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[var(--silver)]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--silver-dim)]">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <ul className="grid gap-3" aria-label="With AEXOS">
                {AEXOS_ANSWERS.map((item) => (
                  <li
                    key={item.title}
                    className="cx-spotlight flex gap-4 rounded-lg border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent-glow)_5%,var(--onyx))] p-5 sm:p-6"
                  >
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-glow)]"
                      aria-hidden
                    />
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[var(--silver)]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--silver-dim)]">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Cycle simulation */}
        <section aria-labelledby="aexos-cycle" className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              id="aexos-cycle"
              label="How it runs"
              title="Watch one story move from draft to push."
              body="Every change starts as a story. It is validated before anyone writes code, implemented against its acceptance criteria, gated by QA and pushed by the one agent allowed to push. Nothing skips a step."
            />
            <div className="mt-12">
              <AexosCycleSimulation />
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
                Simulation · commands and verdicts as documented, example story
              </p>
            </div>
          </div>
        </section>

        {/* Routing simulation */}
        <section
          aria-labelledby="aexos-routing"
          className="relative overflow-hidden border-y border-white/10 bg-[var(--obsidian)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div className="relative mx-auto max-w-7xl">
            <SectionIntro
              id="aexos-routing"
              label="Routing"
              title="You talk to one orchestrator."
              body="The orchestrator reads a generated registry, matches your request to a domain and routes it to the specialists that own it. Adding a squad needs no change to the orchestrator."
            />
            <div className="mt-12">
              <AexosRoutingSimulation />
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
                Simulation · example requests
              </p>
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section aria-labelledby="aexos-numbers" className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id="aexos-numbers"
                className="font-display text-3xl font-semibold tracking-[-0.035em] text-[var(--silver)] sm:text-4xl"
              >
                What ships in the package
              </h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
                Counted from @aexos/core {AEXOS_VERSION}
              </p>
            </div>
            <span
              aria-hidden
              data-draw
              className="mt-8 block h-px bg-[var(--accent-glow)] opacity-60"
            />
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {AEXOS_NUMBERS.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
                    {item.label}
                  </dt>
                  <dd className="mt-3">
                    <span
                      data-count={item.value}
                      className="block font-display text-5xl font-semibold tracking-[-0.05em] text-chrome-gradient tabular-nums sm:text-6xl"
                    >
                      {item.value}
                    </span>
                    <span className="mt-2 block text-sm text-[var(--silver-dim)]">
                      {item.detail}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Concepts */}
        <section
          aria-labelledby="aexos-concepts"
          className="border-y border-white/10 bg-[var(--graphite)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              id="aexos-concepts"
              label="Building blocks"
              title="Six concepts carry the whole system."
              body="Workflows are made of connected tasks, not connected agents. That is what keeps the method stable when agents change."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AEXOS_CONCEPTS.map((concept, index) => (
                <article
                  key={concept.name}
                  className="cx-spotlight rounded-lg border border-white/10 bg-[var(--onyx)] p-6 sm:p-7"
                >
                  <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--silver)]">
                    {concept.name}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {concept.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Roles and squads */}
        <section aria-labelledby="aexos-roles" className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              id="aexos-roles"
              label="The team"
              title="Twelve core roles, nine squads."
              body="Core roles cover software delivery end to end. Squads extend the same method to business domains, each with one entry agent and specialists that cite the published method they apply."
            />
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
              <ul className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
                {AEXOS_ROLES.map((role) => (
                  <li key={role.handle} className="bg-[var(--obsidian)] px-5 py-4">
                    <span className="font-mono text-sm text-[var(--accent-glow)]">
                      {role.handle}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[var(--silver-dim)]">
                      {role.role}
                    </span>
                  </li>
                ))}
              </ul>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--steel)]">
                  Squads in Core
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {AEXOS_SQUADS.map((squad) => (
                    <li
                      key={squad}
                      className="rounded-full border border-white/15 px-3.5 py-2 text-sm text-[var(--silver)]"
                    >
                      {squad}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Gates and principles */}
        <section
          aria-labelledby="aexos-gates"
          className="relative overflow-hidden border-y border-white/10 bg-[var(--obsidian)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              id="aexos-gates"
              label="Quality and rules"
              title="Three gate layers. A constitution the agents follow."
              body="Checks run at three points before code is accepted. The rules every agent follows are written down in the project, and the non-negotiable ones block execution when broken."
            />
            <ol className="relative mt-12 grid gap-4 md:grid-cols-3">
              <span
                aria-hidden
                className="cx-sweep-line absolute left-0 right-0 top-[1.15rem] hidden h-px bg-white/10 md:block"
              />
              {AEXOS_GATES.map((gate, index) => (
                <li key={gate.layer} className="relative">
                  <span className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_60%,transparent)] bg-[var(--onyx)] font-mono text-[11px] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-[var(--silver)]">
                    {gate.layer}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {gate.checks}
                  </p>
                </li>
              ))}
            </ol>
            <ul className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
              {AEXOS_PRINCIPLES.map((principle) => (
                <li key={principle.name} className="bg-[var(--onyx)] p-5">
                  <h3 className="font-display text-base font-semibold text-[var(--silver)]">
                    {principle.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                    {principle.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Get started */}
        <section aria-labelledby="aexos-start" className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <HudLabel withDot>Get started</HudLabel>
              <h2
                id="aexos-start"
                className="mt-6 font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl"
              >
                One command to install Core.
              </h2>
              <p className="mt-6 text-sm font-medium text-[var(--silver)]">Works with</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {AEXOS_ENVIRONMENTS.map((environment) => (
                  <li
                    key={environment}
                    className="rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] px-3.5 py-1.5 text-sm text-[var(--silver)]"
                  >
                    {environment}
                  </li>
                ))}
                <li className="px-1 py-1.5 text-sm text-[var(--silver-dim)]">
                  and other AI coding environments
                </li>
              </ul>
              <p className="mt-6 text-sm font-medium text-[var(--silver)]">Requirements</p>
              <ul className="mt-3 space-y-1.5 text-sm text-[var(--silver-dim)]">
                {AEXOS_REQUIREMENTS.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-4">
              {COMMANDS.map((item) => (
                <CommandLine key={item.label} label={item.label} command={item.command} />
              ))}
              <p className="mt-2 text-sm text-[var(--silver-dim)]">
                Restart your AI coding environment after installation so it loads the generated
                agents and rules. Then ask{" "}
                <code className="font-mono text-[var(--accent-glow)]">@aexos-master</code> for{" "}
                <code className="font-mono text-[var(--accent-glow)]">*help</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Editions */}
        <section
          aria-labelledby="aexos-editions"
          className="border-y border-white/10 bg-[var(--graphite)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              id="aexos-editions"
              label="Editions"
              title="Start free with Core."
              body="AEXOS is proprietary software from Cyryx Labs. Core is free to use under the AEXOS license; Pro is licensed commercially."
            />
            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              {AEXOS_EDITIONS.map((edition) => (
                <article
                  key={edition.name}
                  className="cx-spotlight flex flex-col rounded-xl border border-white/10 bg-[var(--onyx)] p-7 sm:p-9"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--silver)]">
                      {edition.name}
                    </h3>
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
                onClick={trackInstall}
              >
                Install Core <ArrowRight className="h-4 w-4" aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={talkHref} className="cx-btn-secondary" onClick={trackTalk}>
                Ask about Pro or team use <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="aexos-faq" className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <HudLabel withDot>Questions</HudLabel>
              <h2
                id="aexos-faq"
                className="mt-6 font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl"
              >
                Before you install.
              </h2>
            </div>
            <div className="border-t border-white/10">
              {AEXOS_FAQ.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
