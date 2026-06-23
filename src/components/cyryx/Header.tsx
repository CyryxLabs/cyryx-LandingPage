import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { CyryxMark, CyryxWordmark } from "./primitives/CyryxMark";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "#overview" },
  { label: "Systems", href: "#systems" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Command", href: "#command" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "Resources", href: "#resources" },
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "backdrop-blur-xl bg-[color-mix(in_oklab,var(--onyx)_82%,transparent)] border-b border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] shadow-[0_1px_0_0_color-mix(in_oklab,var(--accent-glow)_12%,transparent)]"
            : "backdrop-blur-md bg-[color-mix(in_oklab,var(--onyx)_50%,transparent)] border-b border-[color-mix(in_oklab,var(--silver)_6%,transparent)]",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-10">
          <a href="#top" className="flex items-center gap-2.5 min-w-0">
            <CyryxMark size={32} className="shrink-0 drop-shadow-[0_0_12px_color-mix(in_oklab,var(--accent-glow)_30%,transparent)]" />
            <CyryxWordmark />
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
            className="hidden lg:inline-flex items-center gap-2 h-11 px-5 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] text-[var(--silver)] hud-label hover:bg-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)] hover:shadow-[var(--shadow-glow-teal)] transition-all"
          >
            Schedule a Briefing
            <span aria-hidden className="text-[var(--accent-glow)]">→</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] text-[var(--silver)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)]"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV} />
    </>
  );
}