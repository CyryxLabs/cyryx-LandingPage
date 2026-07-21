import { createFileRoute } from "@tanstack/react-router";
import { StartPage } from "@/components/cyryx/enterprise/EnterprisePages";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start a Project — Cyryx Labs" },
      {
        name: "description",
        content:
          "Start an advisory, digital systems, automation, internal assistant, custom AI product, governance, or managed operations conversation with Cyryx Labs.",
      },
      { property: "og:url", content: "https://cyryxlabs.com/start" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/start" }],
  }),
  component: StartPage,
});
