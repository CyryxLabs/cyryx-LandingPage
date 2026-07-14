import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions/applied-ai-systems")({
  beforeLoad: () => {
    throw redirect({ to: "/solutions/internal-ai-assistants", replace: true });
  },
  component: () => null,
});