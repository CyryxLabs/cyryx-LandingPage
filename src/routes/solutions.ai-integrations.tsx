import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions/ai-integrations")({
  beforeLoad: () => {
    throw redirect({
      to: "/solutions/workflow-automation",
      search: true,
      replace: true,
      statusCode: 308,
    });
  },
  component: () => null,
});
