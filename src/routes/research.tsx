import { createFileRoute } from "@tanstack/react-router";
import { ResearchPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Applied Research — Reliable AI Execution · Cyryx Labs" },
      {
        name: "description",
        content:
          "Cyryx applied research explores authority, reliability, recovery, evaluation, and cost discipline in AI execution systems.",
      },
      { property: "og:title", content: "Applied Research — Cyryx Labs" },
      { property: "og:description", content: "Research for reliable, controlled AI execution." },
      { property: "og:url", content: "https://cyryxlabs.com/research" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/research" }],
  }),
  component: ResearchPage,
});
