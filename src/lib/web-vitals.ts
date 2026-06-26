import { onCLS, onINP, onLCP, type Metric } from "web-vitals";

// Lightweight Web Vitals reporter. Logs in dev, sends a sendBeacon
// payload in production so we can correlate the low-perf fallback
// (`html.cx-low-perf`) with real-user LCP/CLS/INP.
const ENDPOINT = "/api/public/web-vitals";

function report(metric: Metric) {
  const payload = {
    name: metric.name,
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    rating: metric.rating,
    id: metric.id,
    nav: metric.navigationType,
    lowPerf: document.documentElement.classList.contains("cx-low-perf"),
    path: location.pathname,
    ua: navigator.userAgent,
    ts: Date.now(),
  };

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("[web-vitals]", payload);
    return;
  }

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
    } else {
      void fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    }
  } catch {
    /* swallow — never let analytics break the page */
  }
}

let started = false;
export function initWebVitals() {
  if (started || typeof window === "undefined") return;
  started = true;
  onLCP(report);
  onCLS(report);
  onINP(report);
}