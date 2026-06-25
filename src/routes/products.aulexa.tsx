import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/cyryx/StubPage";

export const Route = createFileRoute("/products/aulexa")({
  head: () => ({
    meta: [
      { title: "Aulexa — AI Education Product · Cyryx Labs" },
      { name: "description", content: "Aulexa is an AI-powered education platform helping educators create, structure, and accelerate instructional materials and classroom workflows." },
      { property: "og:title", content: "Aulexa — AI Education Product" },
      { property: "og:description", content: "An AI-powered education platform from Cyryx Labs." },
      { property: "og:url", content: "/products/aulexa" },
    ],
    links: [{ rel: "canonical", href: "/products/aulexa" }],
  }),
  component: () => (
    <StubPage
      eyebrow="AI Education Product"
      title="Aulexa"
      description="An AI-powered education platform designed to help educators create, structure, and accelerate instructional materials, lesson planning, and classroom workflows."
      status="In Development"
    />
  ),
});