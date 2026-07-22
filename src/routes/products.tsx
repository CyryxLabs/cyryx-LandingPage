import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";

const PATH = "/products";
const TITLE = "Products — Cyryx Labs";
const DESC =
  "Cyryx Labs develops MAAX Studio, an agentic software execution environment, and Lyra, a private model-agnostic intelligence and execution runtime.";

const PRODUCTS = [
  {
    n: "01",
    name: "MAAX Studio",
    maturity: "In active development",
    identity: "Agentic software execution environment",
    description:
      "A command environment intended to coordinate software missions, agents, project context, review, and controlled execution.",
    focus: ["Mission-based work", "Project context", "Review and execution controls"],
    href: "/products/maax-studio",
    cta: "Explore MAAX Studio",
  },
  {
    n: "02",
    name: "Lyra",
    maturity: "Private development",
    identity: "Private, model-agnostic intelligence and execution runtime",
    description:
      "A private runtime direction for coordinating models, tools, context, and execution boundaries without depending on one model provider.",
    focus: [
      "Model-agnostic orchestration",
      "Private execution",
      "Controlled tool and context access",
    ],
    href: "/products/lyra",
    cta: "Understand Lyra",
  },
] as const;

export const Route = createFileRoute("/products")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: PATH },
      ]),
    ]),
  component: ProductsPage,
});

function ProductsPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/products" && pathname !== "/products/") return <Outlet />;

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <section className="border-b border-white/10 px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <HudLabel withDot>Cyryx Labs / Product infrastructure</HudLabel>
            <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-24">
              <h1 className="max-w-[11ch] font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[var(--silver)] sm:text-6xl lg:text-8xl">
                We build the command layer we want to use.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[var(--silver-dim)] sm:text-xl lg:pb-2">
                Cyryx product work concentrates on controlled execution: how people, agents, models,
                tools, project context, and review can operate as one system. Both public product
                directions remain under development.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:grid-cols-2">
            {PRODUCTS.map((product) => (
              <article
                key={product.name}
                className="flex min-h-[38rem] flex-col bg-[var(--obsidian)] p-8 sm:p-12"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--accent-glow)]">
                    {product.n}
                  </span>
                  <span className="rounded-sm border border-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--steel)]">
                    {product.maturity}
                  </span>
                </div>
                <h2 className="mt-16 font-display text-4xl font-semibold tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
                  {product.name}
                </h2>
                <p className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-[var(--accent-glow)]">
                  {product.identity}
                </p>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--silver-dim)]">
                  {product.description}
                </p>
                <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-[var(--silver-dim)]">
                  {product.focus.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden className="text-[var(--accent-glow)]">
                        /
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={product.href}
                  className="mt-auto inline-flex min-h-12 items-center gap-2 pt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
                >
                  {product.cta} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--graphite)] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <HudLabel>Product and delivery</HudLabel>
            <div>
              <h2 className="font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                Product research informs delivery. Client scope remains independent.
              </h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                Cyryx may apply product concepts or internal tooling where appropriate, but each
                client system is defined by its own architecture, licensing, ownership, security,
                support, and acceptance requirements.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/solutions"
                  className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
                >
                  Explore solutions <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <a
                  href={START_PROJECT_HREF}
                  className="inline-flex min-h-11 items-center px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--steel)] transition hover:text-[var(--accent-glow)]"
                >
                  Start a project
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
