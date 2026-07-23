import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildHead } from "@/components/cyryx/seo/seo";
import { getCareersFunnel, type CareersFunnel } from "@/lib/careers-analytics.functions";

export const Route = createFileRoute("/_authenticated/workspace/careers")({
  head: () => {
    const h = buildHead({
      title: "Careers analytics — Cyryx Labs",
      description: "Internal funnel view for talent-network signups.",
      path: "/workspace/careers",
    });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: CareersAnalyticsPage,
});

function CareersAnalyticsPage() {
  const [windowDays, setWindowDays] = useState(30);
  const fetchFunnel = useServerFn(getCareersFunnel);
  const { data, isLoading, error, refetch, isFetching } = useQuery<CareersFunnel>({
    queryKey: ["careers-funnel", windowDays],
    queryFn: () => fetchFunnel({ data: { windowDays } }),
  });

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="mx-auto max-w-6xl px-5 pt-32 pb-24 lg:pt-40">
        <HudLabel withDot className="text-[var(--accent-glow)]">Cyryx Labs · Workspace · Careers</HudLabel>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-silver-gradient">
            Talent network funnel
          </h1>
          <div className="flex items-center gap-2 text-xs">
            {[7, 30, 90].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWindowDays(w)}
                className={`h-9 px-3 rounded-md border hud-label transition-colors ${
                  windowDays === w
                    ? "border-[var(--accent-glow)] text-[var(--accent-glow)]"
                    : "border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] text-[var(--silver-dim)] hover:text-[var(--silver)]"
                }`}
              >
                {w}d
              </button>
            ))}
            <button
              type="button"
              onClick={() => refetch()}
              className="h-9 px-3 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] hud-label text-[var(--silver-dim)] hover:text-[var(--silver)]"
            >
              {isFetching ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-8 text-sm text-[color:oklch(0.72_0.16_25)]">
            {(error as Error).message || "Unable to load analytics."}
          </p>
        )}
        {isLoading && <p className="mt-8 text-sm text-[var(--silver-dim)]">Loading…</p>}

        {data && (
          <>
            <section aria-label="Funnel" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="CTA clicks" value={data.clicks} caption="Talent-network CTAs" />
              <Stat label="Signup submits" value={data.submissions} caption="Form submissions" />
              <Stat
                label="Confirmations sent"
                value={data.confirmationsSent}
                caption={`${data.confirmationsFailed} failed · ${data.confirmationsQueued} queued`}
              />
              <Stat
                label="Confirmed subscribers"
                value={data.confirmed}
                caption={rate(data.confirmed, data.submissions) + " of submits"}
              />
              <Stat
                label="Rate-limit hits (429)"
                value={data.rateLimitHits}
                caption="/api/public/newsletter/subscribe"
                tone={data.rateLimitHits > 0 ? "warn" : "muted"}
              />
              <Stat
                label="Click → submit"
                value={rate(data.submissions, data.clicks)}
                caption="Conversion rate"
              />
              <Stat
                label="Submit → sent"
                value={rate(data.confirmationsSent, data.submissions)}
                caption="Deliverability"
              />
              <Stat
                label="Submit → confirmed"
                value={rate(data.confirmed, data.submissions)}
                caption="Double opt-in completion"
              />
            </section>

            <section aria-labelledby="daily-heading" className="mt-14">
              <h2 id="daily-heading" className="hud-label text-[var(--silver)]">Daily activity</h2>
              <div className="mt-4 overflow-x-auto rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)]">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-[var(--silver-dim)]">
                    <tr>
                      <th className="px-4 py-3 hud-label">Day</th>
                      <th className="px-4 py-3 hud-label">Submissions</th>
                      <th className="px-4 py-3 hud-label">Confirmed</th>
                      <th className="px-4 py-3 hud-label">Rate-limit hits</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--silver)]">
                    {data.daily
                      .slice()
                      .reverse()
                      .map((row) => (
                        <tr key={row.day} className="border-t border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
                          <td className="px-4 py-2 font-mono text-xs">{row.day}</td>
                          <td className="px-4 py-2">{row.submissions}</td>
                          <td className="px-4 py-2">{row.confirmed}</td>
                          <td className={`px-4 py-2 ${row.rateLimitHits > 0 ? "text-[color:oklch(0.75_0.14_60)]" : ""}`}>
                            {row.rateLimitHits}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-[var(--silver-dim)]">
                Window: last {data.windowDays} days · since {data.since.slice(0, 10)}
              </p>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stat({
  label,
  value,
  caption,
  tone,
}: {
  label: string;
  value: number | string;
  caption?: string;
  tone?: "muted" | "warn";
}) {
  const border =
    tone === "warn"
      ? "border-[color:oklch(0.65_0.14_60)]"
      : "border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)]";
  return (
    <div className={`rounded-md border ${border} bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-5`}>
      <div className="hud-label text-[var(--silver-dim)]">{label}</div>
      <div className="mt-2 font-display text-3xl text-[var(--silver)]">{value}</div>
      {caption && <div className="mt-1 text-xs text-[var(--silver-dim)]">{caption}</div>}
    </div>
  );
}

function rate(numerator: number, denominator: number): string {
  if (!denominator) return "—";
  return `${Math.round((numerator / denominator) * 1000) / 10}%`;
}