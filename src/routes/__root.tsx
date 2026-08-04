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
import { BUILD_LABEL } from "../lib/build-info";
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
      { name: "author", content: "Cyryx Labs" },
      { name: "google-site-verification", content: "Bc35xHMHU3j3kg9Iuj2it5vGwLp4IIXwzz_m-VSIk8g" },
      { property: "og:site_name", content: "Cyryx Labs" },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: `${appCss}?v=${BUILD_LABEL}`,
      },
      {
        rel: "icon",
        href: "/favicon.ico?v=20260723-1",
        sizes: "any",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png?v=20260723-1",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png?v=20260723-1",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png?v=20260723-1",
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
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400..600&family=Space+Grotesk:wght@500..700&display=swap",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400..600&family=Space+Grotesk:wght@500..700&display=swap",
        crossOrigin: "anonymous",
      },
      // Font files are discovered from the Google Fonts stylesheet. Avoid a
      // version-specific direct preload URL, which can become stale upstream.
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        {/* Keep reload behavior deterministic without breaking deep links such
            as /#contact or /#maax. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if('scrollRestoration' in history){history.scrollRestoration='manual';}var r=document.documentElement;if(!window.location.hash){window.scrollTo(0,0);window.addEventListener('load',function(){window.scrollTo(0,0);},{once:true});return;}r.style.scrollBehavior='auto';var j=function(){try{var id=decodeURIComponent(window.location.hash.slice(1)),el=document.getElementById(id);if(!el)return;var h=matchMedia('(min-width:1024px)').matches?96:64;window.scrollTo(0,Math.max(0,el.getBoundingClientRect().top+window.scrollY-h-8));requestAnimationFrame(function(){requestAnimationFrame(function(){r.style.scrollBehavior='';});});}catch(e){}};document.addEventListener('DOMContentLoaded',j,{once:true});window.addEventListener('load',j,{once:true});}catch(e){}})();",
          }}
        />
        {/* Subdomain routing: workspace.<domain> serves the internal console.
            Redirect pre-hydration so the landing page never flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var h=window.location.hostname||'';if(/^workspace\\./i.test(h)){var p=window.location.pathname;if(p==='/'||p===''){window.location.replace('/workspace'+window.location.search+window.location.hash);}}}catch(e){}})();",
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
    document.documentElement.dataset.cyryxHydrated = "true";
    return () => {
      delete document.documentElement.dataset.cyryxHydrated;
    };
  }, []);
  useSmoothScroll();

  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
