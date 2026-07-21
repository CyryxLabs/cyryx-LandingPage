import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/products_/lyra")({
  head: () => ({
    meta: [
      { title: "Lyra — Private Model-Agnostic Runtime · Cyryx Labs" },
      {
        name: "description",
        content:
          "Lyra is a private, model-agnostic intelligence and execution runtime in private development at Cyryx Labs.",
      },
      { property: "og:url", content: "https://cyryxlabs.com/products/lyra" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/products/lyra" }],
  }),
  component: () => <ProductPage product="lyra" />,
});
