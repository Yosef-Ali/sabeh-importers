"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  Warehouse,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  titleAmharic?: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    titleAmharic: "ዳሽቦርድ",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Products",
    titleAmharic: "ምርቶች",
    href: "/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Inventory",
    titleAmharic: "የእቃ ክምችት",
    href: "/inventory",
    icon: <Warehouse className="h-5 w-5" />,
  },
  {
    title: "Orders",
    titleAmharic: "ትዕዛዞች",
    href: "/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    badge: 5,
  },
  {
    title: "Customers",
    titleAmharic: "ደንበኞች",
    href: "/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Distributors",
    titleAmharic: "አከፋፋዮች",
    href: "/distributors",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    title: "Catalog",
    titleAmharic: "ካታሎግ",
    href: "/catalog",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "WhatsApp",
    titleAmharic: "ዋትስአፕ",
    href: "/whatsapp",
    icon: <MessageCircle className="h-5 w-5" />,
    badge: 12,
  },
  {
    title: "Reports",
    titleAmharic: "ሪፖርቶች",
    href: "/reports",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    titleAmharic: "ቅንብሮች",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ethiopian-green">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Sabeh</span>
              <span className="text-xs text-muted-foreground font-amharic">
                ሳቤህ ኢምፖርተርስ
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2"
                )}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
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
          isCollapsed ? "w-[70px]" : "w-[260px]"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border bg-background shadow-md"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
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
            className="fixed left-4 top-4 z-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <SidebarContent isCollapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}
