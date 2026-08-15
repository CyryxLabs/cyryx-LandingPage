import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();
  let isInitialClientRender = true;

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: () => {
      // The document bootstrap owns the initial position so reloads always
      // begin at the top (or at an explicit hash). TanStack resumes ownership
      // after hydration for SPA navigation and browser back/forward restores.
      if (typeof window === "undefined") return false;
      if (isInitialClientRender) {
        isInitialClientRender = false;
        return false;
      }
      return true;
    },
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: Awaited<ReturnType<typeof getRouter>>;
  }
}
