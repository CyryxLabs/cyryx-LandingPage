import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildHead } from "@/components/cyryx/seo/seo";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminOverview,
  markContactHandled,
  type AdminOverview,
  type ContactRow,
} from "@/lib/admin-overview.functions";

export const Route = createFileRoute("/_authenticated/workspace/")({
  head: () => {
    const h = buildHead({
      title: "Internal console — Cyryx Labs",
      description: "Internal workspace dashboard.",
      path: "/workspace",
    });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: WorkspaceHome,
});

type Tab = "overview" | "contacts" | "newsletter" | "cta";

function WorkspaceHome() {
  const [windowDays, setWindowDays] = useState(30);
  const [tab, setTab] = useState<Tab>("overview");
  const fetchOverview = useServerFn(getAdminOverview);
  const { data, isLoading, error, refetch, isFetching } = useQuery<AdminOverview>({
    queryKey: ["workspace-overview", windowDays],
    queryFn: () => fetchOverview({ data: { windowDays } }),
  });

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="mx-auto max-w-6xl px-5 pt-32 pb-24 lg:pt-40">
        <HudLabel withDot className="text-[var(--accent-glow)]">Cyryx Labs · Internal</HudLabel>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-silver-gradient">
            Internal console
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
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/auth";
              }}
              className="h-9 px-3 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] hud-label text-[var(--silver-dim)] hover:text-[var(--silver)]"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] pb-2">
          {(["overview", "contacts", "newsletter", "cta"] as const).map((t) => (
            <TabBtn key={t} active={tab === t} onClick={() => setTab(t)}>
              {t === "overview" ? "Overview" : t === "cta" ? "CTA events" : t[0].toUpperCase() + t.slice(1)}
            </TabBtn>
          ))}
          <Link
            to="/workspace/careers"
            className="ml-auto text-xs hud-label text-[var(--accent-glow)] hover:underline self-center"
          >
            Careers funnel →
          </Link>
        </nav>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { to: "/workspace/pipeline", label: "Pipeline" },
            { to: "/workspace/products", label: "Products" },
            { to: "/workspace/dev", label: "Development" },
            { to: "/workspace/hr", label: "HR" },
            { to: "/workspace/marketing", label: "Marketing" },
            { to: "/workspace/finance", label: "Finance" },
          ].map((m) => (
            <Link
              key={m.to}
              to={m.to as any}
              className="h-9 px-3 rounded-md border border-[var(--accent-glow)] hud-label text-xs text-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] flex items-center"
            >
              {m.label} →
            </Link>
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-8 text-sm text-[color:oklch(0.72_0.16_25)]">
            {(error as Error).message || "Unable to load."}
          </p>
        )}
        {isLoading && <p className="mt-8 text-sm text-[var(--silver-dim)]">Loading…</p>}

        {data && tab === "overview" && <Overview data={data} />}
        {data && tab === "contacts" && <ContactsTab rows={data.recentContacts} onChanged={() => refetch()} />}
        {data && tab === "newsletter" && <NewsletterTab rows={data.recentSubscribers} />}
        {data && tab === "cta" && <CtaTab data={data} />}
      </main>
      <Footer />
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 px-3 rounded-md text-xs hud-label transition-colors ${
        active
          ? "bg-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)] text-[var(--accent-glow)]"
          : "text-[var(--silver-dim)] hover:text-[var(--silver)]"
      }`}
    >
      {children}
    </button>
  );
}

function Overview({ data }: { data: AdminOverview }) {
  const t = data.totals;
  return (
    <>
      <section aria-label="Totals" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Contacts (all time)" value={t.contactsTotal} caption={`${t.contactsWindow} in window`} />
        <Stat label="Contacts to triage" value={t.contactsPending} caption="Unhandled" tone={t.contactsPending > 0 ? "warn" : "muted"} />
        <Stat label="Subscribers confirmed" value={t.subscribersConfirmed} caption={`${t.subscribersPending} pending · ${t.subscribersTotal} total`} />
        <Stat label="CTA events (window)" value={t.ctaEventsWindow} caption={`Last ${data.windowDays}d`} />
      </section>

      <section aria-label="Top CTAs" className="mt-10">
        <h2 className="hud-label text-[var(--silver-dim)]">Top CTAs</h2>
        <div className="mt-3 overflow-x-auto rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)]">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-[var(--silver-dim)]">
              <tr>
                <th className="px-3 py-2">Section</th>
                <th className="px-3 py-2">CTA</th>
                <th className="px-3 py-2 text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              {data.topCtas.length === 0 && (
                <tr><td colSpan={3} className="px-3 py-4 text-[var(--silver-dim)]">No CTA events in this window.</td></tr>
              )}
              {data.topCtas.map((r) => (
                <tr key={r.section + r.cta} className="border-t border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
                  <td className="px-3 py-2 text-[var(--silver-dim)]">{r.section}</td>
                  <td className="px-3 py-2">{r.cta}</td>
                  <td className="px-3 py-2 text-right">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ContactsTab({ rows, onChanged }: { rows: ContactRow[]; onChanged: () => void }) {
  const mark = useServerFn(markContactHandled);
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (args: { id: string; handled: boolean; notes: string | null }) => mark({ data: args }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workspace-overview"] });
      onChanged();
    },
  });

  function exportCsv() {
    const header = ["created_at", "name", "email", "company", "message", "handled_at", "notes"];
    const csv = [header.join(",")].concat(
      rows.map((r) =>
        header
          .map((k) => `"${String((r as any)[k] ?? "").replaceAll('"', '""').replaceAll("\n", " ")}"`)
          .join(","),
      ),
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section aria-label="Contacts" className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="hud-label text-[var(--silver-dim)]">Recent contact submissions</h2>
        <button
          type="button"
          onClick={exportCsv}
          className="h-8 px-3 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] hud-label text-xs text-[var(--silver-dim)] hover:text-[var(--silver)]"
        >
          Export CSV
        </button>
      </div>
      <ul className="mt-4 space-y-3">
        {rows.length === 0 && <li className="text-sm text-[var(--silver-dim)]">No submissions yet.</li>}
        {rows.map((r) => (
          <ContactCard key={r.id} row={r} onSave={(handled, notes) => mutation.mutate({ id: r.id, handled, notes })} busy={mutation.isPending} />
        ))}
      </ul>
    </section>
  );
}

function ContactCard({
  row,
  onSave,
  busy,
}: {
  row: ContactRow;
  onSave: (handled: boolean, notes: string | null) => void;
  busy: boolean;
}) {
  const [notes, setNotes] = useState(row.notes ?? "");
  const handled = !!row.handled_at;
  return (
    <li className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-medium">
            {row.name} <span className="text-[var(--silver-dim)]">· {row.email}</span>
            {row.company && <span className="text-[var(--silver-dim)]"> · {row.company}</span>}
          </p>
          <p className="text-xs text-[var(--silver-dim)]">{new Date(row.created_at).toLocaleString()}</p>
        </div>
        <span
          className={`text-xs hud-label px-2 py-0.5 rounded-md border ${
            handled
              ? "border-emerald-500/40 text-emerald-400"
              : "border-amber-500/40 text-amber-400"
          }`}
        >
          {handled ? `Handled ${new Date(row.handled_at!).toLocaleDateString()}` : "Pending"}
        </span>
      </div>
      <p className="mt-3 text-sm whitespace-pre-wrap text-[var(--silver)]">{row.message}</p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Internal notes…"
        maxLength={2000}
        className="mt-3 w-full min-h-[60px] bg-transparent border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] rounded-md px-3 py-2 text-sm text-[var(--silver)] focus:outline-none focus:border-[var(--accent-glow)]"
      />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => onSave(!handled, notes || null)}
          className="h-8 px-3 rounded-md border border-[var(--accent-glow)] hud-label text-xs text-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]"
        >
          {handled ? "Reopen" : "Mark handled"}
        </button>
        <button
          type="button"
          disabled={busy || notes === (row.notes ?? "")}
          onClick={() => onSave(handled, notes || null)}
          className="h-8 px-3 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] hud-label text-xs text-[var(--silver-dim)] hover:text-[var(--silver)]"
        >
          Save notes
        </button>
      </div>
    </li>
  );
}

function NewsletterTab({ rows }: { rows: AdminOverview["recentSubscribers"] }) {
  return (
    <section aria-label="Newsletter" className="mt-8">
      <h2 className="hud-label text-[var(--silver-dim)]">Recent talent-network & newsletter signups</h2>
      <div className="mt-3 overflow-x-auto rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)]">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-[var(--silver-dim)]">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Consent</th>
              <th className="px-3 py-2">Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-4 text-[var(--silver-dim)]">No subscribers yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2 text-[var(--silver-dim)]">{r.status}</td>
                <td className="px-3 py-2 text-[var(--silver-dim)]">{new Date(r.consent_given_at).toLocaleString()}</td>
                <td className="px-3 py-2 text-[var(--silver-dim)]">{r.confirmed_at ? new Date(r.confirmed_at).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CtaTab({ data }: { data: AdminOverview }) {
  return (
    <section aria-label="CTA" className="mt-8">
      <p className="text-sm text-[var(--silver-dim)]">
        {data.totals.ctaEventsWindow} events in the last {data.windowDays}d. See breakdown below.
      </p>
      <div className="mt-4 overflow-x-auto rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)]">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-[var(--silver-dim)]">
            <tr>
              <th className="px-3 py-2">Section</th>
              <th className="px-3 py-2">CTA</th>
              <th className="px-3 py-2 text-right">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.topCtas.length === 0 && (
              <tr><td colSpan={3} className="px-3 py-4 text-[var(--silver-dim)]">No events.</td></tr>
            )}
            {data.topCtas.map((r) => (
              <tr key={r.section + r.cta} className="border-t border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
                <td className="px-3 py-2 text-[var(--silver-dim)]">{r.section}</td>
                <td className="px-3 py-2">{r.cta}</td>
                <td className="px-3 py-2 text-right">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Stat({ label, value, caption, tone = "muted" }: { label: string; value: number; caption?: string; tone?: "muted" | "warn" }) {
  return (
    <div className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] p-4">
      <p className="hud-label text-[var(--silver-dim)]">{label}</p>
      <p className={`mt-2 font-display text-3xl ${tone === "warn" ? "text-amber-400" : "text-[var(--silver)]"}`}>{value}</p>
      {caption && <p className="mt-1 text-xs text-[var(--silver-dim)]">{caption}</p>}
    </div>
  );
}