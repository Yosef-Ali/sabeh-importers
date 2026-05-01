"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const CONDITIONS = [
  { label: "New",         value: "NEW"       },
  { label: "Like New",    value: "LIKE_NEW"  },
  { label: "Used (Good)", value: "USED_GOOD" },
  { label: "Used (Fair)", value: "USED_FAIR" },
  { label: "For Parts",   value: "FOR_PARTS" },
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

  const [minPrice,   setMinPrice]   = useState(searchParams.get("minPrice")   || "");
  const [maxPrice,   setMaxPrice]   = useState(searchParams.get("maxPrice")   || "");
  const [condition,  setCondition]  = useState(searchParams.get("condition")  || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "all");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice)                       params.set("minPrice", minPrice);
    else                                params.delete("minPrice");

    if (maxPrice)                       params.set("maxPrice", maxPrice);
    else                                params.delete("maxPrice");

    if (condition && condition !== "all") params.set("condition", condition);
    else                                  params.delete("condition");

    if (categoryId && categoryId !== "all") params.set("categoryId", categoryId);
    else                                     params.delete("categoryId");

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <Separator />

      {/* ── Category ── */}
      <div className="space-y-4">
        <h4 className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Category
        </h4>
        {/* Select trigger inherits rounded-none from updated select.tsx */}
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="bg-background border-border focus:shadow-hard">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
                {cat.listingCount ? (
                  <span className="font-mono tabular-nums text-muted-foreground ml-1">
                    ({cat.listingCount})
                  </span>
                ) : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* ── Price Range ── */}
      <div className="space-y-4">
        <h4 className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Price Range (ETB)
        </h4>
        {/* Input inherits rounded-none + shadow-hard focus from updated input.tsx */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="bg-background border-border"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-muted-foreground/40 font-mono text-sm flex-shrink-0">—</span>
          <Input
            type="number"
            placeholder="Max"
            className="bg-background border-border"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* ── Condition ── */}
      <div className="space-y-4">
        <h4 className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Condition
        </h4>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger className="bg-background border-border focus:shadow-hard">
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

      {/* Apply — Button inherits rounded-none shadow-hard hover-translate from updated button.tsx */}
      <Button
        className="w-full h-11 font-display font-bold uppercase tracking-widest text-xs"
        onClick={applyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
}
