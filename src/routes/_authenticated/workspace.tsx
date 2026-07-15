import { createFileRoute, Outlet, retainSearchParams } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

export const TABS = ["overview", "contacts", "newsletter", "cta"] as const;
export type WsTab = (typeof TABS)[number];
export const WINDOWS = [7, 30, 90] as const;
export type WsWindow = (typeof WINDOWS)[number];

const workspaceSearchSchema = z.object({
  w: z.union([z.literal(7), z.literal(30), z.literal(90)]).catch(30).default(30),
  tab: z.enum(TABS).catch("overview").default("overview"),
});

export type WorkspaceSearch = z.infer<typeof workspaceSearchSchema>;

export const Route = createFileRoute("/_authenticated/workspace")({
  validateSearch: zodValidator(workspaceSearchSchema),
  search: {
    middlewares: [retainSearchParams(["w", "tab"])],
  },
  component: () => <Outlet />,
});
