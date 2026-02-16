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

interface AdminHeaderProps {
  isCollapsed: boolean;
}

export function AdminHeader({ isCollapsed }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [language, setLanguage] = React.useState<"en" | "am">("en");
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    logout(); // clear Zustand + localStorage
    await logoutAction(); // clear httpOnly cookie + redirect
  }

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6",
        isCollapsed ? "lg:left-[68px]" : "lg:left-[240px]",
        "left-0"
      )}
    >
      {/* Search */}
      <div className="flex items-center gap-4 pl-12 lg:pl-0">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={
              language === "en" ? "Search users, listings..." : "ፈልግ..."
            }
            className="w-[300px] pl-9"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("en")}>
              <span className={cn(language === "en" && "font-semibold")}>
                English
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("am")}>
              <span
                className={cn(
                  "font-amharic",
                  language === "am" && "font-semibold"
                )}
              >
                አማርኛ
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <DropdownMenuLabel>Admin Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium">New User Verification</span>
                  <Badge variant="warning" className="text-[10px]">
                    Action Required
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  Abebe K. uploaded ID documents
                </span>
                <span className="text-xs text-muted-foreground">
                  10 minutes ago
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium">Listing Reported</span>
                  <Badge variant="destructive" className="text-[10px]">
                    Urgent
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  "Toyota Corolla" reported as spam
                </span>
                <span className="text-xs text-muted-foreground">
                  1 hour ago
                </span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() ?? "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name ?? "Admin"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? ""}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {user?.role ?? "ADMIN"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>User Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
