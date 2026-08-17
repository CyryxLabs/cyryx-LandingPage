import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions/ai-product-engineering")({
  beforeLoad: () => {
    throw redirect({
      to: "/solutions/custom-ai-product-development",
      search: true,
      replace: true,
      statusCode: 308,
    });
  },
  component: () => null,
});
