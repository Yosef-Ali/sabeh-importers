
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const CONDITIONS = [
  { label: "New", value: "NEW" },
  { label: "Like New", value: "LIKE_NEW" },
  { label: "Used (Good)", value: "USED_GOOD" },
  { label: "Used (Fair)", value: "USED_FAIR" },
  { label: "For Parts", value: "FOR_PARTS" },
];

interface FiltersProps {
  categories: {
    id: string;
    name: string;
    listingCount: number | null;
  }[];
}

export function Filters({ categories }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "all");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (condition && condition !== "all") params.set("condition", condition);
    else params.delete("condition");

    if (categoryId && categoryId !== "all") params.set("categoryId", categoryId);
    else params.delete("categoryId");

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/search");
    setMinPrice("");
    setMaxPrice("");
    setCondition("");
    setCategoryId("all");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest font-montserrat">Filters</h3>
        <Button variant="link" className="h-auto p-0 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60 hover:text-primary no-underline" onClick={clearFilters}>
          Clear all
        </Button>
      </div>
      <Separator />

      {/* Categories */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</h4>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="bg-background border-border focus:ring-primary/20">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name} {cat.listingCount ? <span className="font-montserrat tabular-nums">({cat.listingCount})</span> : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price Range (ETB)</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="bg-background border-border focus:ring-primary/20"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-muted-foreground/30">-</span>
          <Input
            type="number"
            placeholder="Max"
            className="bg-background border-border focus:ring-primary/20"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      <Separator />

      {/* Condition */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Condition</h4>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger className="bg-background border-border focus:ring-primary/20">
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Any Condition</SelectItem>
            {CONDITIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />

      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest h-11" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
