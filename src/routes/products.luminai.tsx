import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/cyryx/StubPage";

export const Route = createFileRoute("/products/luminai")({
  head: () => ({
    meta: [
      { title: "LuminAI — Cyryx Labs" },
      { name: "description", content: "LuminAI is an AI-native product in active development under the Cyryx Labs ecosystem." },
      { property: "og:title", content: "LuminAI — Cyryx Labs" },
      { property: "og:description", content: "An AI-native product in development under Cyryx Labs." },
      { property: "og:url", content: "/products/luminai" },
    ],
    links: [{ rel: "canonical", href: "/products/luminai" }],
  }),
  component: () => (
    <StubPage
      eyebrow="AI Product"
      title="LuminAI"
      description="An AI-native product in active development under the Cyryx Labs ecosystem. Designed for governed, context-aware execution. More details coming soon."
      status="In Development"
    />
  ),
});