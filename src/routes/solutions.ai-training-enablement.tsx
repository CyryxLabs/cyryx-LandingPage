import { createFileRoute } from "@tanstack/react-router";
import { serviceRoute } from "@/components/site/ServicePage";

export const Route = createFileRoute("/solutions/ai-training-enablement")(
  serviceRoute("ai-training-enablement"),
);
