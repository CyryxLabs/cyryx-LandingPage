import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { GlassPanel } from "@/components/cyryx/primitives/GlassPanel";
import { buildBreadcrumbJsonLd, buildHead, buildLegalPageJsonLd } from "@/components/cyryx/seo/seo";

const PATH = "/terms";
const TITLE = "Terms of Service — Cyryx Labs";
const DESC =
  "Review the terms governing use of the Cyryx Labs website, pre-release products, acceptable use, intellectual property, and client engagement boundaries.";
const DATE_MODIFIED_ISO = "2026-09-24";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Terms of Service", path: PATH },
      ]),
      buildLegalPageJsonLd({
        name: TITLE,
        description: DESC,
        path: PATH,
        dateModified: DATE_MODIFIED_ISO,
      }),
    ]),
  component: TermsPage,
});

const SECTIONS: Array<{ id: string; n: string; title: string }> = [
  { id: "acceptance", n: "01", title: "Acceptance of terms" },
  { id: "eligibility", n: "02", title: "Eligibility & accounts" },
  { id: "msa", n: "03", title: "Engagements & Master Service Agreement" },
  { id: "prerelease", n: "04", title: "Pre-release products" },
  { id: "ip", n: "05", title: "Intellectual property" },
  { id: "feedback", n: "06", title: "Feedback license" },
  { id: "acceptable", n: "07", title: "Acceptable use" },
  { id: "thirdparty", n: "08", title: "Third-party services" },
  { id: "confidentiality", n: "09", title: "Confidentiality" },
  { id: "privacy", n: "10", title: "Privacy" },
  { id: "disclaimers", n: "11", title: "Disclaimers" },
  { id: "liability", n: "12", title: "Limitation of liability" },
  { id: "indemnity", n: "13", title: "Indemnification" },
  { id: "export", n: "14", title: "Export controls & sanctions" },
  { id: "force", n: "15", title: "Force majeure" },
  { id: "termination", n: "16", title: "Termination" },
  { id: "law", n: "17", title: "Governing law & venue" },
  { id: "misc", n: "18", title: "Miscellaneous" },
  { id: "changes", n: "19", title: "Changes to these Terms" },
  { id: "contact", n: "20", title: "Contact" },
];

function TermsPage() {
  const effective = "January 1, 2026";
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" tabIndex={-1} className="relative focus:outline-none">
        <section className="relative pt-28 pb-10 lg:pt-40 lg:pb-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
            <Breadcrumbs current="Terms of Service" />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <HudLabel withDot className="text-[var(--accent-glow)]">
                Legal · Terms
              </HudLabel>
              <span className="hud-label text-[var(--silver-dim)]">
                v2026.01 · Effective {effective}
              </span>
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
              Terms of Service
            </h1>
            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
              These Terms of Service (&ldquo;Terms&rdquo;) govern access to and
              use of cyryxlabs.com and any related public services
              (collectively, the &ldquo;Site&rdquo;) operated by Cyryx Labs
              LLC, a Florida limited liability company (&ldquo;Cyryx
              Labs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). Paid
              engagements are governed by a separate written Master Service
              Agreement (&ldquo;MSA&rdquo;). By accessing or using the Site,
              you agree to these Terms.
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
              <Panel id="acceptance" n="01" title="Acceptance of terms">
                <p>
                  By accessing or using the Site you agree to these Terms and
                  our <Link to="/privacy" className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]">Privacy Policy</Link>.
                  If you do not agree, do not use the Site. If you use the Site
                  on behalf of an organization, you represent that you have
                  authority to bind that organization.
                </p>
              </Panel>

              <Panel id="eligibility" n="02" title="Eligibility & accounts">
                <p>
                  The Site is intended for a business audience of legal age in
                  their jurisdiction. Where the Site provides gated features
                  (e.g. early-access programs), you are responsible for
                  maintaining the confidentiality of your credentials and for
                  all activity under your account.
                </p>
              </Panel>

              <Panel id="msa" n="03" title="Engagements & Master Service Agreement">
                <p>
                  All paid engagements are performed under a separate written
                  MSA and one or more Statements of Work between Cyryx Labs and
                  the client. Nothing on the Site creates a contract to
                  deliver services, and information on the Site is not a
                  binding offer. In the event of any conflict between these
                  Terms and an executed MSA, the MSA controls.
                </p>
              </Panel>

              <Panel id="prerelease" n="04" title="Pre-release products">
                <p>
                  Products or features marked as pre-release, alpha,
                  beta, preview, or early access are provided for evaluation
                  purposes only, without warranty, and may be modified,
                  suspended, or discontinued at any time. Availability of
                  pre-release materials on the Site does not constitute
                  general commercial availability.
                </p>
              </Panel>

              <Panel id="ip" n="05" title="Intellectual property">
                <p>
                  All content on the Site — including text, graphics, logos,
                  marks, and software — is the property of Cyryx Labs or its
                  licensors and is protected by intellectual property laws.
                  You may not copy, modify, distribute, publicly display, or
                  create derivative works from any portion of the Site without
                  our prior written consent, except as permitted for personal,
                  non-commercial evaluation or by applicable law.
                </p>
              </Panel>

              <Panel id="feedback" n="06" title="Feedback license">
                <p>
                  If you submit feedback, ideas, or suggestions about the Site
                  or our products, you grant Cyryx Labs a non-exclusive,
                  worldwide, royalty-free, sublicensable, perpetual, and
                  irrevocable license to use, reproduce, and incorporate that
                  feedback for any purpose, without obligation or attribution.
                </p>
              </Panel>

              <Panel id="acceptable" n="07" title="Acceptable use">
                <p>You agree not to:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
                  <li>use the Site in a manner that violates any applicable law or third-party right;</li>
                  <li>attempt to gain unauthorized access to the Site, accounts, or related systems;</li>
                  <li>probe, scan, or test the vulnerability of the Site without prior written authorization;</li>
                  <li>introduce viruses, malware, or otherwise disrupt Site operation;</li>
                  <li>scrape, harvest, mirror, or reverse engineer any portion of the Site except as permitted by applicable law;</li>
                  <li>use the Site to develop a competing product, or to train machine-learning models on Cyryx Labs content without prior written consent;</li>
                  <li>impersonate any person or entity or misrepresent your affiliation.</li>
                </ul>
                <p className="mt-3">
                  Suspected vulnerabilities may be reported responsibly to{" "}
                  <MailLink to="security@cyryxlabs.com" />.
                </p>
              </Panel>

              <Panel id="thirdparty" n="08" title="Third-party services">
                <p>
                  The Site relies on third-party infrastructure for hosting,
                  edge compute, email delivery, analytics, and related
                  functions. Their availability and terms are outside our
                  control. We are not responsible for third-party services
                  except as explicitly stated in an MSA.
                </p>
              </Panel>

              <Panel id="confidentiality" n="09" title="Confidentiality">
                <p>
                  Non-public information exchanged during discovery,
                  pre-contract discussions, or early-access programs is
                  confidential. Do not disclose or publish it without our
                  prior written consent. Formal confidentiality obligations,
                  where applicable, are set out in a signed NDA or MSA.
                </p>
              </Panel>

              <Panel id="privacy" n="10" title="Privacy">
                <p>
                  Our handling of personal data is described in our{" "}
                  <Link to="/privacy" className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]">
                    Privacy Policy
                  </Link>
                  , which is incorporated into these Terms by reference.
                </p>
              </Panel>

              <Panel id="disclaimers" n="11" title="Disclaimers">
                <p>
                  The Site and all Site content are provided on an
                  &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis
                  without warranties of any kind, whether express or implied,
                  including implied warranties of merchantability, fitness for
                  a particular purpose, non-infringement, and any warranties
                  arising from course of dealing or usage of trade. We do not
                  warrant that the Site will be uninterrupted, error-free, or
                  free of harmful components, and we do not warrant the
                  accuracy, completeness, or timeliness of Site content.
                </p>
              </Panel>

              <Panel id="liability" n="12" title="Limitation of liability">
                <p>
                  To the maximum extent permitted by law, Cyryx Labs and its
                  members, officers, employees, and affiliates will not be
                  liable for any indirect, incidental, special, consequential,
                  exemplary, or punitive damages, or for lost profits,
                  revenues, data, or goodwill, arising out of or related to
                  your use of the Site, even if advised of the possibility of
                  such damages. Our aggregate liability arising out of or
                  related to the Site will not exceed one hundred U.S. dollars
                  (US$100). Some jurisdictions do not allow the exclusion of
                  certain damages; in those jurisdictions our liability is
                  limited to the smallest amount permitted by law.
                </p>
              </Panel>

              <Panel id="indemnity" n="13" title="Indemnification">
                <p>
                  You agree to indemnify, defend, and hold harmless Cyryx Labs
                  and its members, officers, employees, and affiliates from
                  any claim, liability, damage, loss, or expense (including
                  reasonable attorneys&rsquo; fees) arising out of your breach
                  of these Terms, your misuse of the Site, or your violation
                  of any law or third-party right.
                </p>
              </Panel>

              <Panel id="export" n="14" title="Export controls & sanctions">
                <p>
                  You represent that you are not located in, and are not a
                  national or resident of, any country subject to a
                  comprehensive U.S. embargo, and that you are not listed on
                  any U.S. government list of prohibited or restricted parties.
                  You agree to comply with all applicable export control and
                  sanctions laws.
                </p>
              </Panel>

              <Panel id="force" n="15" title="Force majeure">
                <p>
                  Neither party is liable for delay or failure to perform
                  caused by events beyond its reasonable control, including
                  natural disasters, acts of government, network or utility
                  failures, labor disputes, and acts of war or terrorism.
                </p>
              </Panel>

              <Panel id="termination" n="16" title="Termination">
                <p>
                  We may suspend or terminate your access to the Site at any
                  time, with or without notice, for any reason, including
                  suspected violation of these Terms. Sections that by their
                  nature should survive termination — including intellectual
                  property, disclaimers, limitation of liability,
                  indemnification, and governing law — will survive.
                </p>
              </Panel>

              <Panel id="law" n="17" title="Governing law & venue">
                <p>
                  These Terms are governed by the laws of the State of
                  Florida, without regard to conflict-of-laws principles. The
                  U.N. Convention on Contracts for the International Sale of
                  Goods does not apply. The exclusive venue for any dispute
                  arising out of or related to these Terms or the Site will
                  be the state or federal courts located in St. Lucie County,
                  Florida, and you consent to the personal jurisdiction of
                  those courts. Each party waives any right to a jury trial to
                  the extent permitted by law.
                </p>
              </Panel>

              <Panel id="misc" n="18" title="Miscellaneous">
                <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
                  <li><span className="text-[var(--silver)]">Entire agreement:</span> these Terms, together with any MSA and the Privacy Policy, constitute the entire agreement between the parties regarding the Site.</li>
                  <li><span className="text-[var(--silver)]">Severability:</span> if any provision is held unenforceable, the remaining provisions remain in full force.</li>
                  <li><span className="text-[var(--silver)]">No waiver:</span> failure to enforce any provision is not a waiver of future enforcement.</li>
                  <li><span className="text-[var(--silver)]">Assignment:</span> you may not assign these Terms without our prior written consent; we may assign in connection with a merger, acquisition, or sale of assets.</li>
                  <li><span className="text-[var(--silver)]">Relationship:</span> the parties are independent contractors; nothing in these Terms creates a partnership, joint venture, agency, or employment relationship.</li>
                  <li><span className="text-[var(--silver)]">Notices:</span> notices to Cyryx Labs must be sent to <MailLink to="contact@cyryxlabs.com" />.</li>
                </ul>
              </Panel>

              <Panel id="changes" n="19" title="Changes to these Terms">
                <p>
                  We may update these Terms from time to time. Material changes
                  will be reflected by updating the effective date above.
                  Continued use of the Site after changes take effect
                  constitutes acceptance of the updated Terms.
                </p>
              </Panel>

              <Panel id="contact" n="20" title="Contact">
                <p>
                  Questions about these Terms: <MailLink to="contact@cyryxlabs.com" />.
                  Security reports: <MailLink to="security@cyryxlabs.com" />.
                  Privacy inquiries: <MailLink to="privacy@cyryxlabs.com" />.
                </p>
              </Panel>

              <p className="border-t border-[color-mix(in_oklab,var(--silver)_10%,transparent)] pt-6 text-xs text-[var(--silver-dim)]">
                This page is provided for general informational purposes and is
                not legal advice. Please consult qualified counsel for guidance
                specific to your situation.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
                >
                  ← Back to Cyryx Labs
                </Link>
                <Link
                  to="/privacy"
                  className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
                >
                  View Privacy Policy →
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
        <li aria-current="page" className="text-[var(--silver)]">{current}</li>
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
