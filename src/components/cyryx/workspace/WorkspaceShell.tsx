import { Link, useNavigate, useRouterState, useSearch } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Kanban,
  Package,
  Code2,
  Users,
  Megaphone,
  LineChart,
  Briefcase,
  LogOut,
} from "lucide-react";

const WINDOWS = [7, 30, 90] as const;

function WsWindowPicker() {
  const search = useSearch({ from: "/_authenticated/workspace" });
  const navigate = useNavigate();
  const current = search.w;
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Period filter">
      {WINDOWS.map((w) => (
        <button
          key={w}
          type="button"
          onClick={() =>
            navigate({
              to: ".",
              search: (prev: any) => ({ ...prev, w }),
              replace: true,
            })
          }
          className={`h-8 px-2.5 rounded-md border hud-label text-[11px] transition-colors ${
            current === w
              ? "border-[var(--accent-glow)] text-[var(--accent-glow)]"
              : "border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] text-[var(--silver-dim)] hover:text-[var(--silver)]"
          }`}
        >
          {w}d
        </button>
      ))}
    </div>
  );
}

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/workspace", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/workspace/pipeline", label: "Pipeline", icon: Kanban },
  { to: "/workspace/products", label: "Products", icon: Package },
  { to: "/workspace/dev", label: "Development", icon: Code2 },
  { to: "/workspace/hr", label: "HR", icon: Users },
  { to: "/workspace/marketing", label: "Marketing", icon: Megaphone },
  { to: "/workspace/finance", label: "Finance", icon: LineChart },
  { to: "/workspace/careers", label: "Careers funnel", icon: Briefcase },
];

export function WorkspaceShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)] flex">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] px-4 py-6 sticky top-0 h-dvh">
        <Link to="/workspace" className="hud-label text-[var(--accent-glow)] mb-8">
          Cyryx · Workspace
        </Link>
        <nav className="flex flex-col gap-1 text-sm">
          {NAV.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                  active
                    ? "bg-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)] text-[var(--accent-glow)]"
                    : "text-[var(--silver-dim)] hover:text-[var(--silver)] hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/auth";
          }}
          className="mt-auto flex items-center gap-2 text-xs hud-label text-[var(--silver-dim)] hover:text-[var(--silver)]"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </aside>

      <main id="main-content" className="flex-1 min-w-0">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] px-6 py-6 sticky top-0 bg-[var(--onyx)]/85 backdrop-blur z-10">
          <div>
            <p className="hud-label text-[var(--accent-glow)]">Internal</p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-silver-gradient">
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-sm text-[var(--silver-dim)]">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <WsWindowPicker />
            {actions}
          </div>
        </header>

        <nav className="lg:hidden flex gap-2 overflow-x-auto px-6 py-3 border-b border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] text-xs">
          {NAV.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={`shrink-0 rounded-md px-3 py-1.5 hud-label ${
                  active
                    ? "bg-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)] text-[var(--accent-glow)]"
                    : "text-[var(--silver-dim)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-8">{children}</div>
      </main>
    </div>
  );
}

export function WorkspaceCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] bg-white/[0.02] ${className}`}>
      {children}
    </div>
  );
}

export function WsButton({
  children,
  variant = "ghost",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const styles =
    variant === "primary"
      ? "border-[var(--accent-glow)] text-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]"
      : "border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] text-[var(--silver-dim)] hover:text-[var(--silver)]";
  return (
    <button
      {...props}
      className={`h-9 px-3 rounded-md border hud-label text-xs transition-colors disabled:opacity-50 ${styles} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function WsInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-9 px-3 rounded-md bg-transparent border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] text-sm text-[var(--silver)] focus:outline-none focus:border-[var(--accent-glow)] ${props.className ?? ""}`}
    />
  );
}

export function WsSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-9 px-2 rounded-md bg-[var(--onyx)] border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] text-sm text-[var(--silver)] focus:outline-none focus:border-[var(--accent-glow)] ${props.className ?? ""}`}
    />
  );
}
