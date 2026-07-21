import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title: "Company — Cyryx Labs" },
      {
        name: "description",
        content:
          "Cyryx Labs is an AI lab and systems company that advises, builds, and operates digital and AI systems.",
      },
      { property: "og:title", content: "Company — Cyryx Labs" },
      {
        property: "og:description",
        content: "An AI lab and systems company for controlled execution.",
      },
      { property: "og:url", content: "https://cyryxlabs.com/company" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/company" }],
  }),
  component: CompanyPage,
});
