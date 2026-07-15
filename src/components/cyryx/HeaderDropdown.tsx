import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  NavigationGroup,
  isNavigationItemActive,
} from "@/lib/navigation";
import { hasNewPublication } from "@/data/publications";

interface HeaderDropdownProps {
  group: NavigationGroup;
  isActive: boolean;
  onClose: () => void;
}

export function HeaderDropdown({ group, isActive, onClose }: HeaderDropdownProps) {
  const { location } = useRouterState();
  const pathname = location.pathname;

  return (
    <NavigationMenuItem value={group.id}>
      <NavigationMenuPrimitive.Trigger


        className={cn(
          "hud-label h-auto bg-transparent p-0 text-[0.7rem] tracking-[0.18em] transition-colors relative py-2 whitespace-nowrap inline-flex items-center gap-1.5 focus:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent outline-none ring-offset-0 focus-visible:ring-0",
          isActive
            ? "text-[var(--silver)] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-[var(--accent-glow)] after:shadow-[0_0_6px_var(--accent-glow)] shadow-none"
            : "text-[var(--silver-dim)] hover:text-[var(--silver)]",
          "motion-reduce:transition-none"
        )}
      >
        {group.label}
        <ChevronDown 
          className="ml-0.5 h-3 w-3 text-[var(--silver-dim)] transition-transform duration-150 group-data-[state=open]:rotate-180 motion-reduce:transition-none motion-reduce:transform-none" 
          aria-hidden="true" 
        />
      </NavigationMenuPrimitive.Trigger>
      
      <NavigationMenuContent className="motion-reduce:animate-none">
        <div className={cn(
          "grid gap-1 p-4 md:w-[240px]",
          group.id === "solutions" && "md:w-[480px] md:grid-cols-2"
        )}>
          {group.children.map((item) => {
            const isCurrent = isNavigationItemActive(pathname, item.href);
            return (
              <NavigationMenuLink key={item.href} asChild>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex min-h-[44px] items-center px-4 rounded-sm transition-colors hud-label text-[0.65rem] tracking-[0.15em] outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-glow)]",
                    isCurrent
                      ? "text-[var(--accent-glow)] bg-[var(--accent-glow)]/5"
                      : "text-[var(--silver-dim)] hover:text-[var(--silver)] hover:bg-[var(--silver)]/5",
                    "motion-reduce:transition-none"
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                  {item.href === "/research" && hasNewPublication() && (
                    <span
                      aria-label="New publication"
                      className="ml-2 h-1.5 w-1.5 rounded-full bg-[#0E5B57] shadow-[0_0_6px_#0E5B57]"
                    />
                  )}
                </Link>
              </NavigationMenuLink>
            );
          })}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

