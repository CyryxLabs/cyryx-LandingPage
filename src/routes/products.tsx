import { createFileRoute } from "@tanstack/react-router";
import { ProductsHubPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Cyryx Labs" },
      {
        name: "description",
        content:
          "MAAX Studio and Lyra: two Cyryx products addressing different layers of controlled AI execution.",
      },
      { property: "og:title", content: "Products — Cyryx Labs" },
      {
        property: "og:description",
        content: "MAAX Studio and Lyra, with transparent product maturity.",
      },
      { property: "og:url", content: "https://cyryxlabs.com/products" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/products" }],
  }),
  component: ProductsHubPage,
});
