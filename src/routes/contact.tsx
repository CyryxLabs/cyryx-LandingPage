import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Cyryx Labs" },
      {
        name: "description",
        content:
          "Contact Cyryx Labs for company, product, research, privacy, talent, or project inquiries.",
      },
      { property: "og:title", content: "Contact — Cyryx Labs" },
      { property: "og:description", content: "Start a project with Cyryx Labs." },
      { property: "og:url", content: "https://cyryxlabs.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/contact" }],
  }),
  component: ContactPage,
});
