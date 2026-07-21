import { createFileRoute } from "@tanstack/react-router";
import { SolutionsHubPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Advisory, Engineering & Operations · Cyryx Labs" },
      {
        name: "description",
        content:
          "AI advisory, digital systems, workflow automation, internal assistants, custom AI products, governance, and managed operations from Cyryx Labs.",
      },
      { property: "og:title", content: "Solutions — Cyryx Labs" },
      {
        property: "og:description",
        content: "From strategic direction to operated digital and AI systems.",
      },
      { property: "og:url", content: "https://cyryxlabs.com/solutions" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/solutions" }],
  }),
  component: SolutionsHubPage,
});
