"use client";

import { useState } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function SidebarFilters() {
  const [priceRange, setPriceRange] = useState([0, 50000]);

  return (
    <div className="space-y-8 sticky top-24">
      {/* Condition Filter */}
      <div>
        <h3 className="font-display font-bold text-lg mb-4 text-foreground">Condition</h3>
        <div className="space-y-3">
          {["New (Sealed)", "Used - Like New", "Used - Good", "Refurbished"].map((condition) => (
            <div key={condition} className="flex items-center space-x-3 group">
              <Checkbox
                id={condition}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={condition}
                className="text-muted-foreground font-normal cursor-pointer group-hover:text-foreground transition-colors"
              >
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-display font-bold text-lg mb-4 text-foreground">Price Range</h3>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-muted-foreground text-sm">$</span>
            <Input
              type="text"
              value={priceRange[0]}
              className="pl-6 pr-2 h-9 font-mono text-sm"
              readOnly
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-muted-foreground text-sm">$</span>
            <Input
              type="text"
              value={priceRange[1]}
              className="pl-6 pr-2 h-9 font-mono text-sm"
              readOnly
            />
          </div>
        </div>
        <Slider
          defaultValue={[0, 50000]}
          max={100000}
          step={1000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="py-4"
        />
      </div>

      {/* Seller Rating */}
      <div>
        <h3 className="font-display font-bold text-lg mb-4 text-foreground">Seller Rating</h3>
        <div className="space-y-2">
          {[5, 4].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="rating" className="accent-primary w-4 h-4" />
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < rating ? "fill-current" : "text-muted fill-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">& Up</span>
            </label>
          ))}
        </div>
      </div>

      {/* Verified Toggle */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span>Verified Only</span>
          </div>
          <Switch className="data-[state=checked]:bg-primary" />
        </div>
      </div>
    </div>
  );
}
