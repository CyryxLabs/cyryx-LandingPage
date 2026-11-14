import { useEffect, useState, type ReactNode } from "react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { PRIMARY_NAVIGATION_CTA } from "@/lib/navigation";
import { buildStartProjectHref, type StartContextIntent, type StartContextSource } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { useCyMotion } from "./motion";

/**
 * Page frame for every `.cy` page: scroll progress, shared header and footer,
 * the motion hook and the mobile sticky call to action.
 */
export function SiteShell({
  children,
  source,
  intent,
  sticky = true,
}: {
  children: ReactNode;
  source?: StartContextSource;
  intent?: StartContextIntent;
  sticky?: boolean;
}) {
  useCyMotion();
  return (
    <div className="dark cy">
      <div className="cy-progress" aria-hidden="true" />
      <div className="cy-light" aria-hidden="true" />
      <div className="cy-grain" aria-hidden="true" />
      <Header />
      <main id="main-content" tabIndex={-1} className="cy-main">
        {children}
      </main>
      <Footer />
      {sticky ? <StickyCta source={source} intent={intent} /> : null}
    </div>
  );
}

function StickyCta({
  source,
  intent,
}: {
  source?: StartContextSource;
  intent?: StartContextIntent;
}) {
  const [visible, setVisible] = useState(false);
  const href = buildStartProjectHref({ source, intent });

  useEffect(() => {
    document.body.dataset.hasStickyCta = "true";
    const contact = document.getElementById("contact");
    let contactInView = false;
    const update = () => {
      const show = window.scrollY > window.innerHeight * 0.6 && !contactInView;
      setVisible(show);
      if (show) document.body.dataset.stickyVisible = "true";
      else delete document.body.dataset.stickyVisible;
    };
    const io = contact
      ? new IntersectionObserver(
          (entries) => {
            contactInView = entries[0]?.isIntersecting ?? false;
            update();
          },
          { rootMargin: "0px 0px -20% 0px" },
        )
      : null;
    if (contact) io?.observe(contact);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
      delete document.body.dataset.hasStickyCta;
      delete document.body.dataset.stickyVisible;
    };
  }, []);

  return (
    <div
      className="cy-sticky"
      data-visible={visible ? "true" : "false"}
      role="region"
      aria-label="Quick actions"
      inert={!visible}
    >
      <a
        href={href}
        className="cy-btn cy-btn--primary cy-btn--block"
        onClick={() => trackCta({ cta: "start_project", section: "sticky", href })}
      >
        {PRIMARY_NAVIGATION_CTA.label}
      </a>
    </div>
  );
}
