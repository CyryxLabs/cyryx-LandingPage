import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions/ai-websites-lead-systems")({
  beforeLoad: () => {
    throw redirect({
      to: "/solutions/digital-web-systems",
      search: true,
      replace: true,
      statusCode: 308,
    });
  },
  component: () => null,
});
