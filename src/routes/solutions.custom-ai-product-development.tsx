import { createFileRoute } from "@tanstack/react-router";
import { serviceRoute } from "@/components/site/ServicePage";

export const Route = createFileRoute("/solutions/custom-ai-product-development")(
  serviceRoute("custom-ai-product-development"),
);
