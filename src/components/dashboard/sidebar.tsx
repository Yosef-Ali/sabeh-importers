"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageCircle,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth";
import { logoutAction } from "@/lib/actions/auth";

// ── Nav structure: 3 sections, 6 items total ──────────────────────────────────
interface NavItem {
  title: string;
  titleAmharic: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Sell",
    items: [
      {
        title: "Overview",
        titleAmharic: "አጠቃላይ",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
      },
      {
        title: "My Listings",
        titleAmharic: "የእኔ ማስታወቂያዎች",
        href: "/my-listings",
        icon: <Package className="h-[18px] w-[18px]" />,
      },
    ],
  },
  {
    label: "Discover",
    items: [
      {
        title: "Browse Market",
        titleAmharic: "ገበያ ዳስስ",
        href: "/",
        icon: <ShoppingBag className="h-[18px] w-[18px]" />,
      },
      {
        title: "Saved",
        titleAmharic: "የተቀመጡ",
        href: "/wishlist",
        icon: <Heart className="h-[18px] w-[18px]" />,
      },
    ],
  },
  {
    label: "Inbox",
    items: [
      {
        title: "Messages",
        titleAmharic: "መልዕክቶች",
        href: "/messages",
        icon: <MessageCircle className="h-[18px] w-[18px]" />,
        badge: 3,
      },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  async function handleLogout() {
    logout();
    await logoutAction();
  }

  return (
    <div className="flex h-full flex-col">
      {/* ── Logo ── */}
      <div className="flex h-16 items-center border-b px-4 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#0A192F] border border-accent/30 flex-shrink-0">
            <Image src="/Sabeh_Logo_Icon.svg" alt="Sabeh" width={28} height={28} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-semibold leading-tight">Sabeh</span>
              <span className="text-[10px] text-muted-foreground font-amharic leading-tight">
                ሳቤህ ኢምፖርተርስ
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Post a Listing CTA ── */}
      <div className={cn("px-3 pt-4 pb-2 flex-shrink-0", isCollapsed && "px-2")}>
        <Link href="/marketplace/create">
          <Button
            size="sm"
            className={cn(
              "w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 transition-all",
              isCollapsed && "px-0 justify-center"
            )}
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Post a Listing</span>}
          </Button>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            {/* Section label */}
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {section.label}
              </p>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <span className={cn(isActive && "text-primary")}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge && (
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider between sections */}
            {!isCollapsed && (
              <div className="mt-3 border-t border-border/40" />
            )}
          </div>
        ))}
      </nav>

      {/* ── Bottom: Settings + Logout ── */}
      <div className="flex-shrink-0 border-t px-3 py-3 space-y-0.5">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Settings className="h-[18px] w-[18px] flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen border-r bg-card transition-all duration-300 lg:block",
          isCollapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-[72px] z-50 h-6 w-6 rounded-full border bg-background shadow-sm hover:shadow-md"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 lg:hidden h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent isCollapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}
