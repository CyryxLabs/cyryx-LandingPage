import { createFileRoute } from "@tanstack/react-router";
import { CareersPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers & Talent Network — Cyryx Labs" },
      {
        name: "description",
        content:
          "Join the Cyryx Labs talent network for future design, engineering, research, and operations collaboration.",
      },
      { property: "og:url", content: "https://cyryxlabs.com/careers" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/careers" }],
  }),
  component: CareersPage,
});
