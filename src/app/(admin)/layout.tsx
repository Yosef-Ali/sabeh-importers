"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Users,
  Flag,
  Settings,
  LogOut,
  BadgeCheck,
  Star,
  ChevronLeft,
  Menu,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminHeader } from "@/components/admin/header";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
  },
  {
    title: "Listings",
    href: "/admin/listings",
    icon: <Package className="h-[18px] w-[18px]" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-[18px] w-[18px]" />,
  },
  {
    title: "Verifications",
    href: "/admin/verifications",
    icon: <BadgeCheck className="h-[18px] w-[18px]" />,
  },
  {
    title: "Promotions",
    href: "/admin/promotions",
    icon: <Star className="h-[18px] w-[18px]" />,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: <Flag className="h-[18px] w-[18px]" />,
  },
  {
    title: "Plans",
    href: "/admin/plans",
    icon: <CreditCard className="h-[18px] w-[18px]" />,
  },
  {
    title: "AI Generator",
    href: "/admin/ai-generator",
    icon: <Sparkles className="h-[18px] w-[18px]" />,
  },
];

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-4 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#0A192F] border border-accent/30 flex-shrink-0">
            <Image src="/Sabeh_Logo_Icon.svg" alt="Sabeh" width={28} height={28} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-semibold leading-tight text-foreground">
                Admin Panel
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Sabeh Market
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
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
              {!isCollapsed && item.title}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + Exit */}
      <div className="flex-shrink-0 border-t border-border px-3 py-3 space-y-0.5">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Settings className="h-[18px] w-[18px] flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={() => (window.location.href = "/dashboard")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {!isCollapsed && <span>Exit Admin</span>}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background antialiased">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen border-r border-border bg-card transition-all duration-300 lg:block",
          isCollapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-[72px] z-50 h-6 w-6 rounded-full border border-border bg-background shadow-sm hover:shadow-md"
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
            className="fixed left-4 top-4 z-50 lg:hidden h-9 w-9 bg-card border border-border shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent isCollapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <AdminHeader isCollapsed={isCollapsed} />
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          isCollapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"
        )}
      >
        <div className="container mx-auto p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
