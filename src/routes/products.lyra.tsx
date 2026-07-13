import { createFileRoute, redirect } from "@tanstack/react-router";

// Lyra's canonical page is /lyra — a single product page inside the site.
// This permanent redirect keeps old links and bookmarks working.
export const Route = createFileRoute("/products/lyra")({
  beforeLoad: () => {
    throw redirect({ to: "/lyra", statusCode: 301 });
  },
});
