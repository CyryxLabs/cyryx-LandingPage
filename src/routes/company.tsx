import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/cyryx/StubPage";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title: "Company — Cyryx Labs" },
      { name: "description", content: "Cyryx Labs is an AI product and solutions company building the systems that turn AI from scattered experimentation into governed execution." },
      { property: "og:title", content: "Company — Cyryx Labs" },
      { property: "og:description", content: "An AI product and solutions company for the agentic era." },
      { property: "og:url", content: "/company" },
    ],
    links: [{ rel: "canonical", href: "/company" }],
  }),
  component: () => (
    <StubPage
      eyebrow="About Cyryx Labs"
      title="Builders of governed AI execution."
      description="Cyryx Labs combines product architecture, applied AI research, automation engineering, and execution governance. We build proprietary AI products and partner with founders, agencies, and businesses to operationalize AI inside real workflows."
      status="Company Page Coming Soon"
    />
  ),
});