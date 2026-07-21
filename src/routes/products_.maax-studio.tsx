import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/products_/maax-studio")({
  head: () => ({
    meta: [
      { title: "MAAX Studio — Agentic Software Execution Environment · Cyryx Labs" },
      {
        name: "description",
        content:
          "MAAX Studio is an agentic software execution environment in active development at Cyryx Labs.",
      },
      { property: "og:title", content: "MAAX Studio — Cyryx Labs" },
      {
        property: "og:description",
        content: "Agentic software execution environment in active development.",
      },
      { property: "og:url", content: "https://cyryxlabs.com/products/maax-studio" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/products/maax-studio" }],
  }),
  component: () => <ProductPage product="maax" />,
});
