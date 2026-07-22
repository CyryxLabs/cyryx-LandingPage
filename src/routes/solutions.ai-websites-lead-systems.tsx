import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions/ai-websites-lead-systems")({
  beforeLoad: () => {
    throw redirect({ to: "/solutions/digital-web-systems", replace: true });
  },
  component: () => null,
});
