import { createFileRoute, Outlet, retainSearchParams } from "@tanstack/react-router";

export const TABS = ["overview", "contacts", "newsletter", "cta"] as const;
export type WsTab = (typeof TABS)[number];
export const WINDOWS = [7, 30, 90] as const;
export type WsWindow = (typeof WINDOWS)[number];

export type WorkspaceSearch = { w: WsWindow; tab: WsTab };

export const Route = createFileRoute("/_authenticated/workspace")({
  validateSearch: (raw: Record<string, unknown>): WorkspaceSearch => {
    const wNum = Number(raw.w);
    const w = (WINDOWS as readonly number[]).includes(wNum) ? (wNum as WsWindow) : 30;
    const tab = TABS.includes(raw.tab as WsTab) ? (raw.tab as WsTab) : "overview";
    return { w, tab };
  },
  search: {
    middlewares: [retainSearchParams(["w", "tab"])],
  },
  component: () => <Outlet />,
});