import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions/ai-integrations")({
  beforeLoad: () => {
    throw redirect({ to: "/solutions/workflow-automation", replace: true });
  },
  component: () => null,
});
