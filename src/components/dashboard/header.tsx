"use client";

import React from "react";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Globe,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { logoutAction } from "@/lib/actions/auth";

interface HeaderProps {
  isCollapsed: boolean;
}

export function Header({ isCollapsed }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [language, setLanguage] = React.useState<"en" | "am">("en");
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    logout();
    await logoutAction();
  }

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6",
        isCollapsed ? "lg:left-[68px]" : "lg:left-[240px]",
        "left-0"
      )}
    >
      {/* ── Search ── */}
      <div className="flex items-center gap-4 pl-12 lg:pl-0">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {/* Input inherits rounded-none from updated input.tsx
              Previously this would have been rounded-full via a custom class — now system-correct */}
          <Input
            type="search"
            placeholder={language === "en" ? "Search products, orders..." : "ፈልግ..."}
            className="w-[300px] pl-9 rounded-none"
          />
        </div>
      </div>

      {/* ── Right Side Actions ── */}
      <div className="flex items-center gap-2">

        {/* Language Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Ghost icon button: rounded-none */}
            <Button variant="ghost" size="icon" className="rounded-none">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-none border-border">
            <DropdownMenuItem onClick={() => setLanguage("en")}>
              <span className={cn(language === "en" && "font-bold text-primary")}>English</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("am")}>
              <span className={cn("font-amharic", language === "am" && "font-bold text-primary")}>
                አማርኛ
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-none">
              <Bell className="h-5 w-5" />
              {/* Notification dot: rounded-none font-mono (was rounded-full) */}
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-none bg-destructive font-mono text-[9px] font-bold text-destructive-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] rounded-none border-border">
            <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-none">
                <div className="flex w-full items-center justify-between">
                  <span className="font-display font-bold text-sm">New Order</span>
                  {/* Badge inherits rounded-none from updated badge.tsx */}
                  <Badge variant="success">New</Badge>
                </div>
                <span className="text-xs font-body text-muted-foreground">
                  Order #SAB-2601-0042 received
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">2 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-none">
                <div className="flex w-full items-center justify-between">
                  <span className="font-display font-bold text-sm">Low Stock Alert</span>
                  <Badge variant="warning">Alert</Badge>
                </div>
                <span className="text-xs font-body text-muted-foreground">
                  5 products below minimum stock
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">1 hour ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-none">
                <span className="font-display font-bold text-sm">WhatsApp Message</span>
                <span className="text-xs font-body text-muted-foreground">
                  New message from +251 91 234 5678
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">3 hours ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center font-mono text-[10px] uppercase tracking-widest text-primary rounded-none">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Avatar trigger: rounded-none border-accent (was rounded-full) */}
            <Button variant="ghost" className="relative h-8 w-8 rounded-none border border-accent/50 p-0">
              <Avatar className="h-8 w-8 rounded-none">
                {user?.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} className="rounded-none" />
                )}
                <AvatarFallback className="rounded-none bg-[#0A192F] text-white font-display font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-none border-border">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="font-display font-bold text-sm leading-none">
                  {user?.name ?? "Loading…"}
                </p>
                <p className="font-body text-xs leading-none text-muted-foreground">
                  {user?.email ?? ""}
                </p>
                {user?.role && (
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    {user.role}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
              <DropdownMenuItem
                className="rounded-none font-body text-sm"
                onClick={() => router.push("/admin")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="rounded-none font-body text-sm"
              onClick={() => router.push("/dashboard/settings")}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-none font-body text-sm"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="rounded-none font-body text-sm text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
