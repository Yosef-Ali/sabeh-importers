"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile-only bottom tab bar — Sabeh app-shell pattern from the
 * Sabeh Mobile Flow design. 5 tabs: Home, Search, Post (elevated gold
 * FAB), Messages, Profile. Active tab gets a gold underline + navy text.
 *
 * Hidden ≥ md breakpoint (`md:hidden`). Pages that mount this need
 * `pb-16` on their main content so it doesn't underlap the bar.
 */
type Tab = {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  /** Render as elevated gold FAB in the center slot. */
  special?: boolean;
  /** Section path prefix for active-state matching. */
  match?: string | string[];
};

const TABS: Tab[] = [
  { id: "home", label: "Home", href: "/", icon: Home, match: "/" },
  { id: "search", label: "Search", href: "/search", icon: Search, match: ["/search", "/category", "/listings"] },
  { id: "post", label: "Post", href: "/dashboard/marketplace/create", icon: Plus, special: true },
  { id: "messages", label: "Messages", href: "/dashboard/messages", icon: MessageSquare, match: "/dashboard/messages" },
  { id: "profile", label: "Profile", href: "/dashboard", icon: User, match: ["/dashboard"] },
];

function isActive(pathname: string, tab: Tab): boolean {
  if (!tab.match) return false;
  const matches = Array.isArray(tab.match) ? tab.match : [tab.match];
  return matches.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
}

export function MobileBottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-background border-t border-border flex items-center"
      aria-label="Primary mobile navigation"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(pathname, tab);

        if (tab.special) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex-1 h-full flex flex-col items-center justify-center"
              aria-label={tab.label}
            >
              <span className="-mt-5 flex h-12 w-12 items-center justify-center bg-[#FFD700] text-[#0A192F] shadow-hard-navy">
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                {tab.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex-1 h-full flex flex-col items-center justify-center gap-0.5 relative transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
            <span className="font-mono text-[8px] font-bold uppercase tracking-widest">
              {tab.label}
            </span>
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-[#FFD700]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
