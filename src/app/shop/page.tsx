"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

// --- Mock Data ---
const PRODUCTS = [
  {
    id: 1,
    title: "BYD Atto 3 (2024)",
    titleAm: "ቢዋይዲ አቶ 3 (2024)",
    price: "4,500,000 ETB",
    category: "Vehicles",
    rating: 5,
    image: "/frames/byd_050.jpg",
    isNew: true,
  },
  {
    id: 2,
    title: "Toyota Hilux Revo",
    titleAm: "ቶዮታ ሃይሉክስ ሬቮ",
    price: "8,200,000 ETB",
    category: "Vehicles",
    rating: 4,
    image: null,
  },
  {
    id: 3,
    title: "Komatsu Excavator PC200",
    titleAm: "ኮማትሱ ኤክስካቬተር",
    price: "15,000,000 ETB",
    category: "Heavy Machinery",
    rating: 5,
    image: null,
  },
  {
    id: 4,
    title: "Industrial Generator 500kVA",
    titleAm: "የኢንዱስትሪ ጄኔሬተር",
    price: "2,100,000 ETB",
    category: "Industrial",
    rating: 4,
    image: null,
  },
  {
    id: 5,
    title: "Rebar Steel (12mm) - Ton",
    titleAm: "ብረት (12ሚሜ)",
    price: "85,000 ETB",
    category: "Construction",
    rating: 3,
    image: null,
  },
  {
    id: 6,
    title: "Solar Panel Kit (5kW)",
    titleAm: "የፀሐይ ኃይል ፓነል",
    price: "350,000 ETB",
    category: "Energy",
    rating: 5,
    image: null,
  },
];

const CATEGORIES = ["Vehicles", "Heavy Machinery", "Industrial", "Construction", "Energy"];
const BRANDS = ["BYD", "Toyota", "Komatsu", "CAT", "Generic"];

export default function ShopPage() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      {/* ── COMMAND HEADER ── */}
      <header className="sticky top-0 z-50 w-full bg-[#0A192F] border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo: gold square w/ navy Amharic per DESIGN.md */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#FFD700]">
              <span className="font-amharic font-bold text-[#0A192F] text-sm">ሳቤህ</span>
            </div>
            <span className="hidden font-display font-bold uppercase tracking-tight text-white sm:inline-block">
              SABEH IMPORTERS
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden max-w-md flex-1 px-8 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                type="search"
                placeholder="Search products, parts, or equipment..."
                className="w-full rounded-none bg-white/5 border-white/20 text-white pl-9 placeholder:text-white/50 focus-visible:border-[#FFD700] focus-visible:bg-white/10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-[#FFD700]">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-destructive text-[9px] font-mono font-bold text-destructive-foreground">
                2
              </span>
            </Button>
            <Button className="hidden md:inline-flex">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO — blueprint dot grid + navy/gold ── */}
      <section
        className="relative bg-[#0A192F] py-24 text-white overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,215,0,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Eyebrow command label */}
            <div className="mb-6 inline-flex items-center gap-2 border border-[#FFD700]/40 bg-transparent px-4 py-1.5">
              <span className="h-1.5 w-1.5 bg-[#FFD700]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFD700]">
                01 / New Arrival
              </span>
            </div>
            {/* Headline */}
            <h1 className="mb-6 font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl">
              BYD Atto 3<br />
              <span className="text-[#FFD700]">Available Now</span>
            </h1>
            <p className="mb-10 max-w-xl font-body text-base leading-relaxed text-white/70">
              Ethiopia's premier electric SUV. Verified import, authority-grade
              dealer network, full-service warranty.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg">
                View Specifications
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                Request Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── Sidebar Filters (Desktop) ── */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-28 border border-border bg-card p-6 shadow-hard">
              <div className="mb-6">
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Categories
                </h3>
                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => (
                    <div key={cat} className="flex items-center gap-2.5">
                      <Checkbox id={`cat-${cat}`} className="rounded-none" />
                      <label
                        htmlFor={`cat-${cat}`}
                        className="font-body text-sm text-foreground cursor-pointer"
                      >
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="mb-6">
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Price Range
                </h3>
                <Slider defaultValue={[25]} max={100} step={1} className="mb-3" />
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>0 ETB</span>
                  <span>Max</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Brands
                </h3>
                <div className="space-y-2.5">
                  {BRANDS.map((brand) => (
                    <div key={brand} className="flex items-center gap-2.5">
                      <Checkbox id={`brand-${brand}`} className="rounded-none" />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="font-body text-sm text-foreground cursor-pointer"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Mobile Filter Toggle ── */}
          <div className="flex items-center justify-between lg:hidden">
            <Button variant="outline" size="sm" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {PRODUCTS.length} Results
            </span>
          </div>

          {/* ── Product Grid ── */}
          <div className="flex-1">
            {/* Sort & Count (Desktop) */}
            <div className="mb-8 hidden items-center justify-between border-b border-border pb-4 lg:flex">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Inventory
                </span>
                <p className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                  {PRODUCTS.length} Results
                </p>
              </div>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          No Image
                        </span>
                      </div>
                    )}
                    {product.isNew && (
                      <Badge variant="gold" className="absolute left-3 top-3">
                        New
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="p-5 pb-0">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD700] mb-2">
                      {product.category}
                    </div>
                    <h3 className="font-display font-bold uppercase tracking-tight text-foreground leading-tight">
                      {product.title}
                    </h3>
                    <p className="font-amharic text-sm text-muted-foreground mt-1">
                      {product.titleAm}
                    </p>
                  </CardHeader>
                  <CardContent className="p-5 pt-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < product.rating
                              ? "fill-[#FFD700] text-[#FFD700]"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        (24)
                      </span>
                    </div>
                    <div className="mt-4 font-display text-xl font-bold tracking-tight text-foreground">
                      {product.price}
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0">
                    <Button className="w-full">
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0A192F] border-t border-white/10 py-12 text-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center bg-[#FFD700]">
                <span className="font-amharic font-bold text-[#0A192F] text-xs">ሳቤህ</span>
              </div>
              <span className="font-display font-bold uppercase tracking-tight">
                SABEH IMPORTERS
              </span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mt-2">
              © 2026 — Authority Trading. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
