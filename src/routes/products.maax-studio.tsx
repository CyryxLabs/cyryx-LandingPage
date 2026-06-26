import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/cyryx/StubPage";

export const Route = createFileRoute("/products/maax-studio")({
  head: () => ({
    meta: [
      { title: "MAAX Studio — Agentic Execution OS · Cyryx Labs" },
      { name: "description", content: "MAAX Studio is the agentic execution OS for AI-native builders: mission control, project memory, context graphs, and human-governed delivery." },
      { property: "og:title", content: "MAAX Studio — Agentic Execution OS" },
      { property: "og:description", content: "The agentic execution OS for AI-native builders." },
      { property: "og:url", content: "/products/maax-studio" },
    ],
    links: [{ rel: "canonical", href: "/products/maax-studio" }],
  }),
  component: () => (
    <StubPage
      eyebrow="Flagship Product"
      title="MAAX Studio"
      description="The agentic execution OS for AI-native builders. A local-first command environment for operating AI software squads with mission-based execution, project memory, context grounding, command units, quality gates, mission ledgers, and human-governed delivery. Full product site coming soon."
      status="Early Access Coming Soon"
    />
  ),
});