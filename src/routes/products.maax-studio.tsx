import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Check, GitBranch, History, ShieldCheck, Users } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { MaaxWaitlistDialog } from "@/components/cyryx/maax/MaaxWaitlistDialog";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildSoftwareApplicationJsonLd,
} from "@/components/cyryx/seo/seo";
import { trackCta } from "@/lib/track-cta";
import maaxLogo from "@/assets/maax-studio-logo-exact.svg";
import maaxDevices from "@/assets/cyryx-maax-devices-1200.jpg";
import maaxDevices480 from "@/assets/cyryx-maax-devices-480.webp";
import maaxDevices800 from "@/assets/cyryx-maax-devices-800.webp";
import maaxDevices1200 from "@/assets/cyryx-maax-devices-1200.webp";

const PATH = "/products/maax-studio";
const TITLE = "MAAX Studio — Build with Agents. Keep Humans in Command.";
const DESC =
  "Join the MAAX Studio early-access list. Turn agentic software work into governed missions with coordinated execution, review, and an operating record.";

const OUTCOMES = [
  {
    icon: GitBranch,
    title: "One mission, coordinated work",
    body: "Give agents the same goal, project context, constraints, and definition of done.",
  },
  {
    icon: ShieldCheck,
    title: "Review before delivery",
    body: "Place human authority and checkpoints where the workflow actually needs them.",
  },
  {
    icon: History,
    title: "Evidence after execution",
    body: "Keep useful context, decisions, and mission state available for review and continuation.",
  },
] as const;

const LOOP = [
  [
    "Define",
    "Turn the outcome, constraints, repository context, and completion criteria into a mission.",
  ],
  ["Coordinate", "Organize specialized agents and tools around the same bounded unit of work."],
  [
    "Review",
    "Inspect progress and apply the human or automated gates appropriate to the environment.",
  ],
  [
    "Continue",
    "Preserve the operating record so the next decision starts with context, not reconstruction.",
  ],
] as const;

const EARLY_ACCESS_VALUE = [
  "Priority consideration for upcoming access waves",
  "Product updates focused on real software execution",
  "A direct path to share your team's operating requirements",
] as const;

const FAQ = [
  [
    "Is MAAX Studio available now?",
    "MAAX Studio is in active development. Access is not generally available and will open in reviewed waves as the product evolves.",
  ],
  [
    "Who is early access intended for?",
    "Software, product, and technical leadership teams exploring a more structured way to coordinate agents, tools, context, and review across real development work.",
  ],
  [
    "Does joining guarantee access?",
    "No. Joining records your interest and allows Cyryx Labs to contact you. Invitations depend on product readiness, team fit, and the focus of each access wave.",
  ],
  [
    "Will you publish pricing or a launch date?",
    "Not yet. We will communicate commercial and availability details when they are sufficiently defined to be useful and accurate.",
  ],
] as const;

export const Route = createFileRoute("/products/maax-studio")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "product" }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "MAAX Studio", path: PATH },
      ]),
      buildSoftwareApplicationJsonLd({
        name: "MAAX Studio",
        description: DESC,
        path: PATH,
        applicationSubCategory: "Agentic software execution environment",
      }),
    ]),
  component: MaaxStudioPage,
});

function MaaxStudioPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  useEffect(() => {
    trackCta({ cta: "maax_waitlist_view", section: "maax_product" });
  }, []);

  const openWaitlist = (surface: string) => {
    trackCta({
      cta: "request_maax_access",
      section: "maax_product",
      href: "#maax-waitlist-dialog",
      metadata: { surface },
    });
    setWaitlistOpen(true);
  };

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="overflow-hidden">
        <section className="relative min-h-[92svh] border-b border-white/10 px-5 pb-16 pt-32 sm:px-8 lg:pt-40">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 73% 31%, color-mix(in oklab, var(--accent-glow) 15%, transparent), transparent 27%), linear-gradient(115deg, transparent 48%, color-mix(in oklab, var(--accent-glow) 5%, transparent) 50%, transparent 52%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
            aria-hidden
          />

          <div className="relative mx-auto flex min-h-[calc(92svh-10rem)] max-w-7xl flex-col">
            <nav
              aria-label="Breadcrumb"
              className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--steel)]"
            >
              <Link to="/" className="transition hover:text-[var(--silver)]">
                Cyryx Labs
              </Link>
              <span className="mx-3 opacity-40">/</span>
              <span className="text-[var(--silver)]">MAAX Studio</span>
            </nav>

            <div className="my-auto grid items-center gap-12 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
              <div>
                <HudLabel withDot>Flagship product · Active development</HudLabel>
                <img
                  src={maaxLogo}
                  alt="MAAX Studio"
                  width={1794}
                  height={222}
                  className="mt-8 h-auto w-full max-w-[560px]"
                  decoding="async"
                />
                <h1 className="mt-10 max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[var(--silver)] sm:text-6xl lg:text-[5.35rem]">
                  Build software with agents.{" "}
                  <span className="text-[var(--accent-glow)]">Keep humans in command.</span>
                </h1>
              </div>

              <div className="border-l border-white/10 pl-6 sm:pl-9 lg:mt-24">
                <p className="max-w-xl text-lg leading-relaxed text-[var(--silver-dim)] sm:text-xl">
                  MAAX Studio turns agentic software work into governed missions — with shared
                  context, coordinated execution, deliberate review, and an operating record.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openWaitlist("maax_product_hero")}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--silver)] px-7 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--onyx)] transition hover:bg-white"
                  >
                    Join early access <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                  <a
                    href="#product"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
                  >
                    See the product <ArrowDown className="h-4 w-4" aria-hidden />
                  </a>
                </div>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--steel)]">
                  No public launch date · Invitations open in waves
                </p>
              </div>
            </div>

            <div className="grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-3">
              {["Mission-level context", "Human review points", "Persistent operating record"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex min-h-16 items-center gap-3 bg-[color-mix(in_oklab,var(--onyx)_92%,transparent)] px-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--silver-dim)]"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)]"
                      aria-hidden
                    />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section id="product" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end lg:gap-20">
              <div>
                <HudLabel>From prompt sprawl to an operating system</HudLabel>
                <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl">
                  Agentic execution needs more than a chat window.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-[var(--silver-dim)]">
                As software work moves across agents, tools, and sessions, teams can lose the goal,
                the decision trail, and the moment when a human should intervene. MAAX Studio is
                being built to keep that work coherent.
              </p>
            </div>

            <figure className="mt-14 overflow-hidden rounded-lg border border-white/10 bg-[var(--obsidian)]">
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${maaxDevices480} 480w, ${maaxDevices800} 800w, ${maaxDevices1200} 1200w`}
                  sizes="(min-width: 1280px) 1180px, 92vw"
                />
                <img
                  src={maaxDevices}
                  alt="MAAX Studio product direction shown across desktop and laptop interfaces"
                  width={1200}
                  height={896}
                  className="block h-auto w-full"
                  loading="eager"
                  decoding="async"
                />
              </picture>
              <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--steel)]">
                <span>Current product direction</span>
                <span>Interface and capabilities remain subject to change</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--graphite)] px-5 py-20 sm:px-8 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <HudLabel withDot>What changes for the team</HudLabel>
            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:grid-cols-3">
              {OUTCOMES.map(({ icon: Icon, title, body }, index) => (
                <article key={title} className="min-h-72 bg-[var(--obsidian)] p-7 sm:p-9">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-[var(--accent-glow)]" aria-hidden />
                    <span className="font-mono text-[9px] text-[var(--steel)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-16 font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)]">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <HudLabel>The mission loop</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl">
                A clearer path from intent to inspected work.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--silver-dim)]">
                The product direction is organized around a durable operating loop — not a promise
                of unrestricted autonomy.
              </p>
            </div>
            <ol className="border-t border-white/10">
              {LOOP.map(([title, body], index) => (
                <li
                  key={title}
                  className="grid gap-5 border-b border-white/10 py-8 sm:grid-cols-[3rem_1fr] sm:py-10"
                >
                  <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl font-medium tracking-[-0.03em] text-[var(--silver)]">
                      {title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="early-access"
          className="scroll-mt-20 border-y border-white/10 bg-[var(--obsidian)] px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
        >
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-24">
            <div>
              <HudLabel withDot>MAAX Studio early access</HudLabel>
              <h2 className="mt-7 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--silver)] sm:text-6xl">
                Be considered for the next access wave.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--silver-dim)]">
                Join the list if your team is exploring agentic software execution and wants a more
                controlled way to coordinate context, work, and review.
              </p>
              <ul className="mt-9 space-y-4">
                {EARLY_ACCESS_VALUE.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] text-[var(--silver-dim)]">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-glow)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-[var(--steel)]">
                <Users className="h-4 w-4 shrink-0" aria-hidden />
                <span>Built by Cyryx Labs for teams moving from experimentation to execution.</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[var(--graphite)] p-7 shadow-2xl shadow-black/30 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 82% 22%, color-mix(in oklab, var(--accent-glow) 15%, transparent), transparent 34%)",
                }}
              />
              <div className="relative">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--accent-glow)]">
                  Private early-access list
                </p>
                <h3 className="mt-5 max-w-md font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--silver)]">
                  Four fields. One focused next step.
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--silver-dim)]">
                  Tell us where to reach you. The application opens in a secure window and takes
                  less than a minute.
                </p>
                <button
                  type="button"
                  onClick={() => openWaitlist("maax_product_early_access")}
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--silver)] px-7 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--onyx)] transition hover:bg-white sm:w-auto"
                >
                  Open early-access form <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--steel)]">
                  No application essay · Invitations open in waves
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <HudLabel>Early-access questions</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.045em] text-[var(--silver)] sm:text-5xl">
                What to expect.
              </h2>
            </div>
            <div className="mt-12 border-t border-white/10">
              {FAQ.map(([question, answer]) => (
                <details key={question} className="group border-b border-white/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl font-medium text-[var(--silver)] marker:content-none">
                    {question}
                    <span
                      className="font-mono text-lg font-normal text-[var(--accent-glow)] transition group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => openWaitlist("maax_product_faq")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--accent-glow)] px-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-glow)] transition hover:bg-[var(--accent-glow)] hover:text-[var(--onyx)]"
              >
                Join the early-access list <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MaaxWaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </div>
  );
}
