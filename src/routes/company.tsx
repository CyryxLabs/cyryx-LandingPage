import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
} from "@/components/cyryx/seo/seo";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";

const PATH = "/company";
const TITLE = "AI Systems & Governance Company — Cyryx Labs";
const DESC =
  "Cyryx Labs advises, builds, controls, and operates AI-enabled products and systems, informed by products and applied research.";

const UNITS = [
  [
    "Advise",
    "AI strategy, opportunity framing, architecture direction, governance, and operating-model design.",
    "/solutions/ai-strategy-advisory",
  ],
  [
    "Build",
    "Digital systems, workflows, internal assistants, and custom AI products designed around the business outcome.",
    "/solutions",
  ],
  [
    "Control",
    "Authority, evaluation, evidence, cost boundaries, review, escalation, and change control.",
    "/solutions/ai-governance-cost-control",
  ],
  [
    "Operate",
    "Defined monitoring, maintenance, optimization, escalation, and transition for selected launched systems.",
    "/managed-operations",
  ],
  [
    "Products",
    "MAAX Studio: an active product program exploring governed software execution.",
    "/products",
  ],
  [
    "Research",
    "Applied investigation into execution, context, evaluation, cost, control, and human authority.",
    "/research",
  ],
] as const;

const PRINCIPLES = [
  [
    "Business problem before model",
    "We begin with the decision, workflow, customer, and operating constraint—not a predetermined AI feature.",
  ],
  [
    "AI and software as one system",
    "Probabilistic intelligence, deterministic logic, data, integrations, interfaces, and people are designed together.",
  ],
  [
    "Authority must be explicit",
    "The system, the operator, and the owner each need a clear boundary for action, review, escalation, and change.",
  ],
  [
    "Evidence before expansion",
    "A compelling demonstration is a starting point. Expansion should follow representative validation and documented limitations.",
  ],
  [
    "Ownership survives launch",
    "The work is not complete until the system has an operating owner, change path, and support model appropriate to its impact.",
  ],
] as const;

export const Route = createFileRoute("/company")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Company", path: PATH },
      ]),
      buildOrganizationJsonLd(),
      buildWebPageJsonLd({ name: TITLE, description: DESC, path: PATH }),
    ]),
  component: CompanyPage,
});

function CompanyPage() {
  useCyryxScrollAnimations();
  const startHref = buildStartProjectHref({ source: "company", intent: "operating-capability" });

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <InternalHero
          eyebrow="AI systems · Product engineering · Governed operations"
          title="AI value is created by the system around the model."
          body="Cyryx Labs advises, builds, controls, and operates AI-enabled products and systems—from strategy and workflow design through launch and managed operations."
          primaryCta={{
            label: "Start a fit review",
            to: startHref,
            onClick: () => trackCta({ cta: "start_project", section: "hero", href: startHref }),
          }}
          secondaryCta={{
            label: "Explore capabilities",
            to: "/solutions",
            onClick: () => trackCta({ cta: "see_delivery", section: "hero", href: "/solutions" }),
          }}
          boundaryNote="Products and Applied Research inform the work; client scope remains independent."
          lifecycleLabel="Operating model"
          lifecycle={[
            { number: "01", label: "Advise" },
            { number: "02", label: "Build" },
            { number: "03", label: "Control" },
            { number: "04", label: "Operate" },
          ]}
          nextChapter={{
            title: "The execution gap.",
            body: "Most organizations underestimate what it takes to operationalize AI. The gap is not the model; it is the system.",
          }}
        />

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="cx-reveal grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div>
              <HudLabel>The execution gap</HudLabel>
              <h2 className="mt-6 max-w-[12ch] font-display text-4xl font-medium tracking-[-0.045em] text-[var(--silver)] sm:text-5xl">
                The model is rarely the whole problem.
              </h2>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              <p>
                Organizations can access capable models. The harder work is turning that capability
                into a dependable product, workflow, or operating decision: the right context,
                deterministic software, interfaces, integrations, evaluation, human authority, and
                post-launch ownership.
              </p>
              <p>
                Cyryx exists for that gap. We connect executive intent to system design and system
                design to the operating day, without pretending that every problem needs AI or that
                every prototype deserves to scale.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--obsidian)] px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <HudLabel>One company / four lifecycle stages + two transversal capabilities</HudLabel>
            <div className="cx-stagger mt-12 divide-y divide-white/10 border-y border-white/10">
              {UNITS.map(([title, body, href], index) => (
                <Link
                  key={title}
                  to={href}
                  className="cx-stagger-item group grid gap-4 py-7 sm:grid-cols-[4rem_0.65fr_1.35fr_auto] sm:items-center sm:gap-8 sm:py-9"
                >
                  <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-3xl tracking-[-0.035em] text-[var(--silver)]">
                    {title}
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-[var(--silver-dim)]">
                    {body}
                  </p>
                  <ArrowRight
                    className="hidden h-5 w-5 text-[var(--steel)] transition group-hover:translate-x-1 group-hover:text-[var(--accent-glow)] sm:block"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="cx-reveal grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <HudLabel>How we think</HudLabel>
              <h2 className="mt-6 font-display text-4xl tracking-[-0.045em] text-[var(--silver)] sm:text-5xl">
                Principles before promises.
              </h2>
            </div>
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {PRINCIPLES.map(([title, body], index) => (
                <li
                  key={title}
                  className="grid gap-3 py-6 sm:grid-cols-[3rem_0.8fr_1.2fr] sm:gap-8"
                >
                  <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                    0{index + 1}
                  </span>
                  <h3 className="text-sm font-medium text-[var(--silver)]">{title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--silver-dim)]">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[var(--graphite)] px-5 py-24 sm:px-8 sm:py-32">
          <div className="cx-reveal mx-auto max-w-5xl text-center">
            <HudLabel withDot>Start with the decision</HudLabel>
            <h2 className="mx-auto mt-7 max-w-[17ch] font-display text-4xl tracking-[-0.045em] text-[var(--silver)] sm:text-6xl">
              Bring the opportunity, constraint, or workflow—not a predetermined answer.
            </h2>
            <a
              href={startHref}
              className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-md border border-[var(--accent-glow)] px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-glow)] transition hover:bg-[var(--accent-glow)] hover:text-[var(--onyx)]"
            >
              Start a fit review <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
