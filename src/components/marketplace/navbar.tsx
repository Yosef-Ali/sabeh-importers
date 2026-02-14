"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Plus, User, MessageSquare, Menu, Heart, ChevronDown,
  Car, Home, Smartphone, Briefcase, Wrench, Shirt, Sofa, Factory, X,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

const CATEGORIES = [
  { href: "/search?category=motors", label: "Motors", labelAm: "ተሽከርካሪ", icon: Car, materialIcon: "directions_car" },
  { href: "/search?category=property", label: "Property", labelAm: "ንብረት", icon: Home, materialIcon: "home" },
  { href: "/search?category=business-for-sale", label: "Business", labelAm: "ንግድ", icon: Briefcase, materialIcon: "business_center" },
  { href: "/search?category=electronics", label: "Electronics", labelAm: "ኤሌክትሮኒክስ", icon: Smartphone, materialIcon: "devices" },
  { href: "/search?category=fashion-beauty", label: "Fashion", labelAm: "ፋሽን", icon: Shirt, materialIcon: "diamond" },
  { href: "/search?category=furniture-home", label: "Furniture", labelAm: "የቤት ዕቃ", icon: Sofa, materialIcon: "chair" },
  { href: "/search?category=services", label: "Services", labelAm: "አገልግሎት", icon: Wrench, materialIcon: "build" },
  { href: "/search?category=industrial-equipment", label: "Industrial", labelAm: "ኢንዱስትሪ", icon: Factory, materialIcon: "precision_manufacturing" },
];

function NavbarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      <Input
        type="search"
        placeholder="Find vessels, machinery, or equipment..."
        className="w-full rounded-none pl-10 pr-4 h-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 hover:border-accent/30 focus-visible:border-accent/50 focus-visible:ring-0 transition-all duration-200 font-mono text-xs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50">
      <nav className="bg-[#0A192F] text-white border-b border-white/10 h-20 flex items-center px-4 md:px-8 justify-between sticky top-0 z-50">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A192F] border border-accent/30 flex items-center justify-center rounded-none flex-shrink-0">
              <Image src="/Sabeh_Logo_Icon.svg" alt="Sabeh" width={36} height={36} />
            </div>
            <span className="text-white text-2xl font-display font-bold tracking-tighter uppercase">SABEH</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex gap-10 text-white/80 uppercase font-mono text-sm font-bold tracking-widest">
            {CATEGORIES.slice(0, 4).map((cat, idx) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <span className="text-accent/50 mr-1">0{idx + 1}.</span>
                {cat.label}
              </Link>
            ))}
            <Link
              href="/guide"
              className="hover:text-accent transition-colors flex items-center gap-2"
            >
              <span className="text-accent/50 mr-1">05.</span>
              Guide
            </Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Language Toggle */}
          <div className="hidden md:flex items-center gap-2 text-white/90 text-[10px] tracking-widest font-bold border-r border-white/20 pr-6">
            <span className="material-symbols-outlined text-lg">language</span>
            EN | አማ
          </div>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Sign In */}
          <Link href="/dashboard" className="hidden sm:block text-white/90 uppercase font-mono text-xs font-bold tracking-widest hover:text-accent transition-colors">
            Command
          </Link>

          {/* Place an Ad CTA */}
          <Link href="/listings/create">
            <button className="bg-accent text-primary px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider shadow-hard-navy hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 active:scale-95">
              POST LISTING
            </button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 text-white/80 hover:text-white hover:bg-white/10 rounded-full">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 bg-background border-primary/10">
              <div className="flex flex-col h-full">
                <div className="p-6 flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-[#0A192F] border border-accent/30 flex items-center justify-center rounded-none flex-shrink-0">
                      <Image src="/Sabeh_Logo_Icon.svg" alt="Sabeh" width={32} height={32} />
                    </div>
                    <span className="text-foreground text-xl font-display font-bold tracking-tighter uppercase">SABEH</span>
                  </Link>
                  <ModeToggle />
                </div>
                
                <div className="flex-1 overflow-y-auto pt-2">
                  <div className="px-6 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">Categories</p>
                    <nav className="space-y-1">
                      {CATEGORIES.map((cat) => (
                        <SheetClose asChild key={cat.href}>
                          <Link href={cat.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary">
                            <span className="material-symbols-outlined text-lg text-primary/60">{cat.materialIcon}</span>
                            <span>{cat.label}</span>
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </div>
                  
                  <Separator className="mx-6 bg-border/50" />

                  <div className="px-6 mt-4 mb-4">
                    <SheetClose asChild>
                      <Link href="/guide" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary">
                        <span className="material-symbols-outlined text-lg text-primary/60">help_outline</span>
                        <span>Platform Guide</span>
                      </Link>
                    </SheetClose>
                  </div>

                  <Separator className="mx-6 bg-border/50" />

                  <div className="px-6 mt-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">Account</p>
                    <nav className="space-y-1">
                      {[
                        { href: "/dashboard/favorites", icon: "favorite", label: "Favorites" },
                        { href: "/dashboard/messages", icon: "chat", label: "Messages" },
                        { href: "/dashboard", icon: "person", label: "My Account" },
                      ].map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary">
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </div>
                </div>

                <div className="p-6 border-t border-border/50">
                  <SheetClose asChild>
                    <Link href="/listings/create" className="w-full">
                      <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold tracking-widest uppercase text-xs shadow-lg hover:shadow-primary/20 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        Place an Ad
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
