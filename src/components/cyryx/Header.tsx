import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { CyryxWordmark } from "./primitives/CyryxMark";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Products", href: "#products" },
  { label: "Solutions", href: "#solutions" },
  { label: "Applied AI Lab", href: "#applied-lab" },
  { label: "MAAX Studio", href: "#maax" },
  { label: "Company", href: "/company" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-10">
          <a
            href="#top"
            className="inline-flex min-h-11 items-center min-w-0 -mx-1 px-1"
            aria-label="Cyryx Labs — home"
          >
            <CyryxWordmark priority className="h-8 lg:h-9 drop-shadow-[0_0_12px_color-mix(in_oklab,var(--accent-glow)_25%,transparent)]" />
          </a>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hud-label text-[var(--silver-dim)] hover:text-[var(--silver)] transition-colors relative py-2"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#cta"
            className="cx-btn cx-liquid-glass hidden lg:inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
          >
            Start a Project
            <span aria-hidden className="text-[var(--accent-glow)]">→</span>
          </a>

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