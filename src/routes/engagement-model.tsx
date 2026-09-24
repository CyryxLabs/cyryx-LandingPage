import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";

const PATH = "/engagement-model";
const TITLE = "How We Work — Cyryx Labs";
const DESC =
  "How a Cyryx engagement runs: Discover, Design, Build, Validate, then Launch & Operate under defined terms, with written decisions and evidence at every stage.";

const STEPS = [
  [
    "01",
    "Discover",
    "Understand the business problem, current workflow, systems, data, security constraints, ownership, and decision context.",
    ["Problem definition", "Workflow and stakeholder map", "Evidence and access needs"],
  ],
  [
    "02",
    "Design",
    "Define the target experience, architecture, authority, dependencies, acceptance criteria, implementation sequence, and operating model.",
    ["Architecture direction", "Delivery scope", "Acceptance and governance requirements"],
  ],
  [
    "03",
    "Build",
    "Implement the agreed system in controlled increments, integrating AI and deterministic software according to the design.",
    ["Working increments", "Documented decisions", "Integration and operating setup"],
  ],
  [
    "04",
    "Validate",
    "Test material behavior against written criteria, record limitations, and resolve issues before launch decisions.",
    ["Acceptance evidence", "Known limitations", "Launch recommendation"],
  ],
  [
    "05",
    "Launch & Operate",
    "Release, transfer access and knowledge, and optionally continue under a separately defined managed-operations scope.",
    ["Launch and handover", "Training and documentation", "Optional operating agreement"],
  ],
] as const;

export const Route = createFileRoute("/engagement-model")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "How We Work", path: PATH },
      ]),
    ]),
  component: EngagementModelPage,
});

function EngagementModelPage() {
  const startHref = buildStartProjectHref({ source: "engagement-model" });
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <InternalHero
          eyebrow="How we work · Controlled delivery"
          title="Decisions first. Evidence throughout. Ownership at launch."
          body="Every engagement is shaped around the actual problem, authority, and operating life of the system."
          primaryCta={{
            label: "Start a project",
            to: startHref,
            onClick: () =>
              trackCta({ cta: "start_project", section: "solutions", href: startHref }),
          }}
          secondaryCta={{ label: "Explore capabilities", to: "/solutions" }}
          boundaryNote="Scope, commercial terms, ownership, licensing, support, acceptance, and operational responsibility are defined in writing for each engagement."
          lifecycleLabel="Delivery lifecycle"
          lifecycle={[
            { number: "01", label: "Discover", active: true },
            { number: "02", label: "Design" },
            { number: "03", label: "Build" },
            { number: "04", label: "Validate" },
            { number: "05", label: "Launch & Operate" },
          ]}
          nextChapter={{
            title: "A controlled delivery lifecycle.",
            body: "Each stage turns ambiguity into written decisions, testable evidence, and explicit ownership.",
          }}
        />

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <ol className="relative">
            <div
              aria-hidden
              className="absolute bottom-0 left-[1.2rem] top-0 w-px bg-[color-mix(in_oklab,var(--accent-glow)_22%,transparent)] sm:left-[2rem]"
            />
            {STEPS.map(([n, title, body, outputs]) => (
              <li
                key={n}
                className="relative grid gap-6 pb-16 last:pb-0 sm:grid-cols-[4rem_0.75fr_1.25fr] sm:gap-10 sm:pb-20"
              >
                <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent-glow)] bg-[var(--onyx)] font-mono text-[9px] text-[var(--accent-glow)] sm:h-16 sm:w-16">
                  {n}
                </span>
                <div>
                  <h2 className="font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                    {title}
                  </h2>
                  <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {body}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--steel)]">
                    Representative outputs
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-[var(--silver-dim)]">
                    {outputs.map((output) => (
                      <li key={output} className="flex gap-3">
                        <span aria-hidden className="text-[var(--accent-glow)]">
                          /
                        </span>
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-[var(--graphite)] px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-24">
            <div>
              <HudLabel>Commercial and ownership terms</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-medium tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
                Defined for the engagement — never implied by the website.
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-[var(--silver-dim)]">
              Price structure, timeline, acceptance, intellectual property, licenses, third-party
              services, data handling, support, warranty, change control, and handover vary by
              scope. The applicable proposal and agreement control those terms. Optional managed
              operations are documented separately.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <HudLabel withDot>Start with the problem</HudLabel>
          <h2 className="mt-7 font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--silver)] sm:text-6xl">
            Bring the workflow, bottleneck, or system decision.
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={startHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--silver)] px-7 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--onyx)] transition hover:bg-white"
            >
              Start a project <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link
              to="/solutions"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/15 px-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
            >
              Explore capabilities
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
