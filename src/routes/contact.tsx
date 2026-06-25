import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/cyryx/StubPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Cyryx Labs" },
      { name: "description", content: "Start a project with Cyryx Labs. Build AI products, automate workflows, and operationalize execution." },
      { property: "og:title", content: "Contact — Cyryx Labs" },
      { property: "og:description", content: "Start a project with Cyryx Labs." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: () => (
    <StubPage
      eyebrow="Start a Project"
      title="Let's build your AI system."
      description="Use the inquiry form on the homepage to share your project scope, timeline, and outcome. A dedicated contact experience is coming soon — for now we read every inquiry submitted from the Cyryx Labs homepage."
      status="Inquiries Open"
    />
  ),
});