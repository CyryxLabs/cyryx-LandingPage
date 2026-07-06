import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { GlassPanel } from "@/components/cyryx/primitives/GlassPanel";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildLegalPageJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/privacy";
const TITLE = "Privacy Policy — Cyryx Labs";
const DESC =
  "How Cyryx Labs collects, uses, and protects information from visitors and clients of cyryxlabs.com.";
const LAST_UPDATED = "June 26, 2026";
const DATE_MODIFIED_ISO = "2026-06-26";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Privacy Policy", path: PATH },
      ]),
      buildLegalPageJsonLd({
        name: TITLE,
        description: DESC,
        path: PATH,
        dateModified: DATE_MODIFIED_ISO,
        type: "PrivacyPolicy",
      }),
    ]),
  component: PrivacyPage,
});

const SECTIONS: Array<{ id: string; n: string; title: string }> = [
  { id: "scope", n: "01", title: "Scope & controller" },
  { id: "definitions", n: "02", title: "Key definitions" },
  { id: "collect", n: "03", title: "Information we collect" },
  { id: "use", n: "04", title: "How we use information" },
  { id: "bases", n: "05", title: "Legal bases (GDPR / UK GDPR)" },
  { id: "sharing", n: "06", title: "Sharing & subprocessors" },
  { id: "retention", n: "07", title: "Retention & deletion" },
  { id: "transfers", n: "08", title: "International transfers" },
  { id: "rights", n: "09", title: "Your rights (GDPR, CCPA/CPRA, others)" },
  { id: "sell-share", n: "10", title: "Do not sell or share" },
  { id: "automated", n: "11", title: "Automated decision-making" },
  { id: "security", n: "12", title: "Security" },
  { id: "cookies", n: "13", title: "Cookies & analytics" },
  { id: "children", n: "14", title: "Children" },
  { id: "changes", n: "15", title: "Changes to this policy" },
  { id: "contact", n: "16", title: "Contact & complaints" },
];

function PrivacyPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="relative">
        <section className="relative pt-28 pb-10 lg:pt-40 lg:pb-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
            <Breadcrumbs current="Privacy Policy" />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <HudLabel withDot className="text-[var(--accent-glow)]">
                Legal · Privacy
              </HudLabel>
              <span className="hud-label text-[var(--silver-dim)]">
                v2026.06 · Last updated {LAST_UPDATED}
              </span>
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
              Privacy Policy
            </h1>
            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
              This Privacy Policy is maintained by Cyryx Labs LLC (&ldquo;Cyryx
              Labs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). It explains how
              we collect, use, disclose, and protect information when you visit{" "}
              <a
                className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]"
                href="https://cyryxlabs.com"
              >
                cyryxlabs.com
              </a>
              , contact us, or engage us under a Master Service Agreement. It
              is designed to align with the EU General Data Protection
              Regulation (GDPR), UK GDPR, the California Consumer Privacy Act
              as amended by the CPRA (CCPA/CPRA), and comparable U.S. state
              privacy laws (VCDPA, CPA, CTDPA, UCPA, and successors).
            </p>
          </div>
        </section>

        <section className="relative pb-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 grid gap-10 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="hud-label text-[var(--silver-dim)]">On this page</p>
                <ol className="mt-4 space-y-2 text-sm">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
                      >
                        <span className="tabular-nums text-[var(--accent-glow)] mr-2">
                          {s.n}
                        </span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            <div className="space-y-6">
              <Panel id="scope" n="01" title="Scope & controller">
                <p>
                  Data controller: <span className="text-[var(--silver)]">Cyryx Labs LLC</span>,
                  a Florida limited liability company. Postal contact available
                  on request via{" "}
                  <MailLink to="privacy@cyryxlabs.com" />.
                </p>
                <p>
                  This policy covers the public website and any prospect,
                  client, or vendor personal data we receive in the ordinary
                  course of business. Personal data processed on behalf of a
                  client under an MSA is governed by the applicable MSA / DPA;
                  in those engagements Cyryx Labs acts as a processor and the
                  client remains the controller.
                </p>
              </Panel>

              <Panel id="definitions" n="02" title="Key definitions">
                <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
                  <li><span className="text-[var(--silver)]">Personal data</span> — information relating to an identified or identifiable natural person.</li>
                  <li><span className="text-[var(--silver)]">Processing</span> — any operation performed on personal data (collection, storage, use, disclosure, deletion).</li>
                  <li><span className="text-[var(--silver)]">Controller / Business</span> — the entity that determines the purposes and means of processing.</li>
                  <li><span className="text-[var(--silver)]">Processor / Service Provider</span> — an entity that processes personal data on behalf of a controller.</li>
                  <li><span className="text-[var(--silver)]">Sensitive personal information</span> — categories treated as sensitive under GDPR Art. 9 and CPRA (e.g. government IDs, precise geolocation, health, biometric, or account credentials). We do not solicit these categories through the site.</li>
                </ul>
              </Panel>

              <Panel id="collect" n="03" title="Information we collect">
                <p>
                  We collect only what you choose to provide and the minimum
                  technical data needed to operate the site securely.
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
                  <li><span className="text-[var(--silver)]">Contact form data:</span> name, email, optional company, message body, and consent confirmation.</li>
                  <li><span className="text-[var(--silver)]">Newsletter data:</span> email address and opt-in state, plus timestamped confirmation and unsubscribe records.</li>
                  <li><span className="text-[var(--silver)]">Technical data:</span> IP address, user agent, request timestamps, referrer, and aggregated performance metrics (Core Web Vitals).</li>
                  <li><span className="text-[var(--silver)]">Engagement data:</span> if you enter into an MSA, business contact details, invoicing information, and correspondence records.</li>
                </ul>
                <p className="mt-3">
                  We do not knowingly collect personal information from
                  children under the age of 16. We do not use facial
                  recognition, biometric identification, or behavioral
                  advertising technologies on this site.
                </p>
              </Panel>

              <Panel id="use" n="04" title="How we use information">
                <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
                  <li>Respond to inquiries and provide the information or service you requested.</li>
                  <li>Deliver newsletters and administrative communications you have opted into.</li>
                  <li>Operate, secure, monitor, and improve the site and our services.</li>
                  <li>Detect, prevent, and investigate fraud, abuse, or security incidents.</li>
                  <li>Comply with legal obligations, respond to lawful requests, and enforce our terms.</li>
                </ul>
                <p className="mt-3">
                  We do not use personal data to train third-party generative
                  models, and we do not sell or share personal data for
                  cross-context behavioral advertising.
                </p>
              </Panel>

              <Panel id="bases" n="05" title="Legal bases (GDPR / UK GDPR)">
                <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
                  <li><span className="text-[var(--silver)]">Consent</span> (Art. 6(1)(a)) — newsletter, non-essential communications.</li>
                  <li><span className="text-[var(--silver)]">Contract</span> (Art. 6(1)(b)) — pre-contractual inquiries and MSA/SOW performance.</li>
                  <li><span className="text-[var(--silver)]">Legitimate interests</span> (Art. 6(1)(f)) — site security, aggregated analytics, fraud prevention. Balancing test performed and available on request.</li>
                  <li><span className="text-[var(--silver)]">Legal obligation</span> (Art. 6(1)(c)) — tax, accounting, and regulatory record-keeping.</li>
                </ul>
              </Panel>

              <Panel id="sharing" n="06" title="Sharing & subprocessors">
                <p>
                  We do not sell personal information. We share personal data
                  only with vetted subprocessors under written data-processing
                  terms, and only to the extent required to deliver the
                  service.
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
                  <li>Hosting, edge compute, and CDN infrastructure.</li>
                  <li>Transactional email delivery.</li>
                  <li>Managed database and authentication backend.</li>
                  <li>Error monitoring and performance analytics (aggregated).</li>
                </ul>
                <p className="mt-3">
                  A current subprocessor list is available on request via{" "}
                  <MailLink to="privacy@cyryxlabs.com" />. We may disclose
                  personal data when required by law, court order, or to
                  protect the rights, property, or safety of Cyryx Labs, our
                  clients, or the public.
                </p>
              </Panel>

              <Panel id="retention" n="07" title="Retention & deletion">
                <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
                  <li><span className="text-[var(--silver)]">Contact submissions:</span> up to 24 months from last contact.</li>
                  <li><span className="text-[var(--silver)]">Newsletter records:</span> until you unsubscribe, plus a suppression record retained indefinitely to honor your opt-out.</li>
                  <li><span className="text-[var(--silver)]">Server logs:</span> up to 90 days, then rotated or aggregated.</li>
                  <li><span className="text-[var(--silver)]">Engagement records:</span> for the term of the MSA and the period required by tax, accounting, and legal-hold obligations.</li>
                </ul>
                <p className="mt-3">You may request earlier deletion; see &sect;09.</p>
              </Panel>

              <Panel id="transfers" n="08" title="International transfers">
                <p>
                  Cyryx Labs is based in the United States and operates
                  globally. Personal data may be processed in countries other
                  than your own. For transfers from the EEA, UK, or
                  Switzerland we rely on Standard Contractual Clauses
                  (Commission Decision (EU) 2021/914), the UK IDTA / UK
                  Addendum, and, where applicable, the EU-U.S. and UK-U.S.
                  Data Privacy Framework. Copies of transfer safeguards are
                  available on request.
                </p>
              </Panel>

              <Panel id="rights" n="09" title="Your rights (GDPR, CCPA/CPRA, others)">
                <p>Depending on your jurisdiction, you may have the right to:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
                  <li>access the personal data we hold about you;</li>
                  <li>request correction of inaccurate data;</li>
                  <li>request deletion (right to be forgotten);</li>
                  <li>request portability in a structured, machine-readable format;</li>
                  <li>restrict or object to certain processing, including profiling;</li>
                  <li>withdraw consent at any time without affecting prior lawful processing;</li>
                  <li>opt out of the sale or sharing of personal information (see &sect;10);</li>
                  <li>limit the use of sensitive personal information;</li>
                  <li>not be discriminated against for exercising these rights;</li>
                  <li>lodge a complaint with your supervisory authority.</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, email{" "}
                  <MailLink to="privacy@cyryxlabs.com" />. We respond within
                  the timeframes required by applicable law (typically 30 days
                  under GDPR; 45 days under CCPA/CPRA, extendable once with
                  notice). We may request information reasonably necessary to
                  verify your identity. Authorized agents may submit requests
                  on your behalf with signed authorization.
                </p>
              </Panel>

              <Panel id="sell-share" n="10" title="Do not sell or share">
                <p>
                  Cyryx Labs does not sell personal information and does not
                  share personal information for cross-context behavioral
                  advertising, as those terms are defined under the CCPA/CPRA
                  and comparable state laws. There is no opt-out to submit
                  because the underlying practice does not occur; you may
                  still confirm this in writing via{" "}
                  <MailLink to="privacy@cyryxlabs.com" />.
                </p>
              </Panel>

              <Panel id="automated" n="11" title="Automated decision-making">
                <p>
                  We do not make decisions producing legal or similarly
                  significant effects about you based solely on automated
                  processing, and we do not engage in profiling within the
                  meaning of GDPR Art. 22 through the website.
                </p>
              </Panel>

              <Panel id="security" n="12" title="Security">
                <p>
                  We apply administrative, technical, and organizational
                  safeguards proportionate to the risk, including TLS in
                  transit, encryption at rest for managed datastores,
                  role-based access, least-privilege service credentials,
                  audit logging, dependency scanning, and periodic review of
                  subprocessors. No method of transmission or storage is
                  100% secure; we work to apply current industry best
                  practices and to respond promptly to incidents that
                  materially affect personal data.
                </p>
              </Panel>

              <Panel id="cookies" n="13" title="Cookies & analytics">
                <p>
                  We use only cookies and similar technologies strictly
                  necessary to operate the site (e.g. security, session,
                  preference) and aggregated, privacy-preserving performance
                  telemetry. We do not use advertising cookies, third-party
                  ad trackers, cross-site tracking pixels, or session replay.
                  Because we do not track across sites, we honor Global
                  Privacy Control (GPC) signals by default.
                </p>
              </Panel>

              <Panel id="children" n="14" title="Children">
                <p>
                  The site is intended for a business audience and is not
                  directed at children under 16. We do not knowingly collect
                  personal information from children. If you believe a child
                  has provided information, contact{" "}
                  <MailLink to="privacy@cyryxlabs.com" /> and we will delete
                  it.
                </p>
              </Panel>

              <Panel id="changes" n="15" title="Changes to this policy">
                <p>
                  We may update this Privacy Policy from time to time. Material
                  changes will be highlighted on this page and the
                  &ldquo;Last updated&rdquo; date will be revised. Continued
                  use of the site after changes take effect constitutes
                  acknowledgment of the updated policy.
                </p>
              </Panel>

              <Panel id="contact" n="16" title="Contact & complaints">
                <p>
                  Privacy inquiries: <MailLink to="privacy@cyryxlabs.com" />.
                  General inquiries: <MailLink to="contact@cyryxlabs.com" />.
                </p>
                <p className="mt-3">
                  EU/EEA and UK residents may lodge a complaint with their
                  local supervisory authority. California residents may
                  contact the California Privacy Protection Agency. We
                  encourage you to contact us first so we can address your
                  concern directly.
                </p>
              </Panel>

              <p className="border-t border-[color-mix(in_oklab,var(--silver)_10%,transparent)] pt-6 text-xs text-[var(--silver-dim)]">
                This page is provided for general informational purposes and
                is not legal advice. Please consult qualified counsel for
                guidance specific to your situation.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
                >
                  ← Back to Cyryx Labs
                </Link>
                <Link
                  to="/terms"
                  className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
                >
                  View Terms of Service →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="hud-label text-[var(--silver-dim)]">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-[var(--accent-glow)] transition-colors">Home</Link>
        </li>
        <li aria-hidden="true" className="text-[var(--silver-dim)]/60">/</li>
        <li className="text-[var(--silver-dim)]/80">Legal</li>
        <li aria-hidden="true" className="text-[var(--silver-dim)]/60">/</li>
        <li className="text-[var(--silver)]">{current}</li>
      </ol>
    </nav>
  );
}

function MailLink({ to }: { to: string }) {
  return (
    <a
      className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]"
      href={`mailto:${to}`}
    >
      {to}
    </a>
  );
}

function Panel({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <GlassPanel id={id} liquid={false} className="scroll-mt-28 p-6 sm:p-8">
      <div className="flex items-baseline gap-4">
        <span className="hud-label tabular-nums text-[var(--accent-glow)]">{n}</span>
        <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[var(--silver)]">
          {title}
        </h2>
      </div>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">
        {children}
      </div>
    </GlassPanel>
  );
}