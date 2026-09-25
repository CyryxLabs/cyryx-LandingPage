import { createFileRoute, redirect } from "@tanstack/react-router";

// Discontinued product URL (Sep 2026): permanently redirected to the Products overview.
export const Route = createFileRoute("/products/maax-studio")({
  beforeLoad: () => {
    throw redirect({
      to: "/products",
      search: true,
      replace: true,
      statusCode: 308,
    });
  },
  component: () => null,
});
