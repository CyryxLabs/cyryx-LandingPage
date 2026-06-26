import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { initWebVitals } from "../lib/web-vitals";
import { syncCopyVariantToDocument } from "../lib/copy-variant";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { httpEquiv: "Cache-Control", content: "no-store, no-cache, must-revalidate" },
      { httpEquiv: "Pragma", content: "no-cache" },
      { title: "Cyryx Labs — AI Execution Systems" },
      { name: "description", content: "Cyryx Labs builds AI products, agentic workflow systems, and governed execution infrastructure for teams moving from AI experiments to operations." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Cyryx Labs — AI Execution Systems" },
      { property: "og:description", content: "Cyryx Labs builds AI products, agentic workflow systems, and governed execution infrastructure for teams moving from AI experiments to operations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Cyryx Labs — AI Execution Systems" },
      { name: "twitter:description", content: "Cyryx Labs builds AI products, agentic workflow systems, and governed execution infrastructure for teams moving from AI experiments to operations." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/pqDYh1E7STSD3pG3DZTBMfMwqsS2/social-images/social-1782497606213-ChatGPT_Image_Jun_25,_2026,_08_57_05_PM.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/pqDYh1E7STSD3pG3DZTBMfMwqsS2/social-images/social-1782497606213-ChatGPT_Image_Jun_25,_2026,_08_57_05_PM.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      // Preload BEFORE the stylesheet link so the font CSS request starts early.
      // Trimmed weights to only what the hero/body actually render above the fold.
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700&family=Inter:wght@400;500&family=Orbitron:wght@500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700&family=Inter:wght@400;500&family=Orbitron:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Low-end device detection — sets html.cx-low-perf so CSS can
            drop backdrop-filter, heavy animations, and the hero aura
            for users on slow networks / low-memory / low-core devices.
            Runs inline pre-hydration so the first paint already opts out. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var n=navigator,c=n.connection||n.mozConnection||n.webkitConnection,low=false;if(c){if(c.saveData)low=true;if(/^(slow-2g|2g|3g)$/.test(c.effectiveType||''))low=true;}if(typeof n.deviceMemory==='number'&&n.deviceMemory<4)low=true;if(typeof n.hardwareConcurrency==='number'&&n.hardwareConcurrency<=4&&matchMedia('(max-width:767px)').matches)low=true;if(low)document.documentElement.classList.add('cx-low-perf');}catch(e){}})();",
          }}
        />
        {/* Defensive: unregister any legacy Service Worker that could pin
            stale HTML referencing a removed asset hash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister();});}).catch(function(){});}}catch(e){}})();",
          }}
        />
        {/* Defensive client env shim for server-function RPC in dev/prod bundles
            that still reference process.env before Vite substitution. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.process=window.process||{};window.process.env=Object.assign({TSS_SERVER_FN_BASE:'/_serverFn',NODE_ENV:'production'},window.process.env||{});",
          }}
        />
        {/* Always open new page loads at the very top. Disables the browser's
            automatic scroll restoration and strips any hash from the URL so a
            shared/refreshed `/#contact` link doesn't auto-jump to the form. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if('scrollRestoration' in history){history.scrollRestoration='manual';}var h=window.location.hash;if(h){history.replaceState(null,'',window.location.pathname+window.location.search);}window.scrollTo(0,0);window.addEventListener('load',function(){window.scrollTo(0,0);},{once:true});}catch(e){}})();",
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    initWebVitals();
    syncCopyVariantToDocument();
  }, []);
  useSmoothScroll();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
