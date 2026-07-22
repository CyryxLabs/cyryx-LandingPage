import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";

const PATH = "/products/lyra";
const TITLE = "Lyra — Private Model-Agnostic Intelligence Runtime";
const DESC =
  "Lyra is a private, model-agnostic intelligence and execution runtime in private development at Cyryx Labs.";

const SYSTEM_LAYERS = [
  [
    "Context boundary",
    "Assemble permitted project or mission context without treating every source as globally available.",
  ],
  [
    "Model interface",
    "Keep execution architecture separable from any one model provider or model family.",
  ],
  [
    "Tool boundary",
    "Control which tools and actions are available to the runtime for a defined task.",
  ],
  [
    "Execution state",
    "Maintain useful state for continuation, review, and recovery across longer-running work.",
  ],
] as const;

const CURRENT_FOCUS = [
  "Private and local execution patterns",
  "Model-agnostic orchestration",
  "Context and tool boundaries",
  "Stateful execution and recovery",
  "Integration with Cyryx product and system research",
] as const;

const LIMITATIONS = [
  "Lyra is in private development and is not generally available.",
  "Lyra is not represented as a proprietary foundation model or a public assistant competitor.",
  "Public product claims are limited to the current development focus and access model described on this page.",
  "Architecture, access, model support, deployment, and product relationship may change during development.",
] as const;

export const Route = createFileRoute("/products/lyra")({
  head: () =>
    buildHead(
      {
        title: TITLE,
        description: DESC,
        path: PATH,
        ogType: "product",
        image: "https://cyryxlabs.com/lyra-og-1200x630.jpg",
      },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: "Lyra", path: PATH },
        ]),
      ],
    ),
  component: LyraPage,
});

function LyraPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/10 px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-44">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_35%,color-mix(in_oklab,var(--accent-glow)_10%,transparent),transparent_34%)]" />
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
              <span className="text-[var(--silver)]">Lyra</span>
            </nav>
            <div className="mt-14 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24">
              <div>
                <HudLabel withDot>Private development</HudLabel>
                <h1 className="mt-7 font-display text-7xl font-semibold leading-[0.9] tracking-[-0.06em] text-[var(--silver)] sm:text-8xl lg:text-[9rem]">
                  LYRA
                </h1>
                <p className="mt-6 max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[var(--accent-glow)]">
                  Private, model-agnostic intelligence and execution runtime
                </p>
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--silver-dim)]">
                  A private runtime direction for coordinating models, tools, context, and execution
                  boundaries without binding the system to one provider.
                </p>
              </div>

              <div
                className="relative mx-auto aspect-square w-full max-w-xl rounded-full border border-white/10 bg-[var(--obsidian)]"
                role="img"
                aria-label="Conceptual Lyra runtime architecture"
              >
                <div
                  aria-hidden
                  className="absolute inset-[11%] rounded-full border border-white/10"
                />
                <div
                  aria-hidden
                  className="absolute inset-[25%] rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_28%,transparent)]"
                />
                <div className="absolute inset-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--accent-glow)] bg-[var(--graphite)] shadow-[0_0_70px_color-mix(in_oklab,var(--accent-glow)_20%,transparent)]">
                  <span className="font-display text-3xl tracking-[0.08em]">LYRA</span>
                </div>
                {[
                  ["Models", "left-[5%] top-1/2 -translate-y-1/2"],
                  ["Tools", "right-[8%] top-1/2 -translate-y-1/2"],
                  ["Context", "left-1/2 top-[8%] -translate-x-1/2"],
                  ["State", "bottom-[8%] left-1/2 -translate-x-1/2"],
                ].map(([label, position]) => (
                  <span
                    key={label}
                    className={`absolute ${position} rounded-sm border border-white/10 bg-black/60 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--steel)]`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:px-10 lg:py-40">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <HudLabel>Architecture direction</HudLabel>
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
              Intelligence is one layer. Execution requires boundaries around it.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--silver-dim)]">
              Lyra research focuses on the runtime around models: what context they receive, which
              tools they may use, how state continues, and where execution must stop or return to a
              human operator.
            </p>
          </div>
          <ol className="border-t border-white/10">
            {SYSTEM_LAYERS.map(([title, body], index) => (
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
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-24">
            <div>
              <HudLabel withDot>Current focus</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-medium tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
                A private research and development track.
              </h2>
              <ul className="mt-9 border-t border-white/10">
                {CURRENT_FOCUS.map((item) => (
                  <li
                    key={item}
                    className="border-b border-white/10 py-5 text-[15px] text-[var(--silver-dim)]"
                  >
                    <span aria-hidden className="mr-3 text-[var(--accent-glow)]">
                      /
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <HudLabel>Limitations</HudLabel>
              <ul className="mt-9 border-t border-white/10">
                {LIMITATIONS.map((item) => (
                  <li
                    key={item}
                    className="border-b border-white/10 py-5 text-[15px] leading-relaxed text-[var(--silver-dim)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-10 lg:py-40">
          <div>
            <HudLabel>Relationship to MAAX Studio</HudLabel>
            <h2 className="mt-6 font-display text-4xl font-medium tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
              Related product research. Different product function.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-[var(--silver-dim)]">
              MAAX Studio is the agentic software execution environment presented to builders. Lyra
              is the private runtime direction concerned with intelligence, tools, context, and
              execution beneath or beside product experiences. Their eventual relationship remains
              under development.
            </p>
            <Link
              to="/products/maax-studio"
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
            >
              Explore MAAX Studio <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[var(--obsidian)] px-5 py-24 text-center sm:px-8 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <HudLabel withDot>Access model</HudLabel>
            <h2 className="mt-7 font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--silver)] sm:text-6xl">
              Lyra is not open for general access.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)]">
              Cyryx may discuss relevant private research or system needs directly. No public
              availability, pricing, deployment, or capability commitment is offered at this stage.
            </p>
            <a
              href={START_PROJECT_HREF}
              className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-md border border-[var(--accent-glow)] px-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-glow)] transition hover:bg-[var(--accent-glow)] hover:text-[var(--onyx)]"
            >
              Discuss a relevant system <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
