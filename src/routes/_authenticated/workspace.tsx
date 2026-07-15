import { createFileRoute, Outlet, retainSearchParams } from "@tanstack/react-router";
import { z } from "zod";

export const TABS = ["overview", "contacts", "newsletter", "cta"] as const;
export type WsTab = (typeof TABS)[number];
export const WINDOWS = [7, 30, 90] as const;
export type WsWindow = (typeof WINDOWS)[number];

const workspaceSearchSchema = z.object({
  w: z.coerce
    .number()
    .catch(30)
    .transform((v) => ((WINDOWS as readonly number[]).includes(v) ? (v as WsWindow) : 30))
    .default(30),
  tab: z
    .string()
    .catch("overview")
    .transform((v) => (TABS.includes(v as WsTab) ? (v as WsTab) : "overview"))
    .default("overview"),
});

export type WorkspaceSearch = z.infer<typeof workspaceSearchSchema>;

export const Route = createFileRoute("/_authenticated/workspace")({
  validateSearch: (search) => workspaceSearchSchema.parse(search),
  search: {
    middlewares: [retainSearchParams(["w", "tab"])],
  },
  component: () => <Outlet />,
});