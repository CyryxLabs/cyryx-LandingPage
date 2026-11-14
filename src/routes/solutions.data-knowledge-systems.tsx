import { createFileRoute } from "@tanstack/react-router";
import { serviceRoute } from "@/components/site/ServicePage";

export const Route = createFileRoute("/solutions/data-knowledge-systems")(
  serviceRoute("data-knowledge-systems"),
);
