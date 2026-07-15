import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CyryxWordmark } from "./primitives/CyryxMark";
import { MobileMenu } from "./MobileMenu";
import { HeaderDropdown } from "./HeaderDropdown";
import { cn } from "@/lib/utils";
import { trackCta } from "@/lib/track-cta";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import {
  PRIMARY_NAVIGATION,
  PRIMARY_NAVIGATION_CTA,
  getActiveNavigationGroup,
  isPrimaryNavigationCTAActive,
  NavigationGroupId,
} from "@/lib/navigation";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";


export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string>("");
  const { location } = useRouterState();
  const pathname = location.pathname;
  const activeGroupId = getActiveNavigationGroup(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Explicit route-change closing
  useEffect(() => {
    setOpenGroup("");


  }, [pathname]);

  const handleClose = () => setOpenGroup("");

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
            className="hidden lg:flex items-center"
            aria-label="Primary"
          >
            <NavigationMenuPrimitive.Root value={openGroup} onValueChange={setOpenGroup} className="relative z-10 flex max-w-max flex-1 items-center justify-center">
              <NavigationMenuList className="gap-7 xl:gap-8">
                {PRIMARY_NAVIGATION.map((group) => (
                  <HeaderDropdown
                    key={group.id}
                    group={group}
                    isActive={activeGroupId === group.id}
                    onClose={handleClose}
                  />
                ))}
              </NavigationMenuList>
              <NavigationMenuViewport />
            </NavigationMenuPrimitive.Root>
          </nav>


          <Link
            to={PRIMARY_NAVIGATION_CTA.href}
            aria-label={PRIMARY_NAVIGATION_CTA.label}
            onClick={() => trackCta({ cta: "start_project", section: "header", href: PRIMARY_NAVIGATION_CTA.href })}
            className={cn(
              "cx-btn cx-liquid-glass hidden lg:inline-flex items-center gap-2 h-11 px-5 rounded-md hud-label text-[var(--silver)] transition-colors relative",
              isPrimaryNavigationCTAActive(pathname)
                ? "after:absolute after:left-2 after:right-2 after:-bottom-1 after:h-px after:bg-[var(--accent-glow)] after:shadow-[0_0_6px_var(--accent-glow)]"
                : "hover:text-white"
            )}
          >
            {PRIMARY_NAVIGATION_CTA.label}
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

      {/* MobileMenu remains restricted from modification in Phase 4C */}
      <MobileMenu 
        open={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        links={[
          { label: "Products", href: "/products" },
          { label: "Solutions", href: "/solutions" },
          { label: "Research", href: "/research" },
          { label: "Company", href: "/company" }
        ]} 
      />
    </>
  );
}
