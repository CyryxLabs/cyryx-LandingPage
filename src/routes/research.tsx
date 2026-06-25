import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/cyryx/StubPage";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Applied AI Lab — Cyryx Labs" },
      { name: "description", content: "Cyryx Applied AI Lab develops the protocols, architectures, evaluation models, and execution systems behind our products and client solutions." },
      { property: "og:title", content: "Applied AI Lab — Cyryx Labs" },
      { property: "og:description", content: "Applied R&D for governed AI execution." },
      { property: "og:url", content: "/research" },
    ],
    links: [{ rel: "canonical", href: "/research" }],
  }),
  component: () => (
    <StubPage
      eyebrow="Cyryx Applied AI Lab"
      title="Applied R&D for governed AI execution."
      description="We design the protocols, agent architectures, context systems, evaluation models, and governance layers behind Cyryx Labs products and client solutions. Research publication site coming soon."
      status="Research In Progress"
    />
  ),
});