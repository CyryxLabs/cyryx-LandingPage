import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell, WorkspaceCard } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";
import { DeptDashboard } from "@/components/cyryx/workspace/DeptDashboard";

export const Route = createFileRoute("/_authenticated/workspace/finance")({
  head: () => {
    const h = buildHead({ title: "Finance · Cyryx", description: "Transactions, subscriptions, invoices", path: "/workspace/finance" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: FinancePage,
});

const TABS = ["overview", "transactions", "subscriptions", "invoices", "accounts", "categories"] as const;
type Tab = (typeof TABS)[number];

function FinancePage() {
  const [tab, setTab] = useState<Tab>("overview");
  return (
    <WorkspaceShell title="Finance" subtitle="Cash, MRR, invoices and P&L basics">
      <nav className="mb-6 flex flex-wrap gap-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md hud-label text-xs ${
              tab === t
                ? "bg-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)] text-[var(--accent-glow)]"
                : "text-[var(--silver-dim)] hover:text-[var(--silver)]"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>
      {tab === "overview" && <FinanceOverview />}
      {tab === "overview" && (
        <div className="mt-6">
          <DeptDashboard kind="finance" />
        </div>
      )}
      {tab === "transactions" && (
        <DataTable
          tableName="fin_transactions"
          queryKey="fin_transactions"
          orderBy="occurred_on"
          fields={[
            { key: "occurred_on", label: "Date", type: "date", required: true },
            { key: "kind", label: "Kind", type: "select", options: ["income","expense","transfer"] },
            { key: "amount", label: "Amount", type: "number", required: true },
            { key: "currency", label: "Ccy", type: "text" },
            { key: "counterparty", label: "Counterparty", type: "text" },
            { key: "description", label: "Description", type: "text", className: "min-w-[240px]" },
            { key: "reference", label: "Ref", type: "text" },
          ]}
        />
      )}
      {tab === "subscriptions" && (
        <DataTable
          tableName="fin_subscriptions"
          queryKey="fin_subscriptions"
          fields={[
            { key: "customer_name", label: "Customer", type: "text", required: true },
            { key: "plan", label: "Plan", type: "text" },
            { key: "mrr", label: "MRR", type: "number", required: true },
            { key: "currency", label: "Ccy", type: "text" },
            { key: "status", label: "Status", type: "select", options: ["trial","active","paused","canceled"] },
            { key: "started_at", label: "Started", type: "date" },
            { key: "canceled_at", label: "Canceled", type: "date" },
          ]}
        />
      )}
      {tab === "invoices" && (
        <DataTable
          tableName="fin_invoices"
          queryKey="fin_invoices"
          fields={[
            { key: "number", label: "#", type: "text", required: true },
            { key: "customer_name", label: "Customer", type: "text", required: true },
            { key: "amount", label: "Amount", type: "number", required: true },
            { key: "currency", label: "Ccy", type: "text" },
            { key: "status", label: "Status", type: "select", options: ["draft","sent","paid","overdue","void"] },
            { key: "issued_at", label: "Issued", type: "date" },
            { key: "due_at", label: "Due", type: "date" },
            { key: "paid_at", label: "Paid", type: "date" },
          ]}
        />
      )}
      {tab === "accounts" && (
        <DataTable
          tableName="fin_accounts"
          queryKey="fin_accounts"
          orderBy="name"
          ascending
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "kind", label: "Kind", type: "select", options: ["bank","credit_card","cash","other"] },
            { key: "currency", label: "Ccy", type: "text" },
            { key: "opening_balance", label: "Opening", type: "number" },
          ]}
        />
      )}
      {tab === "categories" && (
        <DataTable
          tableName="fin_categories"
          queryKey="fin_categories"
          orderBy="name"
          ascending
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "kind", label: "Kind", type: "select", options: ["income","expense"] },
            { key: "color", label: "Color", type: "text" },
          ]}
        />
      )}
    </WorkspaceShell>
  );
}

function FinanceOverview() {
  const { data } = useQuery({
    queryKey: ["finance-overview"],
    queryFn: async () => {
      const [subs, tx, inv] = await Promise.all([
        (supabase as any).from("fin_subscriptions").select("mrr,status"),
        (supabase as any).from("fin_transactions").select("amount,kind,occurred_on"),
        (supabase as any).from("fin_invoices").select("amount,status"),
      ]);
      const mrr = (subs.data ?? [])
        .filter((s: any) => ["active", "trial"].includes(s.status))
        .reduce((a: number, s: any) => a + Number(s.mrr ?? 0), 0);
      const last30 = Date.now() - 30 * 864e5;
      const rev = (tx.data ?? [])
        .filter((t: any) => t.kind === "income" && new Date(t.occurred_on).getTime() > last30)
        .reduce((a: number, t: any) => a + Number(t.amount ?? 0), 0);
      const exp = (tx.data ?? [])
        .filter((t: any) => t.kind === "expense" && new Date(t.occurred_on).getTime() > last30)
        .reduce((a: number, t: any) => a + Number(t.amount ?? 0), 0);
      const outstanding = (inv.data ?? [])
        .filter((i: any) => ["sent", "overdue"].includes(i.status))
        .reduce((a: number, i: any) => a + Number(i.amount ?? 0), 0);
      return { mrr, rev, exp, outstanding, burn: exp - rev };
    },
  });
  const fmt = (n: number) => `$${(n ?? 0).toLocaleString()}`;
  const cards = [
    { label: "MRR", value: fmt(data?.mrr ?? 0) },
    { label: "Revenue (30d)", value: fmt(data?.rev ?? 0) },
    { label: "Expenses (30d)", value: fmt(data?.exp ?? 0) },
    { label: "Net burn (30d)", value: fmt(data?.burn ?? 0) },
    { label: "Outstanding invoices", value: fmt(data?.outstanding ?? 0) },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <WorkspaceCard key={c.label} className="p-4">
          <p className="hud-label text-[var(--silver-dim)]">{c.label}</p>
          <p className="mt-2 font-display text-2xl text-[var(--silver)]">{c.value}</p>
        </WorkspaceCard>
      ))}
    </section>
  );
}
