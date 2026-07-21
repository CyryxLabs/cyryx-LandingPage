import { createFileRoute } from "@tanstack/react-router";
import { HowWeWorkPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/how-we-work")({
  head: () => ({
    meta: [
      { title: "How We Work — Cyryx Labs" },
      {
        name: "description",
        content:
          "The Cyryx engagement lifecycle from discovery through optional managed operations.",
      },
      { property: "og:url", content: "https://cyryxlabs.com/how-we-work" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/how-we-work" }],
  }),
  component: HowWeWorkPage,
});
