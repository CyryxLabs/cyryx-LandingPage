import * as React from "react";
import { useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUp, ArrowUpRight, MessageSquare } from "lucide-react";
import { CyryxLockup } from "./primitives/CyryxMark";
import wordmarkLarge from "@/assets/cyryx-wordmark-1200.webp";
import { PRIMARY_NAVIGATION, PRIMARY_NAVIGATION_CTA, type NavigationItem } from "@/lib/navigation";
import { trackCta } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";
import { cn } from "@/lib/utils";

type FooterItem = NavigationItem & {
  external?: boolean;
};

const LINK_CLASS =
  "cx-footer-link text-sm text-[var(--silver-dim)] transition-colors hover:text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] rounded-sm";

function FooterLink({ item, className }: { item: FooterItem; className?: string }) {
  if (item.external || item.href.startsWith("mailto:")) {
    return (
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={cn(LINK_CLASS, className)}
      >
        {item.label}
        {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }

  return (
    <Link
      to={item.href}
      hash={item.hash}
      className={cn(LINK_CLASS, className)}
      activeOptions={{ exact: true, includeHash: Boolean(item.hash) }}
    >
      {item.label}
    </Link>
  );
}

function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const CONTACT: FooterItem[] = [
  { label: "contact@cyryxlabs.com", href: "mailto:contact@cyryxlabs.com" },
  {
    label: "security@cyryxlabs.com",
    href: "mailto:security@cyryxlabs.com?subject=Security%20inquiry",
  },
  { label: "press@cyryxlabs.com", href: "mailto:press@cyryxlabs.com" },
];

const LEGAL: FooterItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // The homepage ends with its own start section, and /start and /brief are
  // the destination of the band's button, so it would only point back at them.
  const showCtaBand = !["/", "/start", "/brief"].some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
  );
  const startHref = PRIMARY_NAVIGATION_CTA.href;
  const assistantEnabled = isAssistantEnabled();
  const footerRef = useFooterMotion(pathname);

  const scrollTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <footer ref={footerRef} role="contentinfo" className="cx-footer ft relative overflow-hidden">
      <span aria-hidden className="cx-sweep-line absolute inset-x-0 top-0 block h-px" />
      <div aria-hidden className="ft-aura" />

      <div className="ft-wrap">
        {showCtaBand ? (
          <div className="cx-spotlight cx-footer-cta ft-band" data-ft-in>
            <p className="ft-band-title">Ready to put AI to work in your business?</p>
            <div className="ft-band-acts">
              <a
                href={startHref}
                className="cx-btn-primary"
                onClick={() =>
                  trackCta({ cta: "start_project", section: "footer", href: startHref })
                }
              >
                {PRIMARY_NAVIGATION_CTA.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              {assistantEnabled ? (
                <button
                  type="button"
                  className="cx-btn-secondary"
                  onClick={() => openAssistant("footer")}
                >
                  <MessageSquare className="h-4 w-4" aria-hidden />
                  Ask the assistant
                </button>
              ) : (
                <a href="mailto:contact@cyryxlabs.com" className="cx-btn-secondary">
                  Email us
                </a>
              )}
            </div>
          </div>
        ) : null}

        <div className="ft-top">
          <p className="ft-statement" data-ft-in>
            AI that works.
            <span> People who answer for it.</span>
          </p>
          <div className="ft-top-acts" data-ft-in>
            {showCtaBand ? null : (
              <a
                href={startHref}
                className="cx-btn-primary"
                onClick={() =>
                  trackCta({ cta: "start_project", section: "footer", href: startHref })
                }
              >
                {PRIMARY_NAVIGATION_CTA.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            )}
            <FooterLink item={CONTACT[0]} className="ft-mail" />
          </div>
        </div>

        <div className="ft-grid">
          <div className="ft-brand" data-ft-in>
            <CyryxLockup className="h-8" />
            <p>
              AI products, workflow automation and system integration, plus applied research. Cyryx
              Labs LLC.
            </p>
            <div className="ft-brand-end">
              <ul className="ft-contact" aria-label="Other contacts">
                {CONTACT.slice(1).map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
              <ul className="flex gap-3" aria-label="Cyryx Labs on social media">
                <li>
                  <a
                    href="https://x.com/cyryxlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cx-footer-social"
                    aria-label="Cyryx Labs on X (opens in a new tab)"
                  >
                    <XMark className="h-4 w-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="ft-nav">
            {PRIMARY_NAVIGATION.map((group, index) => (
              <nav
                key={group.id}
                aria-label={group.label}
                className={cn("ft-col", group.id === "solutions" && "ft-col--wide")}
                data-ft-in
                style={{ "--d": `${80 + index * 60}ms` } as React.CSSProperties}
              >
                <p className="ft-col-title">{group.label}</p>
                <ul>
                  {group.children.map((item) => (
                    <li key={`${item.label}-${item.hash ?? ""}`}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="ft-mark" aria-hidden="true">
          <img
            src={wordmarkLarge}
            alt=""
            width={1200}
            height={296}
            loading="lazy"
            decoding="async"
          />
          <span
            className="ft-mark-sheen"
            style={{ "--wm": `url(${wordmarkLarge})` } as React.CSSProperties}
          />
        </div>

        <div className="ft-legal">
          <p>&copy; {year} Cyryx Labs LLC. All rights reserved.</p>
          <div className="ft-legal-links">
            <ul>
              {LEGAL.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} className="text-xs" />
                </li>
              ))}
            </ul>
            <button type="button" onClick={scrollTop} className="ft-top-btn">
              Top of page <ArrowUp className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Arrival motion: columns rise in, the large wordmark lifts out of the floor
 * as the footer scrolls into view and a sheen crosses it. Everything is
 * visible without JavaScript; reduced motion and the low-performance path
 * never arm the hidden states.
 */
function useFooterMotion(pathname: string) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const footer = ref.current;
    if (!footer) return;
    const root = document.documentElement;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.classList.contains("cx-low-perf") ||
      !("IntersectionObserver" in window);
    if (still) {
      footer.classList.add("is-in");
      return;
    }
    footer.classList.add("ft-js");
    const items = Array.from(footer.querySelectorAll<HTMLElement>("[data-ft-in]"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );
    items.forEach((el) => io.observe(el));
    const mark = footer.querySelector<HTMLElement>(".ft-mark");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!mark) return;
      const rect = mark.getBoundingClientRect();
      const vh = window.innerHeight;
      const atEnd = window.scrollY + vh >= root.scrollHeight - 4;
      const progress = atEnd
        ? 1
        : Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh * 0.15)));
      mark.style.setProperty("--fp", progress.toFixed(3));
      items.forEach((el) => {
        if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < vh) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      footer.classList.remove("ft-js");
    };
  }, [pathname]);
  return ref;
}
