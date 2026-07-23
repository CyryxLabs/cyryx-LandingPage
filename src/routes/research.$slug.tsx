import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/research/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/research", replace: true });
  },
  component: () => null,
});
