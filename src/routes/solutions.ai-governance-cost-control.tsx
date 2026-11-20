import { createFileRoute } from "@tanstack/react-router";
import { serviceRoute } from "@/components/site/ServicePage";

export const Route = createFileRoute("/solutions/ai-governance-cost-control")(
  serviceRoute("ai-governance-cost-control"),
);
