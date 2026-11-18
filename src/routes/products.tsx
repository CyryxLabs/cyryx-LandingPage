import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { FinalCta, PageHero, SectionHead } from "@/components/site/ui";
import { buildBreadcrumbJsonLd, buildHead, buildWebPageJsonLd } from "@/components/cyryx/seo/seo";
import { PRODUCTS } from "@/data/products";
import { AexosShowcase, OnyxShowcase, OrbitCard } from "@/components/site/ProductShowcase";
import { absoluteSiteUrl } from "@/lib/site-url";

const PATH = "/products";
const TITLE = "AI Products by Cyryx Labs: Onyx, AEXOS and Orbit";
const DESC =
  "Cyryx Labs products: Onyx, an AI coworker for Windows in free beta; AEXOS, an agent framework with Core free on npm; and Orbit, in development.";

export const Route = createFileRoute("/products")({
  head: ({ matches }) => {
    const leafPath = matches.at(-1)?.pathname.replace(/\/$/, "") || "/";
    if (leafPath !== PATH) return {};
    return buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: PATH },
      ]),
      buildWebPageJsonLd({ name: TITLE, description: DESC, path: PATH }),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Cyryx Labs products",
        itemListElement: PRODUCTS.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          // Orbit is in development: listed by name only, with no page or link.
          ...(product.published ? { url: absoluteSiteUrl(product.path) } : {}),
        })),
      },
    ]);
  },
  component: ProductsHub,
});

function ProductsHub() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/products" && pathname !== "/products/") return <Outlet />;

  return (
    <SiteShell source="products">
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Products" }]}
        eyebrow="Products"
        title="AI products we design, run and answer for."
        lead="Cyryx Labs builds its own AI products alongside client work. Each one is shown at its real stage: Onyx is a free beta for Windows, AEXOS Core is free on npm, and Orbit is in development."
      />

      <section className="cy-section cy-prod" aria-label="Products">
        <div className="cy-container">
          <OnyxShowcase as="h2" />
          <AexosShowcase as="h2" />
          <OrbitCard as="h2" />
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="products-services-heading">
        <div className="cy-container">
          <SectionHead
            id="products-services-heading"
            eyebrow="Products and services"
            title="Need something built for your company instead?"
            lead="Products are ours. Services are scoped to your business in a written scope you approve before work starts. Ownership and licensing are defined in each agreement."
            split
          >
            <p>
              <Link to="/solutions" className="cy-link">
                See the ten AI services <span aria-hidden="true">→</span>
              </Link>
            </p>
          </SectionHead>
        </div>
      </section>

      <FinalCta source="products" />
    </SiteShell>
  );
}
