import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2, Layers, ShieldCheck, Minus, Plus } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { BriefWizard } from "@/components/cyryx/brief/BriefWizard";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { isAssistantEnabled } from "@/lib/assistant-client";
import { trackCta } from "@/lib/track-cta";

const PATH = "/brief";
const TITLE = "Project Brief — Turn Your Idea into a Build-Ready Plan · Cyryx Labs";
const DESC =
  "Describe the software you need, attach wireframes and documents, and Cyryx Labs turns it into a requirements document you review before anything is built.";

const REASONS = [
  {
    icon: FileCheck2,
    title: "Build-ready from the start",
    body: "Goals, users, prioritized scope and success criteria are what a team needs to estimate and build. The brief asks for exactly that, in plain language.",
  },
  {
    icon: Layers,
    title: "Nothing gets lost",
    body: "Every requirement, file and decision stays attached to your project from the first conversation to handover, so nobody has to ask twice.",
  },
  {
    icon: ShieldCheck,
    title: "You stay in control",
    body: "You review and approve the requirements document before any build starts. What is unclear is listed as an open question, never filled in by assumption.",
  },
] as const;

const NEXT_STEPS = [
  ["Send the brief", "Answer what you know, skip the rest, attach what helps."],
  ["We review it", "A person reads it and sends clarifying questions where something is open."],
  [
    "You get a requirements document",
    "Scope, user stories with acceptance criteria, risks and open questions, for you to review and approve.",
  ],
  ["Proposal", "Phases, team, estimate and how we will measure success."],
  ["Kickoff", "Backlog, sprint zero and a working rhythm with demos you can see."],
] as const;

const PRD_SECTIONS = [
  "Overview and problem",
  "Goals and success metrics",
  "Users and personas",
  "Scope by priority (MoSCoW)",
  "User stories with acceptance criteria",
  "Functional and quality requirements",
  "Integrations and data",
  "AI behaviour and human approval points",
  "Risks, assumptions and open questions",
  "Delivery plan by phase",
] as const;

const FAQ = [
  {
    q: "Do I need a technical background?",
    a: "No. The brief is written for founders, operators and product owners. Answer in your own words; technical questions are optional.",
  },
  {
    q: "What if I don't know an answer?",
    a: "Skip it. Anything missing becomes an open question we clarify with you, instead of an assumption someone makes later.",
  },
  {
    q: "Is my information confidential?",
    a: "We use your brief and files only to assess and plan your project, as described in our Privacy Policy. We can sign an NDA before you share anything sensitive.",
  },
  {
    q: "What files can I attach?",
    a: "PDF, images (PNG, JPEG, WebP), Word, Excel, PowerPoint, text and CSV. Up to 10 files, 25 MB each. You can also paste screenshots.",
  },
  {
    q: "How does the AI help?",
    a: "If you want, the assistant drafts the steps from your description. It only fills empty fields, never guesses numbers, and you review everything before sending.",
  },
  {
    q: "Can I save and come back later?",
    a: "Yes. Your answers are saved on this device as you type. Files are not saved until you send the brief.",
  },
] as const;

export const Route = createFileRoute("/brief")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Project brief", path: PATH },
      ]),
    ]),
  component: BriefPage,
});

function BriefPage() {
  const assistAvailable = isAssistantEnabled();
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <InternalHero
          eyebrow="Cyryx Labs / Project brief"
          title="Tell us what to build."
          body="A clear brief is the fastest way from idea to working software. Describe the problem, the people and the scope, attach anything that helps, and we turn it into a requirements document you approve before any build starts."
          primaryCta={{
            label: "Start your brief",
            href: "#brief-form",
            onClick: () => trackCta({ cta: "form_start", section: "brief", href: "#brief-form" }),
          }}
          secondaryCta={{ label: "What you get", href: "#what-you-get" }}
          boundaryNote="About 15 minutes for a complete brief. Skip anything you don't know yet."
          lifecycleLabel="From brief to build"
          lifecycle={[
            { number: "01", label: "Brief", active: true },
            { number: "02", label: "Review" },
            { number: "03", label: "Requirements" },
            { number: "04", label: "Proposal" },
            { number: "05", label: "Kickoff" },
          ]}
          nextChapter={{
            title: "Built on how good software teams start.",
            body: "Problem first, then users, prioritized scope, measurable success and explicit risks.",
          }}
        />

        <section
          aria-labelledby="brief-why"
          className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div aria-hidden className="cx-aurora" />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-20">
              <div>
                <HudLabel withDot>Why a brief</HudLabel>
                <h2
                  id="brief-why"
                  className="mt-6 max-w-[16ch] font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-silver-gradient sm:text-5xl"
                >
                  Most software goes wrong before the first line of code.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
                Vague scope, unstated assumptions and missing people are what make projects late and
                expensive. Fifteen minutes here saves weeks later.
              </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {REASONS.map((reason) => (
                <article
                  key={reason.title}
                  className="cx-spotlight rounded-xl border border-white/10 bg-[var(--obsidian)] p-6 sm:p-8"
                >
                  <reason.icon className="h-6 w-6 text-[var(--accent-glow)]" aria-hidden />
                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--silver)]">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {reason.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="what-you-get"
          aria-labelledby="brief-next"
          className="scroll-mt-28 border-y border-white/10 bg-[var(--graphite)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <HudLabel withDot>What happens next</HudLabel>
              <h2
                id="brief-next"
                className="mt-6 font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl"
              >
                From brief to kickoff, in five clear steps.
              </h2>
              <ol className="mt-10 grid gap-0">
                {NEXT_STEPS.map(([title, body], index) => (
                  <li
                    key={title}
                    className="relative grid grid-cols-[2.5rem_1fr] gap-5 pb-8 last:pb-0"
                  >
                    {index < NEXT_STEPS.length - 1 ? (
                      <span
                        aria-hidden
                        className="absolute left-[1.2rem] top-10 bottom-0 w-px bg-white/10"
                      />
                    ) : null}
                    <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_60%,transparent)] bg-[var(--onyx)] font-mono text-[11px] text-[var(--accent-glow)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="pt-1.5">
                      <h3 className="font-display text-xl font-semibold text-[var(--silver)]">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="cx-spotlight self-start rounded-2xl border border-white/10 bg-[var(--onyx)] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-glow)]">
                Your requirements document
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                What we prepare from your brief, for you to review and approve:
              </p>
              <ul className="mt-5 grid gap-2">
                {PRD_SECTIONS.map((section, index) => (
                  <li
                    key={section}
                    className="flex items-center gap-3 border-b border-white/5 pb-2 text-sm text-[var(--silver)] last:border-b-0"
                  >
                    <span className="font-mono text-[11px] text-[var(--steel)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="brief-form"
          aria-labelledby="brief-form-heading"
          className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
          data-motion-skip
        >
          <div className="mx-auto max-w-7xl">
            <HudLabel withDot>Your brief</HudLabel>
            <h2
              id="brief-form-heading"
              className="mt-6 max-w-[20ch] font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl"
            >
              Start with what you know.
            </h2>
            <div className="mt-10">
              <BriefWizard assistAvailable={assistAvailable} />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="brief-faq"
          className="border-t border-white/10 px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <HudLabel withDot>Questions</HudLabel>
              <h2
                id="brief-faq"
                className="mt-6 font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl"
              >
                Before you start.
              </h2>
            </div>
            <div className="border-t border-white/10">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group border-b border-white/10 py-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-medium tracking-[-0.02em] text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] sm:text-xl">
                    {item.q}
                    <Plus
                      className="h-4 w-4 shrink-0 text-[var(--accent-glow)] group-open:hidden"
                      aria-hidden
                    />
                    <Minus
                      className="hidden h-4 w-4 shrink-0 text-[var(--accent-glow)] group-open:block"
                      aria-hidden
                    />
                  </summary>
                  <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
