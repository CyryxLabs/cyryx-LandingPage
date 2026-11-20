import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useMemo, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { BUILD_LABEL } from "../lib/build-info";
import { initWebVitals } from "../lib/web-vitals";
import { syncCopyVariantToDocument } from "../lib/copy-variant";
import { captureFirstTouch } from "../lib/lead-attribution";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { Toaster } from "@/components/ui/sonner";
import { useSiteMotion } from "@/hooks/useSiteMotion";
import { AssistantWidget } from "@/components/cyryx/AssistantWidget";

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

function ErrorComponent({ error: rawError, reset }: { error: unknown; reset: () => void }) {
  const error = useMemo(
    () => (rawError instanceof Error ? rawError : new Error(String(rawError))),
    [rawError],
  );
  console.error(error);
  const router = useRouter();

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
      { name: "author", content: "Cyryx Labs" },
      { name: "google-site-verification", content: "Bc35xHMHU3j3kg9Iuj2it5vGwLp4IIXwzz_m-VSIk8g" },
      { property: "og:site_name", content: "Cyryx Labs" },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        // Only the hashed production asset gets the version query. In development
        // the URL is /src/styles.css, and Vite serves any `?v=` URL as immutable
        // for a year, which pins a stale stylesheet in the browser while the
        // markup keeps updating.
        href: appCss.includes("/assets/") ? `${appCss}?v=${BUILD_LABEL}` : appCss,
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
      // Brand fonts are self-hosted (public/fonts): no third-party request on
      // first paint. Only the two families used above the fold are preloaded.
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/space-grotesk-latin-wght-normal.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/inter-latin-wght-normal.woff2",
        crossOrigin: "anonymous",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Low-end device detection — sets html.cx-low-perf so CSS can
            drop backdrop-filter, heavy animations, and the hero aura
            for users on slow networks or low-memory devices. Core count is not
            used: iOS Safari always reports 4, which flagged every iPhone.
            Runs inline pre-hydration so the first paint already opts out. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var n=navigator,c=n.connection||n.mozConnection||n.webkitConnection,low=false;if(c){if(c.saveData)low=true;if(/^(slow-2g|2g|3g)$/.test(c.effectiveType||''))low=true;}if(typeof n.deviceMemory==='number'&&n.deviceMemory<4)low=true;if(low)document.documentElement.classList.add('cx-low-perf');}catch(e){}})();",
          }}
        />
        {/* Arms the scroll-reveal hidden states in cy.css before first paint,
            only when motion is welcome. If hydration never happens the class
            is removed again so no content stays hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var r=document.documentElement;if(r.classList.contains('cx-low-perf'))return;if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!('IntersectionObserver' in window))return;r.classList.add('cy-js');if(window.matchMedia('(min-width: 900px) and (min-height: 700px)').matches)r.classList.add('cy-pin');setTimeout(function(){if(!window.__cyMotionReady)r.classList.remove('cy-js','cy-pin');},8000);}catch(e){}})();",
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
            as /#contact. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if('scrollRestoration' in history){history.scrollRestoration='manual';}var r=document.documentElement,s=function(){r.dataset.cyryxBootScrollSettled='true';window.dispatchEvent(new Event('cyryx:boot-scroll-settled'));};r.style.scrollBehavior='auto';if(!window.location.hash){window.scrollTo(0,0);window.addEventListener('pageshow',s,{once:true});return;}var j=function(){try{var id=decodeURIComponent(window.location.hash.slice(1)),el=document.getElementById(id);if(!el)return;var h=matchMedia('(min-width:1024px)').matches?96:64;window.scrollTo(0,Math.max(0,el.getBoundingClientRect().top+window.scrollY-h-8));requestAnimationFrame(function(){requestAnimationFrame(function(){r.style.scrollBehavior='';});});}catch(e){}};document.addEventListener('DOMContentLoaded',j,{once:true});window.addEventListener('load',j,{once:true});window.addEventListener('pageshow',s,{once:true});}catch(e){}})();",
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
    captureFirstTouch();
    const root = document.documentElement;
    let firstFrame = 0;
    let secondFrame = 0;

    const publishScrollReady = () => {
      if (root.dataset.cyryxScrollReady === "true") return;
      if (!window.location.hash) {
        root.style.scrollBehavior = "auto";
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          if (!window.location.hash) {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          }
          root.style.scrollBehavior = "";
          root.dataset.cyryxScrollReady = "true";
        });
      });
    };

    root.dataset.cyryxHydrated = "true";
    if (root.dataset.cyryxBootScrollSettled === "true" || document.readyState === "complete") {
      publishScrollReady();
    } else window.addEventListener("cyryx:boot-scroll-settled", publishScrollReady, { once: true });

    return () => {
      window.removeEventListener("cyryx:boot-scroll-settled", publishScrollReady);
      if (firstFrame) window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
      delete root.dataset.cyryxScrollReady;
      delete root.dataset.cyryxHydrated;
    };
  }, []);
  useSmoothScroll();
  useSiteMotion();

  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <AssistantWidget />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
