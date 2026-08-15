import type { FullConfig } from "@playwright/test";

const CLIENT_ENTRY_PATH = "/@id/virtual:tanstack-start-client-entry";
const RESOLVED_CLIENT_ENTRY_PATH = "/@id/__x00__virtual:tanstack-start-client-entry";
const READY_TIMEOUT_MS = 30_000;

export default async function waitForViteClient(config: FullConfig) {
  if (process.env.PLAYWRIGHT_USE_PRODUCTION_SERVER === "1") return;

  const baseURL = config.projects[0]?.use.baseURL;
  if (typeof baseURL !== "string") {
    throw new Error("Playwright baseURL is required for Vite client readiness.");
  }

  const root = new URL("/", baseURL);
  const clientEntry = new URL(CLIENT_ENTRY_PATH, baseURL);
  const resolvedClientEntry = new URL(RESOLVED_CLIENT_ENTRY_PATH, baseURL);
  const deadline = Date.now() + READY_TIMEOUT_MS;

  // The SSR environment can answer / before Vite's client environment has
  // registered the raw virtual entry referenced by the TanStack manifest.
  const rootResponse = await fetch(root, { cache: "no-store" });
  await rootResponse.arrayBuffer();
  const resolvedResponse = await fetch(resolvedClientEntry, { cache: "no-store" });
  if (!resolvedResponse.ok) {
    throw new Error(`Resolved Vite client entry failed readiness: ${resolvedClientEntry}`);
  }
  await resolvedResponse.arrayBuffer();

  while (Date.now() < deadline) {
    const response = await fetch(clientEntry, { cache: "no-store" }).catch(() => undefined);
    if (response?.ok && response.headers.get("content-type")?.includes("text/javascript")) {
      await response.arrayBuffer();
      return;
    }
    if (response) await response.arrayBuffer();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Vite client entry did not become ready: ${clientEntry}`);
}
