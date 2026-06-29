import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CyryxWordmark } from "./primitives/CyryxMark";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { trackCta } from "@/lib/track-cta";
import { hasNewPublication } from "@/data/publications";

const NAV = [
  { label: "MAAX Studio", href: "/products/maax-studio" },
  { label: "Solutions", href: "/solutions" },
  { label: "Research", href: "/research" },
  { label: "Answers", href: "/answers" },
  { label: "Company", href: "/company" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerCta = getCopy(useCopyVariant()).header.cta;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "cx-liquid-glass fixed inset-x-0 top-0 z-50 rounded-none border-x-0 border-t-0 transition-all duration-300",
          scrolled
            ? "shadow-[0_1px_0_0_color-mix(in_oklab,var(--accent-glow)_18%,transparent)]"
            : "shadow-none",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-24 lg:px-10">
          <Link
            to="/"
            className="-mx-1 inline-flex h-12 min-w-0 shrink-0 items-center px-1 lg:h-16"
            aria-label="Cyryx Labs — home"
          >
            <CyryxWordmark priority className="h-10 lg:h-14" />
          </Link>

          <nav
            className="hidden lg:flex items-center gap-7 xl:gap-8"
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                activeOptions={{ exact: item.href === "/" }}
                activeProps={{
                  className:
                    "hud-label text-[0.7rem] tracking-[0.18em] text-[var(--silver)] transition-colors relative py-2 whitespace-nowrap inline-flex items-center gap-1.5 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-[var(--accent-glow)] after:shadow-[0_0_6px_var(--accent-glow)]",
                }}
                inactiveProps={{
                  className:
                    "hud-label text-[0.7rem] tracking-[0.18em] text-[var(--silver-dim)] hover:text-[var(--silver)] transition-colors relative py-2 whitespace-nowrap inline-flex items-center gap-1.5",
                }}
              >
                {item.label}
                {item.label === "Research" && hasNewPublication() && (
                  <span
                    aria-label="New publication"
                    title="New publication"
                    className="h-1.5 w-1.5 rounded-full bg-[#0E5B57] shadow-[0_0_6px_#0E5B57]"
                  />
                )}
              </Link>
            ))}
          </nav>

          <Link
            to="/contact"
            aria-label={headerCta}
            onClick={() => trackCta({ cta: "start_project", section: "header", href: "/contact" })}
            className="cx-btn cx-liquid-glass hidden lg:inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
          >
            {headerCta}
            <span aria-hidden className="text-[var(--accent-glow)]">→</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="cx-btn cx-liquid-glass lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--silver)]"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV} />
    </>
  );
}