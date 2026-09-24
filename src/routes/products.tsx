import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import { trackCta } from "@/lib/track-cta";

const PATH = "/products";
const TITLE = "Products — Cyryx Labs";
const DESC =
  "Cyryx Labs builds AEXOS, a CLI-first system for governed, AI-assisted software delivery. The Core edition is available on npm.";

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
          title="Software we build and run ourselves."
          body="Our products come from the same work we do for clients: putting AI agents to work under clear rules, with evidence of what they did. Each product states its real stage."
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
            body: "AEXOS Core is published on npm. Pro capabilities are in beta.",
          }}
        />

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <article
            id="aexos"
            className="cx-material-panel mx-auto flex max-w-4xl flex-col rounded-lg border p-7 sm:p-12"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-glow)]">
                {product.fullName}
              </span>
              <span className="rounded-sm border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--silver)]">
                {product.maturity}
              </span>
            </div>
            <h2 className="mt-10 font-display text-4xl font-semibold tracking-[-0.04em] text-[var(--silver)] sm:text-6xl">
              {product.name}
            </h2>
            <p className="mt-3 font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-[var(--steel)]">
              {product.identity}
            </p>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              {product.description}
            </p>
            <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-[var(--silver-dim)] sm:text-base">
              {product.focus.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="text-[var(--accent-glow)]">
                    /
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
          </article>
        </section>

        <section className="border-y border-white/10 bg-[var(--graphite)] px-5 py-16 sm:px-8 sm:py-20">
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
