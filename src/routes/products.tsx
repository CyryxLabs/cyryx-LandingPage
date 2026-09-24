import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import { trackCta } from "@/lib/track-cta";
import { AexosInstallPreview } from "@/components/cyryx/aexos/AexosInstallPreview";

const PRINCIPLES = [
  {
    title: "Built from real work",
    body: "Each product starts from a problem we met delivering AI systems, and is used in our own work before it is published.",
  },
  {
    title: "States its real stage",
    body: "Research, beta or available: the label on the page is the stage the product is actually in. Roadmap items are never shown as features.",
  },
  {
    title: "Clear license and ownership",
    body: "Every product says what you may do with it, what it costs and what you own. No surprises after installation.",
  },
] as const;

const STAGES = [
  { label: "Research", body: "Explored in the Applied AI Lab.", current: false },
  { label: "Beta", body: "Used with selected teams under agreement.", current: false },
  { label: "Available", body: "Published and supported. AEXOS Core is here.", current: true },
] as const;

const PATH = "/products";
const TITLE = "Products — Cyryx Labs";
const DESC =
  "Cyryx Labs builds AEXOS, a CLI-first framework that puts AI agents to work under procedures and quality gates. The Core edition is on npm.";

export const Route = createFileRoute("/products")({
  head: ({ matches }) => {
    const leafPath = matches.at(-1)?.pathname.replace(/\/$/, "") || "/";
    if (leafPath !== PATH) return {};
    return buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: PATH },
      ]),
    ]);
  },
  component: ProductsPage,
});

function ProductsPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/products" && pathname !== "/products/") return <Outlet />;

  const product = AEXOS_PRODUCT;

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <InternalHero
          eyebrow="Cyryx Labs / Products"
          title="Software we build and publish ourselves."
          body="Our products come from the same work we do for clients: putting AI agents to work under clear rules, with evidence of what they did. Each product states its real stage and its license."
          primaryCta={{
            label: "Explore AEXOS",
            to: "/products/aexos",
            onClick: () =>
              trackCta({ cta: "view_product", section: "hero", href: "/products/aexos" }),
          }}
          secondaryCta={{
            label: "Explore solutions",
            to: "/solutions",
            onClick: () => trackCta({ cta: "see_delivery", section: "hero", href: "/solutions" }),
          }}
          boundaryNote="Products and client work are separate. Client systems are defined by their own scope."
          lifecycleLabel="Product stages"
          lifecycle={[
            { number: "01", label: "Research" },
            { number: "02", label: "Beta" },
            { number: "03", label: "Available", active: true },
          ]}
          nextChapter={{
            title: "One product available today.",
            body: "AEXOS Core is published on npm and free to use under the AEXOS license.",
          }}
        />

        <section
          aria-labelledby="aexos-card-heading"
          className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div aria-hidden className="cx-aurora" />
          <article
            id="aexos"
            className="cx-spotlight relative mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-2xl border border-white/10 bg-[color-mix(in_oklab,var(--obsidian)_92%,transparent)] p-6 sm:p-10 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:p-14"
          >
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-glow)]">
                  {product.fullName}
                </span>
              </div>
              <h2
                id="aexos-card-heading"
                className="mt-6 font-display text-5xl font-semibold tracking-[-0.05em] text-chrome-gradient sm:text-7xl"
              >
                {product.name}
              </h2>
              <p className="mt-3 font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-[var(--steel)]">
                {product.identity}
              </p>
              <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--silver)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)]" />
                {product.maturity}
              </span>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
                {product.description}
              </p>
              <ul className="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm text-[var(--silver-dim)] sm:text-base">
                {product.focus.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="text-[var(--accent-glow)]">
                      /
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products/aexos"
                  className="cx-btn-primary"
                  onClick={() =>
                    trackCta({ cta: "view_product", section: "solutions", href: "/products/aexos" })
                  }
                >
                  Explore AEXOS <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <a
                  href={product.npmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cx-btn-secondary"
                  onClick={() =>
                    trackCta({ cta: "view_product", section: "solutions", href: product.npmUrl })
                  }
                >
                  View on npm <ArrowRight className="h-4 w-4" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <AexosInstallPreview />
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
                Preview · contents of the Core package
              </p>
            </div>
          </article>
        </section>

        <section
          aria-labelledby="product-principles"
          className="border-y border-white/10 bg-[var(--graphite)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-20">
              <div>
                <HudLabel withDot>How we build products</HudLabel>
                <h2
                  id="product-principles"
                  className="mt-6 max-w-[16ch] font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-silver-gradient sm:text-5xl"
                >
                  Three rules for anything we publish.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
                A product page is a promise. These rules keep ours accurate.
              </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {PRINCIPLES.map((item, index) => (
                <article
                  key={item.title}
                  className="cx-spotlight rounded-xl border border-white/10 bg-[var(--onyx)] p-6 sm:p-8"
                >
                  <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--silver)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-14">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--steel)]">
                Where each product stands
              </p>
              <ol className="relative mt-6 grid grid-cols-3 gap-4">
                <span
                  aria-hidden
                  className="cx-sweep-line absolute left-0 right-0 top-[0.55rem] h-px bg-white/15"
                />
                {STAGES.map((stage) => (
                  <li key={stage.label} className="relative">
                    <span
                      aria-hidden
                      className={`relative z-10 block h-[1.1rem] w-[1.1rem] rounded-full border ${
                        stage.current
                          ? "border-[var(--accent-glow)] bg-[var(--accent-glow)] shadow-[0_0_14px_var(--accent-glow)]"
                          : "border-white/30 bg-[var(--graphite)]"
                      }`}
                    />
                    <p className="mt-4 font-display text-lg font-semibold text-[var(--silver)]">
                      {stage.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--silver-dim)]">
                      {stage.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <HudLabel>Products and client work</HudLabel>
            <div>
              <h2 className="font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                What we learn building products shapes how we deliver for clients.
              </h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                Client systems are still defined by their own architecture, licensing, ownership,
                security, support and acceptance requirements. Using a Cyryx product in a client
                engagement is always a separate, explicit decision.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/solutions"
                  className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
                >
                  Explore solutions <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <Link
                  to="/engagement-model"
                  className="inline-flex min-h-11 items-center px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)] transition hover:text-[var(--accent-glow)]"
                >
                  How we work
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
