import { createFileRoute } from "@tanstack/react-router";
import { serviceRoute } from "@/components/site/ServicePage";

export const Route = createFileRoute("/managed-operations")(serviceRoute("managed-operations"));
