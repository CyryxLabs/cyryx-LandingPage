import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/cyryx/StubPage";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Custom AI Systems · Cyryx Labs" },
      { name: "description", content: "Custom AI systems, agentic workflows, internal copilots, integrations, and governance layers for businesses ready to operationalize AI." },
      { property: "og:title", content: "Solutions — Cyryx Labs" },
      { property: "og:description", content: "Custom AI systems built for execution, not hype." },
      { property: "og:url", content: "/solutions" },
    ],
    links: [{ rel: "canonical", href: "/solutions" }],
  }),
  component: () => (
    <StubPage
      eyebrow="Cyryx Solutions"
      title="AI systems built for execution, not hype."
      description="We design, build, and deploy AI products, agentic workflows, internal copilots, knowledge systems, integrations, and governance layers that connect to real workflows, real data, and real operational outcomes. Dedicated solutions site coming soon."
      status="Engagements Open"
    />
  ),
});