import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";
import maaxDevices from "@/assets/cyryx-maax-devices-1200.jpg";
import maaxDevices480 from "@/assets/cyryx-maax-devices-480.webp";
import maaxDevices800 from "@/assets/cyryx-maax-devices-800.webp";
import maaxDevices1200 from "@/assets/cyryx-maax-devices-1200.webp";

const PATH = "/products/maax-studio";
const TITLE = "MAAX Studio — Agentic Software Execution Environment";
const DESC =
  "MAAX Studio is an agentic software execution environment in active development, intended to coordinate software missions, agents, project context, review, and controlled execution.";

const LAYERS = [
  [
    "Mission context",
    "Organize the goal, project context, constraints, and completion criteria around a defined unit of work.",
  ],
  [
    "Agent coordination",
    "Coordinate specialized execution roles and tool use within the mission boundary.",
  ],
  [
    "Review and gates",
    "Introduce human or automated checkpoints where the selected workflow and infrastructure support them.",
  ],
  [
    "Operating record",
    "Preserve useful execution context and decisions for review, debugging, and continuation.",
  ],
] as const;

const USERS = [
  ["AI-native builders", "Teams coordinating multiple agents and tools across real software work."],
  [
    "Technical leads",
    "Operators who need visibility into mission state, review, and project context.",
  ],
  [
    "Product and engineering teams",
    "Groups exploring a more structured way to use agentic software development.",
  ],
] as const;

const LIMITATIONS = [
  "MAAX Studio remains in active development and access is evaluated directly with Cyryx Labs.",
  "Capabilities, integrations, deployment options, and access may change as the product evolves.",
  "Autonomy does not remove human responsibility; authority and review must be designed for the actual environment.",
  "Public screenshots demonstrate current product direction and are not a warranty of final features.",
] as const;

export const Route = createFileRoute("/products/maax-studio")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "product" }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "MAAX Studio", path: PATH },
      ]),
    ]),
  component: MaaxStudioPage,
});

function MaaxStudioPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <section className="border-b border-white/10 px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <nav
              aria-label="Breadcrumb"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--steel)]"
            >
              <Link to="/" className="transition hover:text-[var(--silver)]">
                Home
              </Link>
              <span className="mx-3 opacity-40">/</span>
              <Link to="/products" className="transition hover:text-[var(--silver)]">
                Products
              </Link>
              <span className="mx-3 opacity-40">/</span>
              <span className="text-[var(--silver)]">MAAX Studio</span>
            </nav>
            <div className="mt-14 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-24">
              <div>
                <HudLabel withDot>Flagship product / In active development</HudLabel>
                <h1 className="mt-7 font-display text-6xl font-semibold leading-[0.94] tracking-[-0.055em] text-[var(--silver)] sm:text-7xl lg:text-9xl">
                  MAAX Studio
                </h1>
                <p className="mt-6 max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[var(--accent-glow)]">
                  Agentic software execution environment
                </p>
              </div>
              <div className="lg:pb-2">
                <p className="max-w-2xl text-lg leading-relaxed text-[var(--silver-dim)] sm:text-xl">
                  A command environment intended to coordinate software missions, agents, project
                  context, review, and controlled execution — so agentic work can become more
                  structured than a sequence of disconnected prompts.
                </p>
                <a
                  href="#access"
                  className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md border border-[var(--accent-glow)] px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-glow)] transition hover:bg-[var(--accent-glow)] hover:text-[var(--onyx)]"
                >
                  Discuss early access <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <figure className="overflow-hidden rounded-lg border border-white/10 bg-[var(--obsidian)]">
            <picture>
              <source
                type="image/webp"
                srcSet={`${maaxDevices480} 480w, ${maaxDevices800} 800w, ${maaxDevices1200} 1200w`}
                sizes="(min-width: 1280px) 1180px, 92vw"
              />
              <img
                src={maaxDevices}
                alt="MAAX Studio product direction shown on desktop and laptop interfaces"
                width={1200}
                height={896}
                className="block h-auto w-full"
                loading="eager"
                decoding="async"
              />
            </picture>
            <figcaption className="border-t border-white/10 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--steel)]">
              Current product preview / interface and features remain subject to change
            </figcaption>
          </figure>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.68fr_1.32fr] lg:gap-24 lg:px-10 lg:py-40">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <HudLabel>Current architecture direction</HudLabel>
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
              Ground the mission. Coordinate the work. Preserve the context.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--silver-dim)]">
              The architecture is evolving around a small set of durable product concepts rather
              than claims of unrestricted autonomy.
            </p>
          </div>
          <ol className="border-t border-white/10">
            {LAYERS.map(([title, body], index) => (
              <li
                key={title}
                className="grid gap-5 border-b border-white/10 py-8 sm:grid-cols-[3rem_1fr] sm:py-10"
              >
                <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-[-0.025em] text-[var(--silver)] sm:text-3xl">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-[var(--graphite)] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-7xl">
            <HudLabel withDot>Intended users</HudLabel>
            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:grid-cols-3">
              {USERS.map(([title, body]) => (
                <article key={title} className="min-h-72 bg-[var(--obsidian)] p-8">
                  <h2 className="font-display text-2xl font-medium tracking-[-0.025em] text-[var(--silver)]">
                    {title}
                  </h2>
                  <p className="mt-5 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:gap-24 lg:px-10 lg:py-40">
          <div>
            <HudLabel>Current focus</HudLabel>
            <h2 className="mt-6 font-display text-4xl font-medium tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
              Building a coherent environment for governed software missions.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--silver-dim)]">
              Product work currently concentrates on mission definition, context, agent
              coordination, review, continuation, and an operator experience that keeps humans in
              command.
            </p>
          </div>
          <div>
            <HudLabel>Limitations and qualifications</HudLabel>
            <ul className="mt-8 border-t border-white/10">
              {LIMITATIONS.map((item) => (
                <li
                  key={item}
                  className="border-b border-white/10 py-5 text-[15px] leading-relaxed text-[var(--silver-dim)]"
                >
                  <span aria-hidden className="mr-3 text-[var(--accent-glow)]">
                    /
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="access"
          className="border-t border-white/10 bg-[var(--obsidian)] px-5 py-24 text-center sm:px-8 sm:py-32"
        >
          <div className="mx-auto max-w-4xl">
            <HudLabel withDot>Access model</HudLabel>
            <h2 className="mt-7 font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--silver)] sm:text-6xl">
              Access is evaluated through a direct conversation with Cyryx Labs.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)]">
              We do not publish general availability, pricing, or deployment commitments while the
              product remains in active development. Fit depends on the use case, team, and current
              product focus.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={START_PROJECT_HREF}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--silver)] px-7 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--onyx)] transition hover:bg-white"
              >
                Discuss MAAX Studio <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                to="/research"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/15 px-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
              >
                Related research
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
