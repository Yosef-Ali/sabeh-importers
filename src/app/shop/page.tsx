"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Star, Filter, ChevronDown, Menu, X } from "lucide-react";
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
    image: "/frames/byd_050.jpg", // Reusing an existing frame as placeholder
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
    <div className="min-h-screen bg-slate-50 font-inter text-slate-900">
      {/* --- Navbar --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 items-center justify-center rounded bg-emerald-700 px-2">
              <span className="font-noto font-bold text-white">ሳቤህ</span>
            </div>
            <span className="hidden font-bold tracking-tight text-slate-900 sm:inline-block">
              SABEH IMPORTERS
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden max-w-md flex-1 px-8 md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search products, parts, or equipment..."
                className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-emerald-600"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5 text-slate-700" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                2
              </span>
            </Button>
            <Button className="hidden bg-emerald-700 hover:bg-emerald-800 md:inline-flex">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <div className="relative bg-gradient-to-r from-emerald-900 to-emerald-600 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-yellow-400 text-slate-900 hover:bg-yellow-500">
              New Arrival
            </Badge>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              BYD Atto 3 Available Now
            </h1>
            <p className="mb-8 text-lg text-emerald-100">
              Experience the future of driving with Ethiopia's premier electric SUV. 
              Zero emissions, maximum performance.
            </p>
            <Button size="lg" className="bg-white text-emerald-900 hover:bg-slate-100">
              View Details
            </Button>
          </div>
        </div>
        {/* Abstract Pattern Overlay */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* --- Sidebar Filters (Desktop) --- */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <div key={cat} className="flex items-center gap-2">
                      <Checkbox id={`cat-${cat}`} />
                      <label htmlFor={`cat-${cat}`} className="text-sm text-slate-600">
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              {/* Price Range */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">Price Range</h3>
                <Slider defaultValue={[25]} max={100} step={1} className="mb-4" />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>0 ETB</span>
                  <span>Max</span>
                </div>
              </div>
              <Separator />
              {/* Brands */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">Brands</h3>
                <div className="space-y-2">
                  {BRANDS.map((brand) => (
                    <div key={brand} className="flex items-center gap-2">
                      <Checkbox id={`brand-${brand}`} />
                      <label htmlFor={`brand-${brand}`} className="text-sm text-slate-600">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* --- Mobile Filter Toggle --- */}
          <div className="flex items-center justify-between lg:hidden">
            <Button variant="outline" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            <span className="text-sm text-slate-500">{PRODUCTS.length} Results</span>
          </div>

          {/* --- Product Grid --- */}
          <div className="flex-1">
            {/* Sort & Count (Desktop) */}
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <span className="text-sm text-slate-500">{PRODUCTS.length} Results</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
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
                <Card key={product.id} className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                        No Image
                      </div>
                    )}
                    {product.isNew && (
                      <Badge className="absolute left-2 top-2 bg-yellow-400 text-black hover:bg-yellow-500">
                        New
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <div className="mb-1 text-xs font-medium text-emerald-600">
                      {product.category}
                    </div>
                    <h3 className="font-bold text-slate-900">{product.title}</h3>
                    <p className="font-noto text-sm text-slate-500">{product.titleAm}</p>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-slate-500">(24)</span>
                    </div>
                    <div className="mt-4 text-lg font-bold text-slate-900">
                      {product.price}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800">
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            © 2026 Sabeh Importers. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
