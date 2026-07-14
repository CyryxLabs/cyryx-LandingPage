import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions/governance-optimization")({
  beforeLoad: () => {
    throw redirect({ to: "/solutions/ai-governance-cost-control", replace: true });
  },
  component: () => null,
});