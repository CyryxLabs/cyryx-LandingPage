import { createFileRoute } from "@tanstack/react-router";
import { serviceRoute } from "@/components/site/ServicePage";

export const Route = createFileRoute("/solutions/digital-web-systems")(
  serviceRoute("digital-web-systems"),
);
