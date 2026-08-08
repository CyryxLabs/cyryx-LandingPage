import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { MAAX_STUDIO_PRODUCT } from "@/data/site-taxonomy";
import { trackCta } from "@/lib/track-cta";

const PATH = "/products";
const TITLE = "Products — Cyryx Labs";
const DESC =
  "Cyryx Labs develops MAAX Studio, an agentic software execution environment for governed software missions.";

const PRODUCTS = [
  {
    n: "01",
    ...MAAX_STUDIO_PRODUCT,
    focus: ["Mission-based work", "Project context", "Review and execution controls"],
    href: "/products/maax-studio",
    cta: "Explore MAAX Studio",
  },
] as const;

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

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <InternalHero
          eyebrow="Cyryx Labs / Product"
          title="MAAX Studio, in active development."
          body="MAAX Studio is Cyryx Labs' active product program for coordinating software missions, agents, project context, review, and controlled execution."
          primaryCta={{
            label: "Explore MAAX Studio",
            to: "/products/maax-studio",
            onClick: () =>
              trackCta({ cta: "explore_maax", section: "hero", href: "/products/maax-studio" }),
          }}
          secondaryCta={{
            label: "Explore solutions",
            to: "/solutions",
            onClick: () => trackCta({ cta: "see_delivery", section: "hero", href: "/solutions" }),
          }}
          boundaryNote="Product research informs delivery. Client scope remains independent."
          lifecycleLabel="Product path"
          lifecycle={[
            { number: "01", label: "Program" },
            { number: "02", label: "Authority" },
            { number: "03", label: "Evidence" },
            { number: "04", label: "Release" },
          ]}
          nextChapter={{
            title: "One active product program.",
            body: "MAAX Studio is where Cyryx explores governed software missions, project context, and controlled execution.",
          }}
        />

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-white/10">
            {PRODUCTS.map((product) => (
              <article
                key={product.name}
                className="cx-material-panel flex min-h-[38rem] flex-col border p-8 sm:p-12"
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
                <Link
                  to="/engagement-model"
                  className="inline-flex min-h-11 items-center px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--steel)] transition hover:text-[var(--accent-glow)]"
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
