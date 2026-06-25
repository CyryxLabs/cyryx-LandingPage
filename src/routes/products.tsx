import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/cyryx/StubPage";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Cyryx Labs" },
      { name: "description", content: "Proprietary AI products built by Cyryx Labs for the agentic era." },
      { property: "og:title", content: "Products — Cyryx Labs" },
      { property: "og:description", content: "Proprietary AI products for the agentic era." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: () => (
    <StubPage
      eyebrow="Cyryx Labs · Products"
      title="Proprietary AI products for the agentic era."
      description="MAAX Studio and the Cyryx Applied AI Lab — proprietary execution systems developed inside Cyryx Labs for teams operationalizing AI."
      status="Catalog Expanding"
    />
  ),
});