import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions/governance-optimization")({
  beforeLoad: () => {
    throw redirect({
      to: "/solutions/ai-governance-cost-control",
      search: true,
      replace: true,
      statusCode: 308,
    });
  },
  component: () => null,
});
