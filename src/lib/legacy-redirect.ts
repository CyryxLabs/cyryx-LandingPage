const CRM_ORIGIN = "https://crm.cyryxlabs.com";

/**
 * Retired surfaces from the old hosting, answered before routing:
 * - aexos.cyryxlabs.com served an internal AEXOS page; buyers now read
 *   /products/aexos on the main site.
 * - The internal console (/auth, /workspace, workspace.* host) moved to the CRM.
 * - Newsletter confirm/unsubscribe links from old e-mails land on the home page.
 * - /lovable/* were hosting-platform webhooks; they no longer exist.
 */
export function legacyRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const redirect = (location: string) => new Response(null, { status: 308, headers: { location } });

  if (host === "aexos.cyryxlabs.com") return redirect("https://www.cyryxlabs.com/products/aexos");
  if (host.startsWith("workspace.")) return redirect(`${CRM_ORIGIN}/`);
  if (/^\/(auth|workspace)(\/|$)/.test(path)) return redirect(`${CRM_ORIGIN}/`);
  if (/^\/(newsletter\/confirm|unsubscribe|email\/unsubscribe)$/.test(path)) {
    return redirect(`${url.origin}/`);
  }
  if (/^\/lovable(\/|$)/.test(path)) {
    return new Response(null, { status: 410 });
  }
  return null;
}
